const moteuService = require('../../services/moteurimmo.service');
const { normalizeListing } = require('./normalizer');
const db = require('../../models');
const config = require('../../config/moteurimmo.config');
const fs = require('fs');
const path = require('path');
const sanitize = require('sanitize-filename');

async function ensureUploads() {
  const uploads = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true });
  return uploads;
}

async function downloadImage(url, destFolder) {
  if (!url || typeof url !== 'string') return null;
  if (url.startsWith('data:')) return null;
  const maxAttempts = 3;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'debug', message: 'downloadImage.attempt', url, attempt }));
      const res = await moteuService.client.get(url, { responseType: 'stream', timeout: 20000 });
      const rawName = path.basename(url.split('?')[0]) || 'img';
      const fileName = `${Date.now()}_${sanitize(rawName)}`;
      const destPath = path.join(destFolder, fileName);
      const writer = fs.createWriteStream(destPath);
      res.data.pipe(writer);
      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
      console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'info', message: 'downloadImage.success', url, destPath }));
      return destPath;
    } catch (err) {
      console.log(JSON.stringify({ ts: new Date().toISOString(), level: 'warn', message: 'downloadImage.error', url, attempt, err: err && err.message }));
      if (attempt < maxAttempts) await new Promise(r => setTimeout(r, Math.min(5000, 1000 * Math.pow(2, attempt - 1))));
    }
  }
  return null;
}

async function createTimelineIfNeeded(propertyId, userId, type, meta = {}) {
  try {
    // prevent duplicate events: check latest event for this property+type
    const last = await db.timeline.findOne({ propertyId, type }).sort({ createdAt: -1 }).lean();
    const now = new Date();
    if (last) {
      // if same meta and recent (within 24h), skip
      const lastMeta = last.meta || {};
      const sameMeta = JSON.stringify(lastMeta) === JSON.stringify(meta);
      const lastCreated = last.createdAt || (last._id && last._id.getTimestamp && last._id.getTimestamp());
      const ageMs = lastCreated ? (now - new Date(lastCreated)) : 999999999;
      const ageHours = ageMs / (1000 * 60 * 60);
      if (sameMeta && ageHours < 24) {
        return null; // duplicate
      }
      // special-case price: if last.newPrice equals meta.new, skip
      if (type === 'priceChanged' || type === 'newPrice') {
        const lastNew = last.newPrice || (last.meta && (last.meta.new || last.meta.newPrice));
        const newVal = meta && (meta.new || meta.newPrice || meta.new_price) || null;
        if (lastNew != null && newVal != null && Number(lastNew) === Number(newVal)) return null;
      }
    }

    const payload = { propertyId, addedBy: userId, type, meta };
    if (type === 'priceChanged' && meta && (meta.old != null || meta.new != null)) {
      payload.oldPrice = meta.old != null ? Number(meta.old) : undefined;
      payload.newPrice = meta.new != null ? Number(meta.new) : undefined;
    }

    await db.timeline.create(payload);
  } catch (err) {
    console.warn('Failed to create timeline', err && err.message ? err.message : err);
  }
}

function inferPropertyType(rawType) {
  const normalized = String(rawType || '').toLowerCase();
  if (!normalized) return 'sale';
  if (/rent|location|rental|locatif|loué|bail/.test(normalized)) return 'rent';
  if (/directory|annonce|listing/.test(normalized)) return 'directory';
  return 'sale';
}

function inferPropertyKind(kindText) {
  const normalized = String(kindText || '').toLowerCase();
  if (/house|maison|villa/.test(normalized)) return 'house';
  if (/castle|chateau/.test(normalized)) return 'castle';
  if (/farm|ferme/.test(normalized)) return 'farm';
  if (/building|immeuble/.test(normalized)) return 'building';
  return 'apartment';
}

function inferPropertyStatus(listingStatus) {
  const normalized = String(listingStatus || '').toLowerCase();
  if (/sold|inactive|archived|unavailable|deleted|removed|cancelled|cancelled/.test(normalized)) return 'inactive';
  return 'active';
}

function buildPropertyPayload(dto, userId) {
  const propertyType = inferPropertyType(dto.propertyTypeRaw || dto.listingStatus);
  const propertyKind = inferPropertyKind(dto.propertyKind || dto.propertyTitle || dto.origin || dto.listingStatus);

  return {
    name: dto.propertyTitle || 'Imported from MoteurImmo',
    propertyTitle: dto.propertyTitle || 'Imported from MoteurImmo',
    content: dto.content || '',
    price: dto.price != null ? Number(dto.price) : null,
    originalPrice: dto.originalPrice != null ? Number(dto.originalPrice) : null,
    area: dto.surface != null ? String(dto.surface) : undefined,
    surface: dto.surface != null ? String(dto.surface) : undefined,
    rooms: dto.rooms != null ? String(dto.rooms) : undefined,
    bedrooms: dto.bedrooms != null ? String(dto.bedrooms) : undefined,
    bathroom: dto.bathrooms != null ? String(dto.bathrooms) : undefined,
    livingRoom: dto.livingRoom != null ? String(dto.livingRoom) : undefined,
    propertyFloor: dto.floor != null ? String(dto.floor) : undefined,
    address: dto.address || null,
    zipcode: dto.zipcode || null,
    city: dto.city || null,
    country: dto.country || 'France',
    newlocation: dto.position || (dto.location && Array.isArray(dto.location.coordinates) ? { type: 'Point', coordinates: [Number(dto.location.coordinates[0]) || 0, Number(dto.location.coordinates[1]) || 0] } : { type: 'Point', coordinates: [0, 0] }),
    images: [],
    propertyType,
    type: propertyKind,
    status: inferPropertyStatus(dto.listingStatus),
    isDeleted: false,
    importBy: 'platform',
    addedBy: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    propertyMonthlyCharges: dto.propertyMonthlyCharges != null ? Number(dto.propertyMonthlyCharges) : undefined,
    guaranteeDeposit: dto.guaranteeDeposit != null ? Number(dto.guaranteeDeposit) : undefined,
    propertyInventory: dto.propertyInventory != null ? Number(dto.propertyInventory) : undefined,
    building: dto.buildingYear || undefined,
  };
}

async function upsertListing(raw) {
  const dto = await normalizeListing(raw);
  console.log('DEBUG upsertListing dto summary:', {
    sourceId: dto.sourceId,
    adId: dto.adId,
    reference: dto.reference,
    title: dto.propertyTitle && dto.propertyTitle.slice(0,80),
    price: dto.price,
    images: (dto.images||[]).length,
  });
  const source = 'moteurimmo';
  // prefer explicit sourceId (normalizer now ensures a stable SHA1 fallback when possible)
  const sourceId = dto.sourceId || null;
  if (!sourceId) {
    console.warn('No stable sourceId available for listing; skipping import');
    return null;
  }

  let existing = await db.externalListing.findOne({ source, sourceId });

  const sysUser = await db.users.findOne({ email: 'system_anyhomes_importer@anyhomes.local' });
  const userId = sysUser ? sysUser._id : null;

  if (existing && existing.propertyId) {
    const prop = await db.property.findById(existing.propertyId);
    if (prop) {
      const updates = {};
      if (dto.price != null && dto.price !== prop.price) updates.price = dto.price;
      if (dto.propertyTitle && dto.propertyTitle !== prop.propertyTitle) updates.propertyTitle = dto.propertyTitle;
      if (dto.content && dto.content !== prop.content) updates.content = dto.content;
      if (dto.surface && String(dto.surface) !== String(prop.surface)) updates.surface = String(dto.surface);
      if (dto.rooms != null && String(dto.rooms) !== String(prop.rooms)) updates.rooms = String(dto.rooms);
      if (dto.bedrooms != null && String(dto.bedrooms) !== String(prop.bedrooms)) updates.bedrooms = String(dto.bedrooms);
      if (dto.bathrooms != null && String(dto.bathrooms) !== String(prop.bathroom)) updates.bathroom = String(dto.bathrooms);
      if (dto.floor != null && String(dto.floor) !== String(prop.propertyFloor)) updates.propertyFloor = String(dto.floor);
      if (dto.livingRoom != null && String(dto.livingRoom) !== String(prop.livingRoom)) updates.livingRoom = String(dto.livingRoom);
      if (dto.address && dto.address !== prop.address) updates.address = dto.address;
      if (dto.zipcode && dto.zipcode !== prop.zipcode) updates.zipcode = dto.zipcode;
      if (dto.city && dto.city !== prop.city) updates.city = dto.city;
      if (dto.country && dto.country !== prop.country) updates.country = dto.country;
      if (dto.position) updates.newlocation = dto.position;
      const newType = inferPropertyKind(dto.propertyKind || dto.propertyTitle || dto.origin || dto.listingStatus);
      if (newType && newType !== prop.type) updates.type = newType;
      const newPropertyType = inferPropertyType(dto.propertyTypeRaw || dto.listingStatus);
      if (newPropertyType && newPropertyType !== prop.propertyType) updates.propertyType = newPropertyType;
      const mappedStatus = inferPropertyStatus(dto.listingStatus);
      if (mappedStatus !== prop.status) updates.status = mappedStatus;
      if (Object.keys(updates).length) {
        updates.updatedAt = new Date();
        await db.property.updateOne({ _id: prop._id }, { $set: updates });
        if (updates.price != null) {
          await createTimelineIfNeeded(prop._id, userId, 'priceChanged', { old: prop.price, new: updates.price });
          console.log('Price changed for', prop._id, 'from', prop.price, 'to', updates.price);
        }
      }

      // images: create queued media jobs for any new images (frontend can use originalUrl immediately)
      const existingImages = (prop.images || []).map(i => i.originalname || i.fileName || '').filter(Boolean);
      const newImgs = (dto.images || []).filter(u => !existingImages.includes(u)).slice(0, 8);
      if (newImgs.length) {
        for (let imgUrl of newImgs) {
          // push a placeholder into property.images so front can display originalUrl immediately
          await db.property.updateOne({ _id: prop._id }, { $push: { images: { originalname: imgUrl, status: 'queued' } } });
          try {
            await db.mediaJob.create({ propertyId: prop._id, externalListingId: existing._id, originalUrl: imgUrl });
          } catch (err) {
            console.warn('Failed creating mediaJob for', imgUrl, err && err.message);
          }
        }
        await createTimelineIfNeeded(prop._id, userId, 'photosAdded', { count: newImgs.length });
        console.log('Queued', newImgs.length, 'photos for download for', prop._id);
      }
      // detect status changes
      const prevStatus = existing.status || null;
      const newStatus = dto.listingStatus || existing.status || null;
      if (prevStatus !== newStatus) {
        await createTimelineIfNeeded(prop._id, userId, 'statusChanged', { from: prevStatus, to: newStatus });
        console.log('Status changed for', prop._id, 'from', prevStatus, 'to', newStatus);
      }

      existing.raw = dto.external;
      existing.status = newStatus;
      existing.lastSyncAt = new Date();
      await existing.save();
      return prop._id;
    }
  }

  // create new property when none exists
  const propData = buildPropertyPayload(dto, userId);
  if (!dto.position && propData.newlocation && Array.isArray(propData.newlocation.coordinates) && propData.newlocation.coordinates[0] === 0 && propData.newlocation.coordinates[1] === 0) {
    console.warn('propData uses fallback coordinates [0,0] for newlocation — consider improving geo mapping');
  }

  let property;
  try {
    property = await db.property.create(propData);
  } catch (err) {
    console.error('Failed creating property', err && err.message ? err.message : err, 'propData keys=', Object.keys(propData));
    throw err;
  }

  // record original image URLs and create media jobs for background download
  const imageUrls = (dto.images || []).slice(0, 10);
  if (imageUrls.length) {
    const placeholders = imageUrls.map(u => ({ originalname: u, status: 'queued' }));
    property.images = (property.images || []).concat(placeholders);
    await property.save();
    for (let imgUrl of imageUrls) {
      try {
        await db.mediaJob.create({ propertyId: property._id, externalListingId: null, originalUrl: imgUrl });
      } catch (err) {
        console.warn('Failed creating mediaJob for new property', imgUrl, err && err.message);
      }
    }
  }

  let external;
  try {
    external = await db.externalListing.create({
      source,
      sourceId,
      reference: dto.reference,
      raw: dto.external,
      propertyId: property._id,
      status: dto.listingStatus,
      lastSyncAt: new Date(),
    });
  } catch (err) {
    console.error('Failed creating externalListing', err && err.message ? err.message : err, 'sourceId=', sourceId);
    throw err;
  }

  // timeline
  await createTimelineIfNeeded(property._id, userId, 'propertyCreated', { source, sourceId });

  return property._id;
}

async function runOnce({ page = 1, pageSize = config.defaultPageSize } = {}) {
  const params = { page, pageSize };
  const data = await moteuService.fetchListings(params);
  const listings = data && (data.items || data.listings || data) ? (data.items || data.listings || (Array.isArray(data) ? data : [])) : [];
  for (let raw of listings) {
    try {
      await upsertListing(raw);
    } catch (err) {
      console.error('Error upserting listing', err && err.message ? err.message : err);
    }
  }
  return listings.length;
}

module.exports = { runOnce, upsertListing };

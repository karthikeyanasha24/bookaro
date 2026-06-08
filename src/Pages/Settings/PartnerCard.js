import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/global/sidebar';
import ApiClient from '../../methods/api/apiClient';
import { useSelector } from 'react-redux';

const PartnerCard = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const reduxUser = useSelector((state) => state.user);
  const [form, setForm] = useState({
    subheading: '',
    title: '',
    bio: '',
    experienceYears: 0,
    clientsAccompanied: 0,
    ratingNotes: '',
    satisfactionRate: '',
    profilePhoto: '',
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const userId = reduxUser?._id || reduxUser?.id || null;
      let res = { success: false };
      if (userId) res = await ApiClient.get('user/detail', { id: userId });
      setLoading(false);
      if (res.success && res.data) {
        const f = res.data.featured || res.data.user?.featured || {};
        setForm({
          subheading: f.subheading || '',
          title: f.title || '',
          bio: f.bio || '',
          experienceYears: f.experienceYears || 0,
          clientsAccompanied: f.clientsAccompanied || 0,
          ratingNotes: f.ratingNotes || '',
          satisfactionRate: f.satisfactionRate || '',
          profilePhoto: f.profilePhoto || '',
        });
      }
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    const userId = reduxUser?._id || reduxUser?.id || null;
    const payload = { id: userId, featured: { ...form } };
    const res = await ApiClient.put('user/admin/update-profile', payload);
    setSaving(false);
    if (res.success) {
      alert('Enregistré.');
    } else {
      alert(res.error?.message || 'Échec');
    }
  };

  const ImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      alert('Format non supporté. JPG/PNG uniquement.');
      return;
    }
    setLoading(true);
    const res = await ApiClient.postFormData('upload/image', { file });
    setLoading(false);
    if (res.success) {
      setForm({ ...form, profilePhoto: res.fileName || res.file || '' });
    } else {
      alert(res.error?.message || 'Échec upload');
    }
  };

  return (
    <div className="settings-page grid grid-cols-12 gap-6">
      <div className="col-span-3">
        <Sidebar />
      </div>
      <div className="col-span-9">
        <h2 className="text-2xl font-semibold mb-4">Encart partenaire</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600">Sur-titre</label>
            <input value={form.subheading} onChange={e=>setForm({...form,subheading:e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Titre</label>
            <input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full border p-2" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Bio (max 30 mots)</label>
            <textarea value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} rows={3} className="w-full border p-2" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600">Clients accompagnés</label>
              <input type="number" value={form.clientsAccompanied} onChange={e=>setForm({...form,clientsAccompanied:parseInt(e.target.value||0)})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Note publique</label>
              <input value={form.ratingNotes} onChange={e=>setForm({...form,ratingNotes:e.target.value})} className="w-full border p-2" />
            </div>
            <div>
              <label className="block text-sm text-gray-600">Taux de clients satisfaits</label>
              <input value={form.satisfactionRate} onChange={e=>setForm({...form,satisfactionRate:e.target.value})} className="w-full border p-2" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600">Photo portrait (JPG/PNG)</label>
            <input type="file" accept="image/*" onChange={ImageUpload} className="w-full" />
            {form.profilePhoto ? (
              <div className="mt-2">
                <img src={form.profilePhoto.startsWith('http') ? form.profilePhoto : `/uploads/${form.profilePhoto}`} alt="preview" style={{ maxWidth: 160, maxHeight: 160 }} />
              </div>
            ) : null}
          </div>
          <div>
            <button disabled={saving} onClick={save} className="px-4 py-2 bg-blue-600 text-white rounded">{saving? 'Enregistrement...' : 'Enregistrer'}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;

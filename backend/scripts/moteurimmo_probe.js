#!/usr/bin/env node
require('dotenv').config();
const axios = require('axios');

const baseUrl = process.env.MOTEURIMMO_BASE_URL || 'https://moteurimmo.fr';
const apiUrl = `${baseUrl.replace(/\/$/, '')}/api/ads`;
const apiKey = process.env.MOTEURIMMO_API_KEY;
if (!apiKey) {
  console.error('MOTEURIMMO_API_KEY required in env');
  process.exit(1);
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

async function requestWithRetries(body){
  const max = 4;
  for (let i=1;i<=max;i++){
    try{
      return await axios.post(apiUrl, body, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });
    }catch(e){
      const s = e.response ? e.response.status : null;
      if (s===400) throw e; // bad request
      if (i===max) throw e;
      const wait = 500 * Math.pow(2,i);
      console.warn(`probe attempt ${i} failed (status=${s}), waiting ${wait}ms`);
      await sleep(wait);
    }
  }
}

async function probeCity(name, loc){
  console.log(`# City: ${name}`);
  const radii = [10,7,5,3,2];
  const priceBuckets = [ [0,200000],[200001,400000],[400001,600000],[600001,800000],[800001,1000000],[1000001,5000000] ];
  const types = ['sale','rental'];

  console.log('location,radius,type,minPrice,maxPrice,count,ok');
  for (let radius of radii){
    for (let t of types){
      for (let pb of priceBuckets){
        const body = { apiKey, locations: [ loc ], types: [t], minPrice: pb[0], maxPrice: pb[1], withCount: true, page:1, maxLength:1 };
        body.locations[0].radius = radius;
        let ok = true;
        let count = 'err';
        try{
          const res = await requestWithRetries(body);
          if (res && res.data && typeof res.data.count === 'number') count = res.data.count;
          else if (res && Array.isArray(res.data.ads)) count = res.data.ads.length;
          else count = 0;
        }catch(err){ ok=false; count = err.response ? err.response.status : err.message; }
        console.log(`${name},${radius},${t},${pb[0]},${pb[1]},${count},${ok}`);
        await sleep(800);
      }
    }
  }
}

async function main(){
  // Paris by insee
  await probeCity('Paris',{ inseeCode: '75056' });
  // Lille by lat/lon
  await probeCity('Lille',{ lat:50.62925, lon:3.057256 });
}

main().then(()=>process.exit(0)).catch(err=>{ console.error(err); process.exit(1); });

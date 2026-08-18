export default async function handler(req, res) {
  // 1. Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVvN3AlbRYguoTGWbyvUok7Ig9NQoxbIvVYHogMPcTo-0z2--Qlc1zkEnO-xHVongA/exec";

  const { id = 'demo', action = 'registrar' } = req.query;

  // 2. Extraer geolocalización desde Vercel o Headers de IP estándar
  const codigoPais = req.headers['x-vercel-ip-country'] || req.headers['cf-ipcountry'] || 'XX';
  const ciudadRaw = req.headers['x-vercel-ip-city'] || 'Desconocida';
  const paisRaw = req.headers['x-vercel-ip-country-region'] || codigoPais;

  let ciudad = 'Desconocida';
  let pais = 'Desconocido';

  try {
    ciudad = decodeURIComponent(ciudadRaw);
  } catch(e) {
    ciudad = ciudadRaw;
  }

  try {
    pais = decodeURIComponent(paisRaw);
  } catch(e) {
    pais = paisRaw;
  }

  // 3. Petición a Google Apps Script (siguiendo redirecciones explícitamente)
  try {
    const googleUrl = `${APPS_SCRIPT_URL}?action=${action}&id=${encodeURIComponent(id)}&pais=${encodeURIComponent(pais)}&codigo_pais=${encodeURIComponent(codigoPais)}&ciudad=${encodeURIComponent(ciudad)}&_=${Date.now()}`;
    
    const response = await fetch(googleUrl, { redirect: 'follow' });
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar con el backend', detalle: error.message });
  }
}

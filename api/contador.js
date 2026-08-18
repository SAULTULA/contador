export default async function handler(req, res) {
  // Permitir que el widget funcione embebido en cualquier sitio
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyVvN3AlbRYguoTGWbyvUok7Ig9NQoxbIvVYHogMPcTo-0z2--Qlc1zkEnO-xHVongA/exec";

  const { id = 'demo', action = 'registrar' } = req.query;

  // Geolocalización nativa de Vercel (súper precisa y rápida)
  const codigoPais = req.headers['x-vercel-ip-country'] || 'XX';
  const ciudad = req.headers['x-vercel-ip-city'] ? decodeURIComponent(req.headers['x-vercel-ip-city']) : 'Desconocida';
  
  // Mapeo simple de código a nombre de país
  const pais = req.headers['x-vercel-ip-country-region'] || codigoPais;

  try {
    const googleUrl = `${APPS_SCRIPT_URL}?action=${action}&id=${encodeURIComponent(id)}&pais=${encodeURIComponent(pais)}&codigo_pais=${encodeURIComponent(codigoPais)}&ciudad=${encodeURIComponent(ciudad)}&_=${Date.now()}`;
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error al conectar con el backend de Google' });
  }
}

export default function handler(req, res) {
  const country = req.headers['x-vercel-ip-country'] || 'AR';
  const city = req.headers['x-vercel-ip-city'] || 'Rosario del Tala';

  // Convierte el código de país (ej. AR) a Emoji de Bandera
  const flag = country.toUpperCase().replace(/./g, char =>
    String.fromCodePoint(127397 + char.charCodeAt())
  );

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    country,
    city: decodeURIComponent(city),
    flag
  });
}

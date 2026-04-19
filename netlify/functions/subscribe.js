export default async (req) => {
  // Permetti chiamate da GitHub Pages
  const headers = {
    'Access-Control-Allow-Origin': 'https://audiomagic.github.io',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { nome, email } = await req.json();
    if (!email || !nome) {
      return new Response(JSON.stringify({ error: 'Dati mancanti' }), { status: 400, headers });
    }

    const apiKey = Netlify.env.get('BREVO_API_KEY');
    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
      body: JSON.stringify({
        email,
        attributes: { FIRSTNAME: nome },
        listIds: [50],
        updateEnabled: true
      })
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
  }
};

export const config = { path: '/api/subscribe' };

export default async function handler(req, res) {
  // কুয়েরি প্যারামিটারগুলি এক্সট্রাক্ট করা
  const { id, server, referer } = req.query;

  // আবশ্যক প্যারামিটারগুলির ভ্যালিডেশন
  if (!id || !server) {
    return res.status(400).json({ error: 'Missing required query parameters: id or server' });
  }

  // server প্যারামিটার অনুযায়ী টার্গেট URL নির্ধারণ
  const baseUrls = {
    1: "https://uspro.click/jadoo/jadoo.php",
    2: "https://t.kyni.us/jadu/jadoo.php",
    3: "https://bdixtv24.site/jadoo/jadoo.php",
  };
  const targetBaseUrl = baseUrls[server];

  if (!targetBaseUrl) {
    return res.status(400).json({ error: 'Invalid server parameter' });
  }

  const targetUrl = `${targetBaseUrl}?id=${encodeURIComponent(id)}`;

  try {
    // টার্গেট URL এ রেফারার হেডার সহ রিকোয়েস্ট পাঠানো (যদি referer প্যারামিটার প্রদান করা থাকে)
    const headers = {};
    if (referer) {
      headers['Referer'] = referer;
    }

    const response = await fetch(targetUrl, { headers });

    // রিকোয়েস্ট সফল না হলে এরর ফিরিয়ে দেয়া
    if (!response.ok) {
      return res.status(response.status).send('Error fetching the resource');
    }

    // CORS হেডারস সেট করা যাতে ক্রস-অরিজিন রিকোয়েস্ট অনুমতি পায়
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // প্রযোজ্য কন্টেন্ট-টাইপ হেডারস সেট করা
    res.setHeader('Content-Type', response.headers.get('content-type'));

    // টার্গেট রিসোর্সের কন্টেন্ট ফিরিয়ে দেয়া
    const body = await response.arrayBuffer();
    res.status(200).send(Buffer.from(body));

  } catch (error) {
    // যেকোনো ত্রুটি হ্যান্ডেল করা
    return res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}


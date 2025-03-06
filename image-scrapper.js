const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

app.get('/scrape-images', async (req, res) => {
  const { url } = req.query;

  if (!url) return res.status(400).json({ error: 'URL is required' });

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const images = [];
    $('img').each((_, el) => {
      const src = $(el).attr('src');
      if (src && (src.startsWith('http') || src.startsWith('//'))) {
        images.push(src.startsWith('//') ? `https:${src}` : src);
      }
    });

    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to scrape images' });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

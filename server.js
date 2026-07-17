require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'sholat',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.get('/api/gerakan', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, id_kategori, nama, urutan, deskripsi, gambar_url, video_url FROM gerakan ORDER BY urutan');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.get('/api/bacaan', async (req, res) => {
  const id = req.query.id_gerakan;
  if (!id) return res.status(400).json({ error: 'id_gerakan required' });
  try {
    const [rows] = await pool.query('SELECT id_gerakan, urutan, teks_arab, teks_latin, terjemahan, audio_url, sumber FROM bacaan WHERE id_gerakan = ? ORDER BY urutan', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'DB error' });
  }
});

app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

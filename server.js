const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Обработка POST запроса с координатами
app.post('/location', (req, res) => {
  const { latitude, longitude } = req.body;
  console.log('Получена геолокация:', latitude, longitude);
  res.send('Координаты приняты');
});

app.listen(port, () => {
  console.log(`Сервер запущен на http://127.0.0.1:${port}/`);
});

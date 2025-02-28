const express = require('express');
const audioRoutes = require('./routes/audioRoutes.js');
const videoRoutes = require('./routes/videoRoutes.js');
const fs = require('fs');

const path = './app.log';
// import getImage from './routes/getImage.js';

const app = express();
const port = 3000;

app.use('/api/audio', audioRoutes);
app.use('/api/video', videoRoutes);
// app.use('/api/image', getImage);
app.use('/static', express.static('assets'));


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});


app.listen(port, '0.0.0.0', (err) => {
  if (err) {
      fs.appendFileSync(path, `Error: ${err.message}\n`);
      console.error('Error starting server:', err);
  } else {
      console.log(`Server running on http://0.0.0.0:${port}`);
  }
});
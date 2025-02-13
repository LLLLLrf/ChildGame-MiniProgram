import express from 'express';
import audioRoutes from './routes/audioRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
// import getImage from './routes/getImage.js';

const app = express();
const port = 3000;

app.use('/api/audio', audioRoutes);
app.use('/api/video', videoRoutes);
// app.use('/api/image', getImage);
app.use('/static', express.static('assets'));


// 全局错误处理
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

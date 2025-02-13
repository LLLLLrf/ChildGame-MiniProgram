import express from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// 清空.upload目录
fs.rmdir('uploads', { recursive: true }); 

// 确保 "uploads" 目录存在
await fs.mkdir('uploads', { recursive: true });

// 配置 Multer 存储 - 仅用于音频文件
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 音频文件存储路径
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 生成唯一文件名
  }
});

const uploadAudio = multer({ 
  storage: audioStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

// 配置 Multer 存储 - 仅用于视频文件
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 视频文件存储路径
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // 生成唯一文件名
  }
});

const uploadVideo = multer({ 
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  }
});

// 音频上传接口
app.post('/upload-audio', uploadAudio.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    console.log('Received audio:', req.file.filename);

    // 模拟音频分析（这里可以替换为实际的音频处理逻辑）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成模拟分析结果
    const analysisResult = `Audio "${req.file.originalname}" analyzed successfully. 
    Duration: 00:00:30
    Format: ${path.extname(req.file.originalname).slice(1)}
    Sample Rate: 44100 Hz
    Bit Rate: 192 kbps
    Content: The audio appears to contain ...`;

    // 处理完后删除文件
    // await fs.unlink(req.file.path);

    // 存储文件到./uploads
    const file = req.file;
    // save
    const oldPath = file.path;
    const newPath = path.join('uploads', file.originalname);
    await fs.rename(oldPath, newPath);
    

    res.json({ analysisResult });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Error processing audio' });
  }
});

// 视频上传接口
app.post('/upload-video', uploadVideo.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    console.log('Received video:', req.file.filename);

    // 模拟视频分析（这里可以替换为实际的视频处理逻辑）
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 生成模拟分析结果
    const analysisResult = `Video "${req.file.originalname}" analyzed successfully. 
    Duration: 00:00:30
    Resolution: 1280x720
    Format: ${path.extname(req.file.originalname).slice(1)}
    Content: The video appears to contain ...`;

    // 处理完后删除文件
    await fs.unlink(req.file.path);

    res.json({ analysisResult });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Error processing video' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

import express from 'express';
import multer from 'multer';
import { analyzeFile } from '../utils/fileUtils.js';

const router = express.Router();

// 配置 Multer 存储 - 音频文件
const uploadAudio = multer({ 
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('audio/')
      ? cb(null, true)
      : cb(new Error('Only audio files are allowed!'), false);
  }
});

// 音频上传接口
router.post('/upload', uploadAudio.single('audio'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No audio file uploaded' });

  try {
    const result = await analyzeFile(req.file, 'audio');
    res.json({ message: 'Audio analyzed successfully', result });
  } catch (error) {
    console.error('Error processing audio:', error);
    res.status(500).json({ error: 'Error processing audio' });
  }
});

export default router;

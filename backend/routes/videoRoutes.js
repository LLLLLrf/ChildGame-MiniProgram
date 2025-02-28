// import express from 'express';
// import multer from 'multer';
// import { analyzeFile } from '../utils/fileUtils.js';
const express = require('express');
const multer = require('multer');
const { analyzeFile } = require('../utils/fileUtils.js');

const router = express.Router();

// 配置 Multer 存储 - 视频文件
const uploadVideo = multer({ 
  storage: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}${file.originalname}`);
    }
  }),
  fileFilter: (req, file, cb) => {
    file.mimetype.startsWith('video/')
      ? cb(null, true)
      : cb(new Error('Only video files are allowed!'), false);
  }
});

// 视频上传接口
router.post('/upload', uploadVideo.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video file uploaded' });

  try {
    const result = await analyzeFile(req.file, 'video');
    res.json({ message: 'Video analyzed successfully', result });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Error processing video' });
  }
});

// export default router;
module.exports = router;

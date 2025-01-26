import express from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';

const app = express();
const port = 3000;

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Ensure the uploads directory exists
await fs.mkdir('uploads', { recursive: true });

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    console.log('Received video:', req.file.filename);

    // Simulate video processing (replace this with actual video analysis)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a mock analysis result
    const analysisResult = `Video "${req.file.originalname}" analyzed successfully. 
    Duration: 00:00:30
    Resolution: 1280x720
    Format: ${path.extname(req.file.originalname).slice(1)}
    Content: The video appears to contain ...`;

    await fs.unlink(req.file.path);

    res.json({ analysisResult });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Error processing video' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

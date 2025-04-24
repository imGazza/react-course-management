import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';

const app = express();
app.use(cors());

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/materials/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// File upload endpoint
app.post('/api/upload', upload.single('material'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ filePath: `/materials/${req.file.filename}` });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});
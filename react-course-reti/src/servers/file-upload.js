import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';  // Add this import

console.log('Server starting...');

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

app.post('/api/upload', upload.single('material'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nessun file caricato' });
    }
    res.json({ fileName: req.file.filename });
});

app.get('/api/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('public/materials/', fileName);
    
    res.download(filePath, (err) => {
        if (err) {
            res.status(404).send('File non trovato');
        }
    });
});

app.delete('/api/delete/:fileName', (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join('public/materials/', fileName);
    
    fs.unlink(filePath, (err) => {
        if (err) {
            return res.status(404).json({ error: 'File non trovato' });
        }
        res.json({ message: 'File cancellato correttamente' });
    });
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
})
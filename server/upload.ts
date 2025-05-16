import multer from 'multer';
import path from 'path';
import { Express, Request, Response } from 'express';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    // Allowed file types
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Error: Images Only!'));
  }
});

export function setupImageUpload(app: Express) {
  // Image upload endpoint
  app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      // Return the file path
      const filePath = `/uploads/${req.file.filename}`;
      return res.json({ filePath });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ message: 'File upload failed' });
    }
  });
}
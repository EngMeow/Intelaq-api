import tryCatch from '../utils/tryCatch.js';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
const __dirname = path.resolve();
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const imageProcessing = tryCatch(async (req, res, next) => {
  if (!req.file) return next();
  const ext = req.file.mimetype.split('/')[1];
  const userId = req.user.id;

  const filename = `${req.file.fieldname}-${userId}-${uuidv4()}-${Date.now()}.${ext}`;

  const filepath = path.join(
    __dirname,
    'backend',
    'public',
    'uploads',
    filename
  );

  if (!fs.existsSync('./backend/public/uploads')) {
    fs.mkdirSync('./backend/public/uploads', { recursive: true });
  }

  await sharp(req.file.buffer)
    .resize(1400, 1400)
    .toFormat('jpeg')
    .jpeg({ quality: 100 })
    .toFile(filepath);

  req.user.image = filename;

  await req.user.save();

  next();
});

export default imageProcessing;

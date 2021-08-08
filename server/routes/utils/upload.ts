import { Upload } from '../../types/interface';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

class Uploadfile {
  constructor() {}

  file(file: Upload) {
    let filename: any = null,
      paths: any = null;
    if (file) {
      paths = path.join(__dirname, `../media/${filename}`);
      filename = `${crypto.randomBytes(20).toString('hex')}.${
        file.mimetype.split('/')[1]
      }`;
      fs.writeFile(paths, file.buffer, () => {});
    }
    return paths;
  }
}

export const uploadFile = new Uploadfile();

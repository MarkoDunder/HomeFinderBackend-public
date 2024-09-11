import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
import * as FileType from 'file-type';

import path = require('path');
//import { Observable, from, of, switchMap } from 'rxjs';

type validFileExtension = 'png' | 'jpg' | 'jpeg';
type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpg',
  'image/jpeg',
];

export const saveImageToStorage = {
  storage: diskStorage({
    destination: './images',
    filename: (req, file, cb) => {
      const fileExtension: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;

      cb(null, fileName);
    },
  }),

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes: validMimeType[] = validMimeTypes;
    allowedMimeTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
  },
};

// Cannot access file type result if I use Observables, so I returned a Promise
export const isFileExtensionSafe = async (
  fullFilePath: string,
): Promise<boolean> => {
  try {
    const fileTypeResult = await FileType.fromFile(fullFilePath);
    if (!fileTypeResult) return false;

    const { ext, mime } = fileTypeResult;
    let isFileTypeLegit: boolean = false;
    let isMimeTypeLegit: boolean = false;

    //manual file checks were needed because I couldnt access the {ext, mime} object methods of includes
    for (const validExt of validFileExtensions) {
      if (ext === validExt) {
        isFileTypeLegit = true;
        break;
      }
    }

    for (const valiMime of validMimeTypes) {
      if (mime === valiMime) {
        isMimeTypeLegit = true;
        break;
      }
    }

    return isFileTypeLegit && isMimeTypeLegit;
  } catch (error) {
    console.error('Error determining file type:', error);
    return false;
  }
};

export const removeFile = (fullFilePath: string): void => {
  try {
    fs.unlinkSync(fullFilePath);
  } catch (error) {
    console.error(error);
  }
};

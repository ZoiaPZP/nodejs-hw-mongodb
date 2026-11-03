import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  secure: true,
});

export const uploadImageToCloudinary = async (fileBuffer, filename) => {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { public_id: `contacts/${filename}`, folder: 'contacts' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      )
      .end(fileBuffer);
  });
};

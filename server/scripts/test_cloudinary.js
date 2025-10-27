import 'dotenv/config';
import cloudinary from '../lib/cloudinary.js';

const TEST_IMAGE_URL = 'https://via.placeholder.com/150';

async function run() {
  try {
    console.log('Uploading test image to Cloudinary...');
    const res = await cloudinary.uploader.upload(TEST_IMAGE_URL, { folder: 'quickChat_tests' });
    console.log('Upload result (public_id):', res.public_id);
    console.log('Secure URL:', res.secure_url);
    process.exit(0);
  } catch (err) {
    console.error('Cloudinary upload failed:', err);
    process.exit(1);
  }
}

run();

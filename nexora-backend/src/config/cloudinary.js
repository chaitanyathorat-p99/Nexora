import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary lazily — called at first use, not at module load time.
 * This avoids the ES module hoisting issue where dotenv hasn't run yet
 * when this module is first imported.
 *
 * Required .env keys:
 *   CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_API_KEY
 *   CLOUDINARY_API_SECRET
 */
let configured = false;

const getCloudinary = () => {
  if (!configured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    configured = true;
  }
  return cloudinary;
};

export default getCloudinary;

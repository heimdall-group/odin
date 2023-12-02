import mongoose from "mongoose";
import { initializeApp, cert } from "firebase-admin/app";

export default async () => {
  try {
    if (!process.argv.includes('generate')) {
      initializeApp({
        credential: cert('./cert.json'),
      });
      const config = useRuntimeConfig();
      await mongoose.connect(config.MONGO_URL);
      console.log("DB connection true");
    }
  } catch (error) {
    console.error("DB connection false", error);
  }
};

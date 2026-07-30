import multer from "multer";

const storage = multer.memoryStorage();

export const parseMedia = multer({ storage })
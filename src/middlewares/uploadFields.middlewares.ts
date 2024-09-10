// UTILS
import fileUploader from "../utils/uploadFiles.utils";

/**
 * Middleware that handles file uploads for the "profile" and "products" fields.
 * The "profile" field allows a single file upload, while the "products" field allows up to 10 file uploads.
 * This middleware uses the `fileUploader` utility function to handle the file uploads.
 */
export const uploadFields = fileUploader.fields([
    { name: "profile", maxCount: 1 },
    { name: "products", maxCount: 10 },
]);

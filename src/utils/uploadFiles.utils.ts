// LIBRARIES
import multer from "multer";
// UTILS
import { rootPath } from "./path.utils";

/**
 * Configures the multer storage settings for file uploads.
 * The storage settings define the destination folder and filename generation for uploaded files.
 * The destination folder is determined based on the `fieldname` of the uploaded file:
 * - If the `fieldname` is "profile", the file is stored in the "/public/uploads/profiles" directory.
 * - If the `fieldname` is "products", the file is stored in the "/public/uploads/products" directory.
 * - For any other `fieldname`, the file is stored in the "/public/uploads/others" directory.
 * The filename is generated as `{timestamp}-{originalFileName}`.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "profile") {
            cb(null, rootPath + "/public/uploads/profiles");
        } else if (file.fieldname === "products") {
            cb(null, rootPath + "/public/uploads/products");
        } else {
            cb(null, rootPath + "/public/uploads/others");
        }
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileUploader = multer({ storage });

export default fileUploader;

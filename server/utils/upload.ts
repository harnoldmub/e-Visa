import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "server/uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage with application-specific folders
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { id } = req.params; // Application ID from route params

        // Create folder structure: uploads/{applicationId}/
        const appFolder = path.join(uploadsDir, id);

        if (!fs.existsSync(appFolder)) {
            fs.mkdirSync(appFolder, { recursive: true });
        }

        cb(null, appFolder);
    },
    filename: (req, file, cb) => {
        // Determine file type and create descriptive name
        const fieldName = file.fieldname; // 'photo' or 'passport'
        const ext = path.extname(file.originalname);

        // Format: photo.jpg or passport.pdf (simple, no timestamp)
        const filename = `${fieldName}${ext}`;

        cb(null, filename);
    },
});

// File filter for validation
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedMimes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPG, PNG, and PDF are allowed."), false);
    }
};

// Configure multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
});

// Helper to get relative path for database storage
export function getRelativeFilePath(absolutePath: string): string {
    return absolutePath.replace(process.cwd() + "/", "");
}

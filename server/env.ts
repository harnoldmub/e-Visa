import fs from "fs";
import path from "path";

// Manually load .env if not present
if (!process.env.DATABASE_URL) {
    try {
        const envPath = path.resolve(process.cwd(), ".env");
        if (fs.existsSync(envPath)) {
            const envFile = fs.readFileSync(envPath, "utf8");
            envFile.split("\n").forEach((line) => {
                const parts = line.split("=");
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    const value = parts.slice(1).join("=").trim().replace(/["]/g, ""); // Basic cleanup
                    if (key && !key.startsWith("#")) {
                        process.env[key] = value;
                    }
                }
            });
        }
    } catch (e) {
        console.error("Failed to load .env manually", e);
    }
}

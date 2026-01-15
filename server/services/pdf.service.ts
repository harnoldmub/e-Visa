import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ES modules compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

// Helper to convert file to base64 data URL
async function fileToDataUrl(filePath: string, mimeType: string): Promise<string | null> {
    try {
        const buffer = await fs.readFile(filePath);
        const base64 = buffer.toString('base64');
        return `data:${mimeType};base64,${base64}`;
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return null;
    }
}

export async function generateVisaPDF(application: any): Promise<Buffer> {
    try {
        // 1. Load HTML template
        const templatePath = path.join(__dirname, '../templates/visa-template.html');
        const templateHtml = await fs.readFile(templatePath, 'utf-8');

        // 2. Compile template with Handlebars
        const template = Handlebars.compile(templateHtml);

        // 3. Prepare photo URL (convert to base64 data URL for embedding)
        let photoUrl: string | null = null;

        // DEBUG LOGGING
        const log = async (msg: string) => {
            const time = new Date().toISOString();
            console.log(`[${time}] ${msg}`);
        };

        try {
            await log(`Starting PDF generation for App ID: ${application.id}, PhotoID: ${application.photoId}`);

            // Try application photo first
            if (application.photoId) {
                const photoDir = path.resolve(process.cwd(), 'server/uploads', String(application.id));
                const photoAbsolutePath = path.join(photoDir, application.photoId);
                await log(`Checking uploaded photo: ${photoAbsolutePath}`);

                if (await fileExists(photoAbsolutePath)) {
                    const ext = path.extname(photoAbsolutePath).toLowerCase();
                    const mime = ext === '.png' ? 'image/png' : 'image/jpeg';
                    photoUrl = await fileToDataUrl(photoAbsolutePath, mime);
                    await log(`Uploaded photo loaded. URL length: ${photoUrl?.length}`);
                } else {
                    await log(`Uploaded photo NOT found`);
                }
            } else {
                await log(`No photoId in application`);
            }

            // Fallback to default photo
            if (!photoUrl) {
                const defaultPhotoPath = path.resolve(process.cwd(), 'server/assets/default-photo.jpg');
                await log(`Checking default photo: ${defaultPhotoPath}`);
                const exists = await fileExists(defaultPhotoPath);
                await log(`Default photo exists? ${exists}`);

                if (exists) {
                    photoUrl = await fileToDataUrl(defaultPhotoPath, 'image/jpeg');
                    await log(`Default photo loaded. URL length: ${photoUrl?.length}`);
                } else {
                    await log(`Default photo NOT found at path`);
                    try {
                        const dir = path.dirname(defaultPhotoPath);
                        const files = await fs.readdir(dir);
                        await log(`Dir content of ${dir}: ${files.join(', ')}`);
                    } catch (e: any) {
                        await log(`Cannot read dir: ${e.message}`);
                    }
                }
            }
        } catch (e: any) {
            await log(`Error in photo logic: ${e.message}`);
        }

        // 4. Prepare logo URLs (if you have logos in assets)
        const logoArmoiriesPath = path.join(__dirname, '../assets/logos/armoiries-rdc.png');
        const logoDgmPath = path.join(__dirname, '../assets/logos/dgm-logo.png');
        const logoEvisaPath = path.join(__dirname, '../assets/logos/evisa-logo.png');

        const logoArmoiries = await fileExists(logoArmoiriesPath)
            ? await fileToDataUrl(logoArmoiriesPath, 'image/png')
            : null;

        const logoDgm = await fileExists(logoDgmPath)
            ? await fileToDataUrl(logoDgmPath, 'image/jpeg')
            : null;

        const logoEvisa = await fileExists(logoEvisaPath)
            ? await fileToDataUrl(logoEvisaPath, 'image/png')
            : null;

        // 5. Format data for template
        const visaTypeLabels: Record<string, string> = {
            VOLANT_ORDINAIRE: 'ORDINAIRE',
            VOLANT_SPECIFIQUE: 'SPECIFIQUE',
        };

        const genderLabels: Record<string, string> = {
            male: 'Masculin',
            female: 'Féminin',
        };

        // Determine stay days based on visa type
        const stayDays = application.visaType === 'VOLANT_SPECIFIQUE' ? '30' : '7';

        const data = {
            // Required fields
            visaNumber: application.applicationNumber || 'N/A',
            applicationNumber: application.applicationNumber || 'N/A',
            issueDate: new Date().toLocaleDateString('fr-FR'),
            visaTypeLabel: visaTypeLabels[application.visaType] || 'ORDINAIRE',
            firstName: application.firstName || '',
            lastName: application.lastName || '',
            nationality: application.nationality || '',
            passportNumber: application.passportNumber || '',
            stayDays,

            // Optional fields (with fallbacks)
            photoUrl,
            provenance: application.countryOfOrigin || '',
            accompaniedBy: '', // Not in current schema
            sponsorFullName: application.sponsorFirstName && application.sponsorLastName
                ? `${application.sponsorFirstName} ${application.sponsorLastName}`
                : '',
            addressInDRC: application.sponsorAddress || 'KINSHASA / GOMBE',

            // Additional info
            passportExpiry: application.passportExpiry
                ? new Date(application.passportExpiry).toLocaleDateString('fr-FR')
                : '',
            dateOfBirth: application.dateOfBirth
                ? new Date(application.dateOfBirth).toLocaleDateString('fr-FR')
                : '',
            placeOfBirth: application.placeOfBirth || '',
            gender: genderLabels[application.gender] || application.gender || '',
            civilStatus: application.civilStatus || '',
            occupation: application.occupation || '',
            address: application.address || '',
            arrivalDate: application.arrivalDate
                ? new Date(application.arrivalDate).toLocaleDateString('fr-FR')
                : '',
            purposeOfVisit: application.purposeOfVisit || '',

            // Logos
            logoArmoiries,
            logoDgm,
            logoEvisa,

            // Optional security features (not yet implemented)
            barcodeUrl: null,
            qrCodeUrl: null,
            stampUrl: null,
            signatureUrl: null,
        };

        // 6. Generate final HTML
        const html = template(data);

        // 7. Launch Puppeteer and generate PDF
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        const page = await browser.newPage();

        // Set content and wait for all resources to load
        await page.setContent(html, {
            waitUntil: 'networkidle0',
        });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '15mm',
                right: '15mm',
                bottom: '15mm',
                left: '15mm',
            },
        });

        await browser.close();

        console.log('✅ PDF generated successfully with Puppeteer');
        return Buffer.from(pdfBuffer);
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        throw new Error('Failed to generate PDF');
    }
}

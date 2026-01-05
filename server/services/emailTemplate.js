import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to load HTML template files
export const renderHtmlTemplate = async (templateName, data) => {
  try {
    const templatePath = path.join(__dirname, '../templates/html', `${templateName}.html`);
    let html = await fs.promises.readFile(templatePath, 'utf8');
    
    // Replace placeholders with actual data
    Object.keys(data).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, data[key]);
    });

    // Extract subject from HTML title tag or use default
    const titleMatch = html.match(/<title>(.*?)<\/title>/);
    const subject = titleMatch ? titleMatch[1] : `StreetsTools Notification`;

    return { subject, html };
  } catch (error) {
    console.error('Error reading HTML template:', error);
    throw new Error(`Template '${templateName}' not found`);
  }
};
import { PdfReader } from 'pdfreader';

const readPdfContent = async (buffer: Buffer): Promise<string> => {
    try {
        return new Promise((resolve, reject) => {
            let pdfText = '';
            const reader = new PdfReader();

            reader.parseBuffer(buffer, (err: any, item: any) => {
                if (err) {
                    reject(err);
                } else if (!item) {
                    resolve(pdfText);
                } else if (item.text) {
                    pdfText += item.text + ' ';
                }
            });
        });
    } catch (error) {
        throw new Error('Error reading Pdf file: ' + error);
    }
}

export default readPdfContent;
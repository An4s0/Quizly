import readPdf from "./readPdf";
import readDocx from "./readDocx";

const readFileContent = (fileBuffer: Buffer, fileExtension: string) => {    
    switch (fileExtension) {
        case 'pdf':
            return readPdf(fileBuffer);
        case 'docx':
        case 'doc':
            return readDocx(fileBuffer);
        default:
            throw new Error('Invalid file extension');
    }
}

export default readFileContent;
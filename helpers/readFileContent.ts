import { parseOfficeAsync } from "officeparser";

const readFileContent = async (fileBuffer: Buffer, fileExtension: string): Promise<string> => {
    const supportedExtensions = ['pdf', 'docx', 'doc', 'pptx', 'ppt'];

    if (!supportedExtensions.includes(fileExtension)) {
        throw new Error('Invalid or unsupported file extension');
    }

    try {
        const content = await parseOfficeAsync(fileBuffer);
        return content;
    } catch (error) {
        throw new Error('Error reading file: ' + (error as Error).message);
    }
};

export default readFileContent;

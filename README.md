<p align="center">
  <img src="https://i.imgur.com/JBwZdrb.png" alt="Logo">
</p>

# **Quizly**

Quizly is a web application that transforms your content into engaging quizzes in seconds. Upload a file (PDF, DOC, DOCX, PPT, or PPTS), and Quizly will generate a quiz with multiple-choice questions based on the content.

<p align="center">
  <img src="https://i.imgur.com/NL0lY0s.png" alt="Image">
</p>

## Features

- **File Upload**: Supports PDF, DOC, DOCX, PPT, and PPTS files.
- **Quiz Generation**: Automatically generates multiple-choice questions from the file content.
- **API Integration**: Uses the DeepSeek AI API for question generation.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Integration**: DeepSeek AI API
- **File Parsing**: officeparser (for PDF, DOC, DOCX, PPT, and PPTS)

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- DeepSeek API key (for quiz generation)

### Steps

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/An4s0/Quizly.git
    cd Quizly
    ```

2. **Install Dependencies:**

    ```bash
    npm install
    ```

3. **Enter DeepSeek API Key:**
   Add your `DEEPSEEK_API_KEY` in the `.env` file.

4. **Run the Development Server:**

    ```bash
    npm run dev
    ```

5. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a File:**
   - Drag and drop a file (PDF, DOC, DOCX, PPT, or PPTS) into the upload area or click to browse.
   - Supported file types: PDF, DOC, DOCX, PPT, PPTS.

2. **Generate Quiz:**
   - Click the "Generate Quiz" button.
   - The application will process the file and generate a quiz.

3. **Take the Quiz:**
   - Answer the multiple-choice questions.

4. **View Results:**
   - After completing the quiz, view your score.

## File Parsing

The application uses the following library to parse file content:

- **PDF, DOC/DOCX, PPT/PPTS**: officeparser

This library extracts text from the uploaded files, which is then passed to the AI model for quiz generation.

#### Developer: This project is developed and maintained solely by *Anas Almutary*.

<p align="center">
  <img src="https://i.imgur.com/JBwZdrb.png" alt="Logo">
</p>


# **Quizly**

Quizly is a web application that transforms your content into engaging quizzes in seconds. Upload a file (PDF, DOC, or DOCX), and Quizly will generate a quiz with multiple-choice questions based on the content.

<p align="center">
  <img src="https://i.imgur.com/NL0lY0s.png" alt="Image">
</p>

## Features

- **File Upload**: Supports PDF, DOC, and DOCX files.
- **Quiz Generation**: Automatically generates multiple-choice questions from the file content.
- **API Integration**: Uses the Google Generative AI API for question generation.
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Technologies Used

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI Integration**: Google Generative AI API
- **File Parsing**: pdfreader (for PDF), mammoth (for DOC/DOCX)

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Google Generative AI API key (optional for local development)

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


3. **Run the Development Server:**

    ```bash
    npm run dev
    ```

4. **Open the Application:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Upload a File:**
   - Drag and drop a file (PDF, DOC, or DOCX) into the upload area or click to browse.
   - Supported file types: PDF, DOC, DOCX.

2. **Enter Gemini API Key:**
   - Provide your Gemini API key in the designated field.
   - The key will be saved locally and used only for quiz generation.

3. **Generate Quiz:**
   - Click the "Generate Quiz" button.
   - The application will process the file and generate a quiz.

4. **Take the Quiz:**
   - Answer the multiple-choice questions.

5. **View Results:**
   - After completing the quiz, view your score.

## File Parsing

The application uses the following libraries to parse file content:

- **PDF**: pdfreader
- **DOC/DOCX**: mammoth

These libraries extract text from the uploaded files, which is then passed to the AI model for quiz generation.

#### Developer: This project is developed and maintained solely by *Anas Almutary*.
# Simple File Picker

Simple File Picker is designed to manage and process ZIP files directly within your browser.

It allows you to select a ZIP file, view its contents, duplicate and rename files, and download them individually.

This app is built with React. Uses JSZip to handle ZIP files.

## Using the Application

### For Users

1. **Select a ZIP File:** Click on the file input to select a ZIP file from your computer.
2. **View Files:** The names of the files within the ZIP will be displayed.
3. **Duplicate/Rename Files:** Use the text input to rename a file and click the "Duplicate" button to create a copy.
4. **Download Files:** Processed files can be downloaded by initiating the processing, which is managed through "Start", "Pause", and "Continue" controls.

### Development

#### Prerequisites

- Node.js (>= 18 recommended)
- npm or yarn

#### Setup and Running Locally

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/martintan/simple-file-picker.git
   cd simple-file-processor
   npm install
   npm run dev
   ```

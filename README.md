# Recorder X

[English](#english) | [中文](README-CN.md#chinese)

Recorder X is a powerful browser extension for recording and managing web page operations. It helps you capture, organize, and share your browsing activities with ease.

![Recorder X Screenshot](assets/image.png)

## Features

- 🎥 **Screen Recording**: Capture web page operations with high quality
- 📝 **Smart Organization**: Automatically organize recordings by title and timestamp
- 🖼️ **Screenshot Support**: Take and annotate screenshots during recording
- 📤 **Export Options**: Export recordings as Word documents or PDF files
- 🔄 **State Management**: Pause, resume, and stop recording at any time
- 📱 **Responsive Design**: Works perfectly on both desktop and mobile devices

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/recorder-x.git
cd recorder-x
```

2. Install dependencies:
```bash
pnpm install
```

3. Build the extension:
```bash
pnpm build
```

4. Load the extension in your browser:
- Open Chrome/Edge and navigate to the extensions page
- Enable Developer Mode
- Click "Load unpacked" and select the `dist` directory

## Usage

1. Click the extension icon to open the side panel
2. Click "Start Recording" to begin capturing
3. Perform the operations you want to record
4. Use the control buttons to pause/resume/stop recording
5. Export your recording as Word or PDF

## Development

```bash
# Start development server
pnpm dev

# Build for production
pnpm build
```
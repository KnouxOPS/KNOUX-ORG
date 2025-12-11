-----

# 🧠 Knoux SmartOrganizer PRO

**Transforming digital chaos into organized intelligence, one image at a time.**

**Knoux SmartOrganizer PRO** is a state-of-the-art, AI-powered image organization tool designed for professionals, creatives, and anyone with large image collections. It automatically classifies, renames, and organizes your photos with precision, privacy, and speed using strictly client-side technology.

-----

## ✨ Key Features

### 🤖 The AI Powerhouse

  * **Smart Classification:** Automatically categorize images into logical groups (Selfies, Documents, Nature, Food, etc.).
  * **AI Auto-Renaming:** Generate descriptive, SEO-friendly filenames based on actual image content.
  * **Face Detection & Counting:** Identify faces and demographic data using `face-api.js`.
  * **Emotion Detection:** *PRO Feature* – Analyze the mood of subjects in photos and classify accordingly.
  * **Duplicate Detection:** Detect exact duplicates and visually similar images using perceptual hashing.
  * **OCR Text Extraction:** Extract usable text from images and documents using `Tesseract.js`.
  * **NSFW Filtering:** Automatic safety classification and content filtering before processing.

### 🎨 Pro User Experience

  * **Interactive Dashboard:** Live statistics on duplicates found, text extracted, and processing speed.
  * **Modern UI:** Responsive React 18 design with `Framer Motion` animations and `Radix UI` primitives.
  * **Theme Support:** Built-in Dark/Light toggle.
  * **Smart Suggestions:** AI-powered recommendations for better folder structures.
  * **Export Data:** *PRO Feature* – Export your organization reports to CSV or JSON.
  * **Offline Capable:** Works fully offline after the initial model load.

-----

## 🔒 Security & Privacy First

> **Your data never leaves your device.**

  * **100% Client-Side Processing:** All machine learning models (TensorFlow.js, Tesseract, etc.) run directly in your browser.
  * **Encrypted Local Storage:** Results and settings are stored securely on your local machine.
  * **No Data Collection:** We do not track your images or upload them to external servers.

-----

## 🛠 Technical Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, TailwindCSS, Vite |
| **UI Library** | Radix UI, Framer Motion, Lucide Icons |
| **AI / ML** | TensorFlow.js, face-api.js, Tesseract.js |
| **Performance** | Web Workers (Parallel Processing), Virtualized Lists |
| **Testing** | Vitest, ESLint, Prettier |

-----

## 🚀 Quick Start

### Prerequisites

  * **Node.js:** v18 or higher
  * **Package Manager:** npm or yarn

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/KnouxOPS/KNOUX-ORG.git
    cd KNOUX-ORG
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Download AI Models (Optional but Recommended)**
    For enhanced face detection, download the pre-trained models.

      * Visit the [face-api.js model repository](https://github.com/justadudewhohacks/face-api.js/tree/master/weights).
      * Download the `.json` and `.bin` files.
      * Place them in `public/models/face-api/`.
      * *Note: The app will work with fallback rules if these are missing.*

4.  **Start the development server**

    ```bash
    npm run dev
    ```

5.  **Launch**
    Visit `http://localhost:8080` to start organizing\!

-----

## 🎯 How to Use

1.  **Upload:** Drag and drop images onto the upload zone (supports JPEG, PNG, GIF, WebP, BMP, SVG).
2.  **Configure:** Toggle specific AI agents (Rename, Face Detect, OCR, Duplicate Finding) via the sidebar.
3.  **Process:** Click **"Smart Organize"**. Watch the real-time indicators as Web Workers process images in parallel.
4.  **Review:** Use the dashboard to filter by category, view extracted text, or manage duplicates.
5.  **Export:** Download your organized structure or export the metadata report to CSV/JSON.

-----

## 🏗 Architecture & Project Structure

The project follows a modular architecture to separate UI concerns from the AI engine.

```text
src/
├── components/
│   ├── ui/                 # Reusable Radix/Tailwind components
│   ├── image-dropzone.tsx  # Drag & drop logic
│   ├── dashboard/          # Stats and charts
│   └── ...
├── hooks/
│   └── use-image-organizer.ts  # Main logic hook
├── lib/
│   ├── ai-engine.ts        # Core TensorFlow/ML logic
│   ├── workers/            # Web Workers for background processing
│   └── utils.ts            # Helpers
├── pages/
│   └── Index.tsx           # Main application entry
├── types/
│   └── organizer.ts        # TypeScript interfaces
└── ...
```

### API Reference (Internal)

**`useImageOrganizer` Hook**
The primary interface for the frontend to interact with the AI engine.

```typescript
const { 
  images,       // Array of processed images
  progress,     // Real-time processing state
  stats,        // Aggregated data (count, types, errors)
  processImages // Trigger the AI pipeline
} = useImageOrganizer();
```

**`AIEngine` Class**
Located in `src/lib/ai-engine.ts`.

```typescript
const aiEngine = new AIEngine();
await aiEngine.initializeModels(); 
const analysis = await aiEngine.analyzeImage(file);
// Returns: { category, tags, faceCount, hasText, isSafe }
```

-----

## 🔧 Configuration

  * **Environment Variables:** None required (Client-side architecture).
  * **Customizing Categories:** Edit `src/types/organizer.ts` to add new default categories.
  * **Model Thresholds:** Adjust confidence thresholds for NSFW or Face Detection in `src/lib/ai-engine.ts`.

-----

## 🤝 Contributing

We welcome contributions from the community\!

1.  **Fork** the repo.
2.  **Create a feature branch:** `git checkout -b feature/amazing-feature`
3.  **Commit your changes:** `git commit -m 'Add amazing feature'`
4.  **Push to branch:** `git push origin feature/amazing-feature`
5.  **Open a Pull Request.**

-----

## 📚 Resources

  * **Documentation:** See the `/docs` folder for advanced configuration.
  * **GitHub Repository:** [KNOUX-ORG](https://www.google.com/search?q=https://github.com/KnouxOPS/KNOUX-ORG)

-----

## 💖 Credits

**Built with love by Knoux Technologies.**

Special thanks to the open-source community:

  * *TensorFlow.js* for browser-based ML.
  * *face-api.js* for bringing vision to the web.
  * *Tesseract.js* for optical character recognition.

-----

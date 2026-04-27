# SPRM Quest: Operations Manual

This guide provides step-by-step instructions for setting up, developing, and deploying **SPRM Quest**.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
*   **Node.js** (v16 or higher)
*   **npm** (comes with Node.js)
*   **Android Studio** (for mobile builds)
*   **Git** (optional, for version control)

---

## 🛠️ Initial Setup

1.  **Clone or Download** the project folder.
2.  **Open Terminal** in the project root (`sprm-quest-game`).
3.  **Install Dependencies**:
    ```powershell
    npm install
    ```

---

## 🚀 Running the Game

### 1. Desktop Mode (Electron)
The best way to play/test on your computer with a windowed experience:
```powershell
npm start
```

### 2. Local Host / Browser Mode
To run the game in your web browser (Chrome, Edge, etc.):
```powershell
# Start a local web server
npm run serve-game
```
Then open `http://localhost:3000` in your browser.
*(Note: If port 3000 is busy, check the terminal for the new port number assigned!)*

---

## 📱 Mobile Deployment (Android)

### Step 1: Sync Web Assets
Whenever you change the game's HTML, CSS, or JS, you must sync them to the Android project:
```powershell
npx cap sync
```

### Step 2: Open Android Studio
```powershell
npx cap open android
```

### Step 3: Build the APK
1.  Wait for Android Studio to finish indexing.
2.  Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
3.  Click **"locate"** in the notification to find `app-debug.apk`.

### Step 4: Installation
1.  Uninstall any old version of the game from your phone.
2.  Transfer the new `.apk` to your phone and open it to install.

---

## 📦 Desktop Distribution (.exe)

To create a portable Windows executable:
```powershell
npm run dist
```
The `.exe` file will be generated in the `dist/` folder.

---

## 🔍 Troubleshooting

### Error: `EPERM: operation not permitted`
This happens when Android Studio or a background process locks the files.
*   **Fix**: Close Android Studio and run:
    ```powershell
    Remove-Item -Recurse -Force android/app/src/main/assets/public; npx cap sync
    ```

### Error: `Web page not available (net::ERR_CLEARTEXT_NOT_PERMITTED)`
*   **Fix**: This is already resolved in the latest code using `https://localhost`. Ensure you are using the updated `capacitor.config.json` and `AndroidManifest.xml`.

### Error: `Gradle build failed`
*   **Fix**: In Android Studio, go to **Build > Clean Project**, then try building the APK again.

# 📝 Offline‑Capable Notes App with Conflict Resolution

This is a feature-rich notes application built using **Angular 20** and **Node.js 22**. It supports offline usage, Firebase Firestore synchronization, and handles data conflicts intelligently using `@ngrx/signals`.

---

## 🚀 Setup Instructions

### ✅ Prerequisites

- Node.js v22+
- Angular CLI v17+ (Angular 20 compatibility)
- Firebase project with Firestore and Anonymous Auth enabled

### 📦 Install Dependencies

```bash
npm install
```

### 🔐 Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project → Enable Firestore → Enable **Anonymous Auth**
3. Copy your Firebase config into `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_KEY',
    authDomain: 'YOUR_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_BUCKET',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
```

### ▶️ Run the App Locally

```bash
ng serve
```

Visit: `http://localhost:4200`

---

## ☁️ Live Demo

The app is also deployed and available online via Firebase Hosting:

🔗 **Live App:** [https://note-app-2f1e4.web.app/](https://note-app-2f1e4.web.app/)  

---

## 📡 How to Simulate Offline & Conflict Scenarios

### 🌐 Simulate Offline

1. Open browser dev tools → Network tab → Set to “Offline”
2. Add or edit notes while offline
3. Restore connection → App will sync automatically
4. Notes will appear in Firestore when reconnected

### ⚔️ Simulate Conflict Resolution

1. Open the app in **two browser tabs**
2. In Tab 1: Edit a note (e.g. change content) → Stay **online**
3. In Tab 2: Edit the same note → **Go offline**
4. In Tab 1: Save changes (which syncs to Firestore)
5. In Tab 2: Come back online → App detects version conflict
6. Conflict UI will show unresolved notes with multiple versions

---

## 🧱 Project Structure

```
src/
│
├── app/
│   ├── components/
│   │   ├── note-editor/        # Modal editor for notes
│   │   ├── note-list/          # Renders list of notes
│   │   ├── sync-status/        # Shows online/offline sync status
│   │
│   ├── services/
│   │   ├── auth.service.ts     # Handles anonymous login
│   │   ├── notes-store.ts      # Signal store for notes + sync + conflicts
│   │
│   ├── models/
│   │   └── note.model.ts       # `Note` type definition
│   │
│   ├── app.component.ts        # Root UI logic
│   └── app.config.ts           # Bootstrap + Firebase providers
│
└── environments/
    └── environment.ts          # Firebase config
```

---

## ⚙️ Key Features

- ✅ Anonymous Login via Firebase Auth
- ✅ Offline-first notes editor with Firestore sync
- ✅ Conflict resolution using version and content diff
- ✅ Undo/Redo support via signals
- ✅ Clean modular architecture (components + stores + services)
- ✅ Signals-based reactive state management with `@ngrx/signals`

---

## 🧠 Built With

- Angular 20 (Standalone Components)
- Firebase v10+ (Modular SDK)
- Firestore with offline persistence
- @ngrx/signals for state management

---

## ✨ Bonus (Optional Ideas)

- [ ] Undo/Redo for notes
- [ ] LocalStorage cache for faster startup
- [ ] Merge editor to resolve conflict fields interactively

---

## 🧪 License & Contributions

MIT — Contributions welcome!
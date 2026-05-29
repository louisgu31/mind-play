# MindPlay

A polished cross-platform game hub with multiple mini-games, built with React + TypeScript + Electron.

## Features

- 🎮 Multiple mini-games (Wordle, Crossword, Connections, Chess, Sudoku, Memory)
- 🌐 Bilingual support (English / Simplified Chinese)
- 🌙 Dark / Light mode
- 📱 Responsive design (mobile-first)
- 💾 Local storage persistence
- ✨ Smooth animations and transitions
- 💻 Desktop app support with Electron

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Zustand** - State management
- **React i18next** - Internationalization
- **Lucide React** - Icons
- **Electron** - Desktop app framework
- **Electron Builder** - Packaging

## Getting Started

### Prerequisites

- Node.js 18+ installed

### Installation

1. Navigate to the project directory:
```bash
cd mindplay
```

2. Install dependencies:
```bash
npm install
```

### Development

#### Web
```bash
npm run dev
```
Open `http://localhost:3000`

#### Desktop
```bash
npm run electron:dev
```

### Build for Production

#### Web
```bash
npm run build
```

#### Desktop
```bash
# Build the app for your platform
npm run electron:dist
```
The built files will be in the `dist-electron` directory.

## Project Structure

```
mindplay/
├── electron/           # Electron main process files
├── src/
│   ├── games/          # Game implementations
│   ├── locales/        # Translation files
│   ├── screens/        # App screens
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   ├── store.ts        # Zustand store
│   ├── i18n.ts         # i18n configuration
│   └── index.css       # Global styles
├── assets/             # App assets
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Games

### Wordle
Guess the 5-letter word in 6 attempts.

### Crossword
Solve the daily crossword puzzle.

### Connections
Group words into categories.

### Chess
Play chess with a friend locally.

### Sudoku
Fill the grid with numbers 1-9.

### Memory
Match pairs of cards.

## License

MIT

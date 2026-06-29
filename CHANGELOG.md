# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2026-06-29

### 🎉 Added

#### Chess Journey Mode
- **20 AI Opponents with Unique Personalities**
  - Training Bot (ELO 100) - Makes random mistakes to help beginners learn
  - Curious Player (ELO 180) - Tries different things, learns from mistakes
  - Eager Student (ELO 260) - Likes to attack, sometimes overextends
  - Methodical Mind (ELO 380) - Focuses on piece placement and center control
  - Rising Player (ELO 500) - Developing a balanced playing style
  - Sharp Shooter (ELO 650) - Looks for forks, pins, and discovered attacks
  - Steady Defender (ELO 750) - Hard to break, excellent at holding positions
  - Club Starter (ELO 850) - Good opening knowledge, solid development
  - Attack Dog (ELO 950) - Launches attacks, sacrifices for initiative
  - Tactician (ELO 1100) - Sharp calculations, dangerous tactics
  - Position Master (ELO 1200) - Excellent piece coordination and space
  - Fortress Builder (ELO 1300) - Creates fortress-like positions, patient
  - Combiner (ELO 1400) - Blends tactics with positional play
  - Endgame Wizard (ELO 1500) - Exceptional technique in endings
  - Mastermind (ELO 1600) - Deep calculation, complex plans
  - Grandmaster (ELO 1700) - World-class understanding of the game
  - Super GM (ELO 1800) - Supreme positional understanding
  - Champion (ELO 1900) - Brilliant tactician, sharp as a razor
  - Legend (ELO 1950) - Perfect endgame technique
  - The Impossible King (ELO 2000) - The ultimate chess master, final boss

- **Progression System**
  - Sequential level unlocking - must defeat current level to unlock next
  - Completed levels remain replayable for better star ratings
  - Progress saved automatically in localStorage
  - Visual locked/unlocked states with padlock icons

- **Star Rating System**
  - 1 Star: Win the match
  - 2 Stars: Win with strong performance (quick win OR few blunders)
  - 3 Stars: Perfect game (quick win AND few blunders)
  - Maximum 60 stars across all 20 levels
  - Stars displayed under each completed level

- **4 Milestone Rewards**
  - Level 5: "Rising Player"
  - Level 10: "Tactician"
  - Level 15: "Mastermind"
  - Level 20: "Chess Conqueror"
  - Animated unlock popups with milestone descriptions
  - Titles displayed in player profile and stats

- **Premium Journey Map UI**
  - Card-based level selection matching MindPlay theme
  - Color-coded tiers (Green → Blue → Purple → Orange → Rainbow)
  - Overall progress bar with percentage display
  - Star counter in header
  - Player title showcase section
  - Milestones grid with lock/unlock visual states

- **AI Personality Descriptions**
  - Each level shows unique personality trait
  - Descriptions help players understand AI behavior
  - Makes each opponent feel distinct and memorable

#### Enhanced Gameplay Features
- **Smooth Animations** (using Framer Motion)
  - Staggered entrance animations for level cards
  - Scale effects on hover
  - Victory celebration with animated stars
  - Pulse effect on current level
  - Animated progress bar
  - "AI is thinking" indicator with bouncing dots

- **Theme Consistency**
  - Perfectly matches MindPlay's design language
  - Dark/Light mode support throughout
  - Tailwind CSS styling
  - Premium rounded corners and shadows
  - Consistent typography and spacing

- **Performance Optimizations**
  - Asynchronous AI move generation
  - Efficient evaluation functions
  - Minimax algorithm with alpha-beta pruning
  - Move ordering for faster searches
  - Progressive depth scaling based on piece count

### 🎨 Improved

- **Chess Menu Redesign**
  - Cleaner layout with premium card design
  - Player vs Player and Chess Journey clearly separated
  - Animated buttons with scale effects
  - Progress summary display

- **Level Card Design**
  - Shows: Level number, AI name, ELO rating
  - Personality description with icon
  - Completion status with checkmark badge
  - Star rating display for completed levels
  - Tier-colored borders and backgrounds
  - Hover effects and smooth transitions

- **Victory/Defeat Screens**
  - Animated trophy icon
  - Star rating reveal with bounce animations
  - Next level unlock notification
  - Quick action buttons (Map, Next, Try Again)
  - Milestone unlock popups with special styling

### 🐛 Fixed

- **Chess Engine**
  - Improved AI difficulty scaling
  - Better evaluation function accuracy
  - Enhanced move validation
  - Fixed edge cases in check detection

- **UI/UX**
  - Theme switching compatibility
  - Responsive design improvements
  - Console error resolution
  - TypeScript strict mode compliance

---

## [1.2.0] - Previous Release

### 🎉 Added

- Multiple brain training games
- Daily puzzles system
- XP and progression system
- Creature collection and evolution
- Island exploration
- Statistics tracking
- Dark/Light theme support
- Mobile responsive design
- i18n internationalization (English & Chinese)
- Desktop app with Electron
- GitHub Pages deployment

---

## How to Update

1. **Web Version (GitHub Pages)**
   ```bash
   npm run build:web
   npm run deploy
   ```

2. **Desktop Version**
   ```bash
   npm run build:desktop
   npm run electron:dist
   ```

3. **Development**
   ```bash
   npm install
   npm run dev
   ```

---

**Last Updated**: June 29, 2026
**Version**: 1.3.0

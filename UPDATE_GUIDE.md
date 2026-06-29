# 🎮 MindPlay - Update Guide

## ✅ LIVE NOW!

**Website**: https://louisgu31.github.io/mind-play/

**GitHub Repository**: https://github.com/louisgu31/mind-play

**Version**: 1.3.0

---

## 🚀 How to Update Your App (For Yourself & Users)

### For YOU (Developer):

1. **Make changes to code**
   - Edit any file in `/src`
   - Example: Update `ChessScreen.tsx`, `chessEngine.ts`, etc.

2. **Test locally**
   ```bash
   cd "/Users/yuxianggu/Desktop/trae/mind play"
   npm run dev
   ```
   Open: http://localhost:3002/mind-play/

3. **Build & Deploy**
   ```bash
   npm run deploy
   ```
   - Updates website automatically at https://louisgu31.github.io/mind-play/
   - Takes about 1-2 minutes

4. **Push code to GitHub (optional)**
   ```bash
   git add .
   git commit -m "Describe your changes"
   git push origin development-meta-game
   ```

---

### For USERS (People who downloaded/installed your app):

#### Web Users:
- Just visit: https://louisgu31.github.io/mind-play/
- They always get the latest version automatically! ✅

#### Desktop App Users (if you build one):
- They need to download the new version from GitHub Releases
- You would need to:
  1. Build desktop app: `npm run electron:dist`
  2. Create release on GitHub with the .dmg/.exe files
  3. Users download the new installer

---

## 📋 Common Update Workflow

### 1. Fix a Bug
```bash
# Make changes
npm run dev          # Test
npm run deploy       # Deploy
```

### 2. Add New Feature
```bash
# Make changes
npm run dev          # Test
npm run build:web    # Build
npm run deploy       # Deploy
git add .
git commit -m "Added new feature"
git push origin development-meta-game
```

### 3. Update Version
```bash
# Edit package.json
# Change "version": "1.3.0" to "1.3.1" (or 1.4.0, etc.)
npm run deploy
```

---

## 🔧 Update GitHub Repository Too

To keep your GitHub code updated:

```bash
cd "/Users/yuxianggu/Desktop/trae/mind play"

# After making changes
git add .
git commit -m "Your update message"
git push origin development-meta-game
```

---

## 📦 Version Number Guide

- **Bug fixes**: 1.3.0 → 1.3.1
- **New features**: 1.3.1 → 1.4.0
- **Major changes**: 1.4.0 → 2.0.0

Update version in `package.json` before deploying!

---

## 🌐 Deploy Checklist

- [ ] Edit code
- [ ] Test with `npm run dev`
- [ ] Update version in `package.json`
- [ ] Run `npm run deploy`
- [ ] Wait 1-2 minutes for GitHub Pages to update
- [ ] Test live site: https://louisgu31.github.io/mind-play/

---

## 💡 Quick Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build:web

# Deploy to GitHub Pages
npm run deploy

# Push to GitHub
git add .
git commit -m "Your message"
git push origin development-meta-game

# Build desktop app
npm run electron:dist
```

---

## 🆘 Troubleshooting

**Website not updating?**
- Wait 2-3 minutes (GitHub Pages takes time)
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check: https://github.com/louisgu31/mind-play/settings/pages

**Build errors?**
- Run `npm install` first
- Check TypeScript errors in terminal

**Git push fails?**
- Make sure you're logged into GitHub
- Check internet connection

---

## 📱 For Mobile Users

Web app works on mobile browsers too! No app store needed.

**Users can:**
1. Open: https://louisgu31.github.io/mind-play/
2. Add to Home Screen (Safari: Share → Add to Home Screen)
3. App icon appears on their phone like a native app!

---

**Questions?** Check the README.md or GitHub Issues page.

**Version**: 1.3.0 | **Updated**: June 29, 2026

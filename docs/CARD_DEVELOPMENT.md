# Caltrain Tracker Card Development Guide

## 🎯 What We Built

A custom Lovelace card that displays real-time Caltrain arrivals in a beautiful, dashboard-friendly format.

## 📁 Project Structure

```
HA_Caltrain_tracker/
├── custom_components/
│   └── caltrain_tracker/        # Integration (existing)
├── src/
│   └── caltrain-tracker-card.ts # Card source code
├── dist/                         # Built card (generated)
│   └── caltrain-tracker-card.js
├── package.json                  # npm dependencies
├── tsconfig.json                 # TypeScript config
├── rollup.config.js              # Build configuration
└── hacs.json                     # HACS config (for integration)
```

## 🚀 Build Instructions

### Prerequisites

Install Node.js and npm:
```bash
# Using Homebrew on macOS
brew install node

# Verify installation
node --version
npm --version
```

### Building the Card

```bash
# Navigate to project root
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker

# Install dependencies (one-time)
npm install

# Build the card
npm run build

# Or watch for changes during development
npm run watch
```

This creates `dist/caltrain-tracker-card.js` ready for use in Home Assistant.

## 📦 Installation

### Option 1: Via HACS (Recommended)

**Users need to add your repo TWICE:**

1. **Integration** (already done):
   - HACS → Integrations → Add Custom Repository
   - URL: `https://github.com/AlexanderRosenberg/HA_Caltrain_tracker`
   - Type: Integration

2. **Card** (new):
   - HACS → Frontend → Add Custom Repository  
   - URL: `https://github.com/AlexanderRosenberg/HA_Caltrain_tracker`
   - Type: Dashboard
   - Note: This installs `dist/caltrain-tracker-card.js` to `www/community/`

### Option 2: Manual Installation

1. Build the card (see above)
2. Copy `dist/caltrain-tracker-card.js` to:
   ```
   /config/www/caltrain-tracker-card.js
   ```
3. Add resource in Home Assistant:
   - Settings → Dashboards → Resources (⋮ menu)
   - Add Resource
   - URL: `/local/caltrain-tracker-card.js`
   - Type: JavaScript Module

## 🎨 Using the Card

### Basic Configuration

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
```

### Full Configuration

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_southbound
name: "My Station"              # Optional: Custom title
show_alerts: true                # Optional: Show service alerts (default: true)
max_trains: 3                    # Optional: Number of trains to show (default: 3)
```

### Example Dashboard

```yaml
views:
  - title: Commute
    cards:
      - type: custom:caltrain-tracker-card
        entity: sensor.caltrain_palo_alto_northbound
        name: "Northbound to SF"
        max_trains: 5
      
      - type: custom:caltrain-tracker-card
        entity: sensor.caltrain_san_antonio_southbound
        name: "Southbound to SJ"
        max_trains: 3
```

## ✨ Card Features

### Display Elements

1. **Header**
   - Station name (customizable)
   - Direction (Northbound/Southbound)
   - Train count badge

2. **Next Trains** (up to max_trains)
   - Route name (Local/Limited/Baby Bullet)
   - Arrival time (e.g., "02:15 PM")
   - ETA countdown with color coding:
     - 🔴 Red: < 5 minutes (urgent)
     - 🟠 Orange: 5-10 minutes (soon)
     - 🟢 Green: > 10 minutes (plenty of time)

3. **Service Alerts** (when active)
   - Alert icon and header
   - Alert description
   - Warning-styled background

4. **Footer**
   - Last update timestamp

### Responsive Design

- Auto-adjusts to theme colors
- Hover effects on train items
- Mobile-friendly layout
- Icon animations

### Theme Integration

Uses Home Assistant theme variables:
- `--primary-color`
- `--primary-text-color`
- `--secondary-text-color`
- `--error-color`
- `--warning-color`
- `--success-color`
- `--card-background-color`
- `--divider-color`

## 🔧 Development

### File Structure

**`src/caltrain-tracker-card.ts`**
- Main card implementation
- TypeScript with LitElement
- Uses Home Assistant's custom card helpers
- Fully typed interfaces

**Key Components:**
```typescript
CaltrainCardConfig         // Card configuration interface
CaltrainTrackerCard        // Main card class
- setConfig()              // Configuration method
- getCardSize()            // Card height calculation
- render()                 // Card rendering
- styles                   // CSS styling
```

### Making Changes

1. Edit `src/caltrain-tracker-card.ts`
2. Run `npm run watch` (auto-rebuilds on save)
3. Refresh browser (Ctrl+F5 to clear cache)
4. Test in Home Assistant dashboard

### Debugging

**Browser Console:**
```javascript
// Check if card is loaded
customCards

// Inspect card element
document.querySelector('caltrain-tracker-card')
```

**Common Issues:**
- **Card not found**: Clear browser cache, check resource URL
- **Entity not found**: Verify entity ID in Developer Tools
- **No data**: Check integration is loaded and API key valid
- **Styling issues**: Check theme variables, inspect element

## 📝 Releasing Updates

### Version Bumping

Update version in THREE places:
1. `package.json` - `"version": "1.0.0"`
2. `src/caltrain-tracker-card.ts` - Console log version
3. `dist/caltrain-tracker-card.js` - (auto-generated by build)

### Release Checklist

1. **Build**:
   ```bash
   npm run build
   ```

2. **Test**: Verify in Home Assistant

3. **Commit**:
   ```bash
   git add -A
   git commit -m "Add custom Lovelace card (v1.2.0)"
   ```

4. **Tag**:
   ```bash
   git tag v1.2.0
   git push origin main
   git push origin v1.2.0
   ```

5. **GitHub Release**: Create release at tag v1.2.0

6. **HACS**: Users can update both Integration and Dashboard

## 🎯 Future Enhancements

Possible features to add:

1. **Station Selector**
   - Dropdown to switch between stations
   - Multi-station view

2. **Visual Improvements**
   - Mini map showing train positions
   - Route badges with colors
   - Progress bars for ETAs

3. **Interactive Features**
   - Click train to see details
   - Favorite trains
   - Countdown timers

4. **Customization**
   - Custom icons
   - Compact mode
   - Theme presets

5. **Advanced Data**
   - Historical delays
   - Platform numbers
   - Crowding estimates

## 🐛 Troubleshooting

### Build Errors

**TypeScript errors:**
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Rollup errors:**
- Check `rollup.config.js` syntax
- Verify plugin versions in `package.json`

### Home Assistant Issues

**Card doesn't appear:**
1. Check browser console for errors
2. Verify resource is loaded (Developer Tools → Info)
3. Clear browser cache (Ctrl+Shift+R)
4. Check file exists in `www/` or `www/community/`

**Entity errors:**
1. Verify entity exists in Developer Tools → States
2. Check entity ID matches configuration
3. Ensure integration is loaded

**Styling broken:**
1. Inspect element in browser dev tools
2. Check CSS variable values
3. Try different theme

## 📚 Resources

- [Home Assistant Card Development](https://developers.home-assistant.io/docs/frontend/custom-ui/lovelace-custom-card/)
- [LitElement Documentation](https://lit.dev/)
- [Custom Card Helpers](https://github.com/custom-cards/custom-card-helpers)
- [HACS Documentation](https://hacs.xyz/docs/publish/plugin/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License - Same as the integration

## 🙏 Credits

Built with:
- LitElement (web components)
- TypeScript (type safety)
- Rollup (bundling)
- Custom Card Helpers (HA integration)

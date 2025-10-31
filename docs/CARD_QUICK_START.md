# Quick Start: Building & Testing the Card

## Prerequisites

```bash
# Install Node.js (one-time)
brew install node
```

## Build the Card

```bash
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker

# Install dependencies (one-time)
npm install

# Build the card
npm run build
```

Output: `dist/caltrain-tracker-card.js` ✅

## Install in Home Assistant

### Option 1: Manual (Fastest for Testing)

```bash
# Copy to Home Assistant www folder
cp dist/caltrain-tracker-card.js /path/to/homeassistant/config/www/
```

Then in Home Assistant:
1. **Settings** → **Dashboards** → **⋮** → **Resources**
2. **Add Resource**
3. URL: `/local/caltrain-tracker-card.js`
4. Type: **JavaScript Module**

### Option 2: HACS (For Distribution)

Users add your repo as "Dashboard" type.

## Use the Card

### Add to Dashboard

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
name: "My Station"
max_trains: 3
show_alerts: true
```

## Development Workflow

```bash
# Watch mode - auto-rebuild on changes
npm run watch

# Make changes to src/caltrain-tracker-card.ts
# Save file → auto-builds
# Refresh browser (Ctrl+Shift+R)
```

## Common Commands

```bash
# Build once
npm run build

# Watch for changes
npm run watch

# Clean and rebuild
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

## Troubleshooting

**Card doesn't appear:**
- Clear browser cache (Ctrl+Shift+R)
- Check browser console (F12)
- Verify resource added

**Build fails:**
- Check Node.js installed: `node --version`
- Reinstall: `rm -rf node_modules && npm install`

**Entity errors:**
- Verify entity exists in Developer Tools → States
- Check integration is loaded

## Publishing Checklist

```bash
# 1. Build
npm run build

# 2. Test in Home Assistant
# (verify card works)

# 3. Commit
git add -A
git commit -m "Add custom Lovelace card (v1.2.0)"

# 4. Tag & Push
git tag v1.2.0
git push origin main
git push origin v1.2.0

# 5. Create GitHub Release
# Include release notes from RELEASE_NOTES.md
```

## File Structure

```
HA_Caltrain_tracker/
├── src/
│   └── caltrain-tracker-card.ts    # Source code (edit this)
├── dist/
│   └── caltrain-tracker-card.js    # Built file (generated)
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
├── rollup.config.js                 # Build config
└── CARD_README.md                   # User docs
```

## Quick Test

After building:

1. Add card to dashboard
2. Check:
   - ✅ Shows station name
   - ✅ Shows next trains
   - ✅ ETAs color-coded
   - ✅ Updates every 30s
   - ✅ Alerts show (if any)

## Need Help?

- See [CARD_DEVELOPMENT.md](CARD_DEVELOPMENT.md) for detailed guide
- See [CARD_SUMMARY.md](CARD_SUMMARY.md) for architecture overview
- Check [CARD_README.md](../CARD_README.md) for user documentation

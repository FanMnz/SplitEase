# Mux Video Streaming Setup Guide

## Overview

SplitEase now uses **Mux** for professional video streaming with adaptive bitrate delivery, CDN optimization, and beautiful poster images. This guide explains the setup and how to configure your own videos.

---

## What Was Implemented

### 1. **Video Streaming Infrastructure**
- Integrated **@mux/mux-player-react** for adaptive bitrate video playback
- Videos stream with automatic quality adjustment based on network speed
- Poster images load instantly while videos buffer
- Full browser autoplay policy compliance (muted, playsInline)

### 2. **Three Reusable Media Components**

#### **BackgroundVideo** (`src/components/media/BackgroundVideo.tsx`)
- Full-screen looping video backdrop
- Gradient overlay for text readability
- Used on home page as visual anchor
- Properties: `playbackId`, `poster`

#### **AnnouncementHero** (`src/components/media/AnnouncementHero.tsx`)
- Premium hero section with animated title, subtitle, and CTA button
- Video plays automatically in background
- Uses framer-motion for smooth fade-in animations
- Perfect for promotions and announcements
- Properties: `playbackId`, `title`, `subtitle`, `ctaLabel`, `onCtaClick`, `poster`

#### **MenuItemPreview** (`src/components/media/MenuItemPreview.tsx`)
- Individual menu item card with video preview
- Video plays on hover showing dish in action
- Fallback emoji display for items without videos
- Properties: `muxPlaybackId`, `posterUrl`, `previewClipUrl`

### 3. **Admin Configuration UI**

#### **Admin Dashboard** (`/admin`)
- Central hub for restaurant operations
- Quick links to configuration pages
- Professional, expandable interface

#### **Media Configuration Page** (`/admin/media-config`)
- **No coding required** - fully visual interface
- Three collapsible sections:
  - **Announcement Hero Video**: Hero section video + poster
  - **Background Video**: Page background video + poster
  - **Menu Item Videos**: Individual videos for 4 sample items
- **Features**:
  - Live poster image preview
  - Copy-to-clipboard buttons for playback IDs
  - localStorage persistence (changes saved automatically)
  - Save/Reset buttons
  - Step-by-step instructions
  - Success confirmation messages

### 4. **Configuration Hook** (`src/hooks/useMediaConfig.ts`)
- `useMediaConfig()` hook reads config from localStorage
- Falls back to defaults if no saved config
- Prevents hydration mismatches in Next.js
- Used by Home page and MenuDisplay components

### 5. **Data Model Extensions**
- MenuItem type extended with optional media fields:
  - `muxPlaybackId?: string`
  - `posterUrl?: string`
  - `previewClipUrl?: string`
- Mock menu items pre-populated with demo playback IDs

---

## Current Placeholder IDs

The app ships with demo Mux playback IDs that point to placeholder videos. Here's the structure in localStorage:

```json
{
  "announcement": {
    "playbackId": "mux_demo_announcement_12345",
    "poster": "https://via.placeholder.com/1600x900?text=Announcement+Hero"
  },
  "background": {
    "playbackId": "mux_demo_background_67890",
    "poster": "https://via.placeholder.com/1600x900?text=Background+Video"
  },
  "items": {
    "grilledSalmon": {
      "playbackId": "mux_demo_salmon_001",
      "poster": "https://via.placeholder.com/800x600?text=Grilled+Salmon"
    },
    "ribeyeSteak": {
      "playbackId": "mux_demo_steak_002",
      "poster": "https://via.placeholder.com/800x600?text=Ribeye+Steak"
    },
    "mushroomRisotto": {
      "playbackId": "mux_demo_risotto_003",
      "poster": "https://via.placeholder.com/800x600?text=Mushroom+Risotto"
    },
    "tiramisu": {
      "playbackId": "mux_demo_tiramisu_004",
      "poster": "https://via.placeholder.com/800x600?text=Tiramisu"
    }
  }
}
```

---

## How to Get Real Mux Playback IDs

### Step 1: Sign Up at Mux
1. Go to https://mux.com
2. Create a free account
3. Verify your email

### Step 2: Upload Videos
1. Log in to Mux dashboard
2. Go to **Assets** → **Create New Asset**
3. Upload your video files:
   - **Restaurant Announcement**: 15-30 seconds (hero video)
   - **Background Ambience**: 30-60 seconds (looping background)
   - **Dish Previews**: 10-20 seconds each (4 menu items)
4. Wait for processing (usually 1-2 minutes)

### Step 3: Get Playback IDs
1. In Mux dashboard, click on your video asset
2. In the **Asset Details** section, find the **Playback ID**
3. It looks like: `Ds00sSvF021OikYIPZHp02OilLEnFQ2IFe`
4. Copy each one

### Step 4: (Optional) Get Poster Images
1. Mux automatically generates poster images
2. Format: `https://image.mux.com/{PLAYBACK_ID}/poster.jpg`
3. Or upload custom poster images to any image hosting service

---

## How to Update Videos (Non-Developers)

### Using the Admin Panel

1. **Access the config page**:
   - Navigate to `http://localhost:3000/admin/media-config` (development)
   - Or go to `/admin` then click **Media Configuration**

2. **Update Announcement Video**:
   - Click to expand "Announcement Hero Video" section
   - Paste your Mux playback ID in the "Mux Playback ID" field
   - Paste poster image URL in the "Poster Image URL" field
   - See preview update instantly

3. **Update Background Video**:
   - Click to expand "Background Video" section
   - Paste Mux playback ID and poster URL
   - Changes apply immediately

4. **Update Menu Item Videos**:
   - Click to expand "Menu Item Videos" section
   - For each dish (Grilled Salmon, Ribeye Steak, etc.):
     - Paste playback ID
     - Paste poster URL

5. **Save Your Changes**:
   - Click the blue "Save Configuration" button at the bottom
   - See the green success message
   - Refresh the page - your videos are now live!

6. **Reset to Defaults**:
   - If you want to go back to demo videos, click "Reset to Defaults"
   - Confirms before resetting

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                 # Home page (uses BackgroundVideo, AnnouncementHero)
│   └── admin/
│       ├── page.tsx             # Admin dashboard
│       └── media-config/
│           └── page.tsx         # Configuration UI (no-code)
├── components/
│   ├── media/
│   │   ├── BackgroundVideo.tsx  # Full-screen background video component
│   │   ├── AnnouncementHero.tsx # Hero section with animations
│   │   └── MenuItemPreview.tsx  # Menu item card with video
│   └── menu/
│       └── MenuDisplay.tsx      # Uses MediaConfig for menu videos
├── config/
│   └── media.ts                 # (Deprecated) Original config file
├── contexts/
│   └── OrderContext.tsx         # MenuItem type with media fields
└── hooks/
    └── useMediaConfig.ts        # Hook to read/persist config
```

---

## Technical Details

### Dependencies Added
```json
{
  "@mux/mux-player-react": "^2.x",
  "framer-motion": "^6.x",
  "lucide-react": "latest"
}
```

### How It Works

1. **Default Configuration**: 
   - First load uses `DEFAULT_CONFIG` with demo IDs
   - Located in `src/hooks/useMediaConfig.ts`

2. **localStorage Persistence**:
   - Key: `splitease_media_config`
   - Saves entire config object as JSON
   - Survives browser refresh, new tabs, etc.

3. **Component Integration**:
   - Home page uses `useMediaConfig()` hook
   - MenuDisplay reads from hook
   - Video playback IDs pulled from config at render time

4. **Automatic Updates**:
   - No cache busting needed
   - Changes visible immediately after save
   - No page reload required (but can refresh to be sure)

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Common Use Cases

### Scenario 1: Update Restaurant Announcement
1. Record 20-second video of your head chef
2. Upload to Mux
3. Copy playback ID
4. Go to `/admin/media-config`
5. Paste in "Announcement Hero Video" section
6. Save → Done!

### Scenario 2: Add Dish Preview Videos
1. Record short clips of your signature dishes being plated
2. Upload each to Mux
3. Get 4 playback IDs (one per dish)
4. Go to `/admin/media-config`
5. Expand "Menu Item Videos"
6. Paste each ID in corresponding dish field
7. Save → Customers see dish videos on menu!

### Scenario 3: Create Ambience Background
1. Record 1-minute looping video (restaurant interior, kitchen activity)
2. Upload to Mux
3. Get playback ID
4. Paste in "Background Video" section
5. Save → Home page now has stunning background!

---

## Troubleshooting

### Videos Not Playing
1. Check playback ID is correct (should be 25+ characters)
2. Verify video has processed in Mux dashboard (takes 1-2 min)
3. Clear browser cache: Ctrl+Shift+Delete
4. Hard refresh page: Ctrl+F5

### Poster Image Not Showing
1. Check image URL is valid (copy exact URL from browser)
2. Try simpler URL (avoid special characters)
3. Use Mux's auto-generated poster: `https://image.mux.com/{PLAYBACK_ID}/poster.jpg`

### Config Won't Save
1. Check browser allows localStorage (not in private/incognito mode)
2. Check browser localStorage is not full
3. Open DevTools → Application → Storage → localStorage
4. Should see `splitease_media_config` key

### Hydration Mismatch Error
1. This is handled by the `useMediaConfig()` hook
2. Uses mounting check to prevent SSR/client mismatch
3. Should auto-resolve on page refresh

---

## Advanced: Direct Code Updates

If you prefer editing code instead of the UI:

### Update `src/hooks/useMediaConfig.ts`
Change the `DEFAULT_CONFIG` object:

```typescript
const DEFAULT_CONFIG: MediaConfig = {
  announcement: {
    playbackId: "YOUR_MUX_ID_HERE",
    poster: "https://your-image-url.com/poster.jpg"
  },
  // ... rest of config
}
```

Then restart the dev server: `npm run dev`

---

## Performance Notes

- Mux handles CDN delivery globally
- Videos adapt quality to network (1080p → 720p → 480p auto)
- Poster images cached by browser
- No performance penalty vs placeholder videos
- Mobile-optimized bitrates

---

## Security Notes

- Playback IDs are **public** (safe to share, no authentication needed)
- Mux handles HTTPS automatically
- No sensitive data in localStorage
- Videos streamed through Mux's secure CDN

---

## Support & Documentation

- **Mux Documentation**: https://docs.mux.com
- **Mux Player React**: https://github.com/mux/mux-player-react
- **Admin Panel**: Navigate to `/admin` for quick access
- **Reset Anytime**: Click "Reset to Defaults" if anything breaks

---

## Summary

✅ Admin UI for non-developers at `/admin/media-config`
✅ Three reusable video components (Background, Announcement, MenuItem)
✅ localStorage persistence (changes saved automatically)
✅ Live preview of poster images
✅ Copy-to-clipboard for playback IDs
✅ Default demo videos included
✅ Professional streaming with Mux
✅ No coding required to update videos

**You're all set to make your restaurant shine with professional video!** 🎬

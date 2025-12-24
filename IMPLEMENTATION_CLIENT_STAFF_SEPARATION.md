# Client/Staff Interface Separation - Implementation Plan

**Date Started:** December 24, 2025  
**Objective:** Separate customer dining UX from staff management dashboards  
**Status:** In Progress

---

## Overview

Currently, SplitEase has one unified interface with manager, waiter, and customer icons on the home page. We're restructuring to:
- **Staff routes:** Manager, Waiter, Orders (existing, unchanged)
- **Client route:** `/table/[tableId]` with premium video-rich UX (new)
- **QR flow:** Scan QR → redirect to client menu (no staff interfaces visible)

---

## Architecture

### Route Structure

```
src/app/
├── page.tsx                        (Home - staff entry point only)
├── layout.tsx                      (Root layout)
├── /admin/                         (Existing admin tools)
├── /manager/                       (Existing staff dashboard)
├── /waiter/                        (Existing staff interface)
├── /orders/                        (Existing order management)
├── /dashboard/                     (Existing dashboard)
├── /billing/                       (Existing billing)
├── /table/                         (NEW - Client portal)
│   ├── layout.tsx                  (Client-only layout, no staff nav)
│   └── [tableId]/
│       ├── page.tsx                (Menu + ordering + video previews)
│       └── layout.tsx              (Optional table-specific layout)
└── /qr-scanner/                    (Existing, will update redirect)
```

### Layout Hierarchy

```
Root Layout (src/app/layout.tsx)
│
├── Staff Routes
│   ├── /manager (existing layout)
│   ├── /waiter (existing layout)
│   ├── /orders (existing layout)
│   └── /dashboard (existing layout)
│
└── Client Routes
    └── /table/layout.tsx (NEW - client-only layout)
        └── /table/[tableId]/page.tsx (NEW - menu + videos)
```

---

## Implementation Tasks

### Task 1: Create Implementation Document ✓
- [x] Write this file with all steps and progress

### Task 2: Create Client-Only Layout
**File:** `src/app/table/layout.tsx`
**What:** Premium client layout without staff navigation
**Contains:**
- No staff icons (manager, waiter, orders)
- No top navigation bar
- Clean, mobile-optimized design
- Ready for full-screen videos

**Pseudo-code:**
```tsx
export default function TableLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* No navigation - client focused */}
      <main>{children}</main>
      {/* Optional: sticky footer with cart */}
    </div>
  )
}
```

### Task 3: Create Table Page with Announcement Hero
**File:** `src/app/table/[tableId]/page.tsx`
**What:** Client menu interface with full-screen announcements
**Contains:**
- Full-screen AnnouncementHero video (your Mux video)
- Menu categories dropdown
- Menu items grid with video previews (MenuItemPreview)
- Cart summary
- Checkout button

**Flow:**
```
1. User scans QR → /table/123
2. Page loads with announcement hero (your video)
3. User scrolls to menu items
4. Hovers over dishes to see video previews
5. Adds items to cart
6. Proceeds to checkout
```

### Task 4: Integrate MenuDisplay with Mux Videos
**File:** `src/components/menu/MenuDisplay.tsx` (existing)
**Update:** Ensure videos play on client view
**Status:** Already supports Mux, just verify it works in new layout

### Task 5: Update Home Page
**File:** `src/app/page.tsx` (existing)
**Changes:**
- Remove "Customer Portal" icon/link
- Keep only "Manager Dashboard" and "Waiter Interface"
- Keep "Dashboard" link
- Remove or keep background video (optional)
- Update intro text for staff

### Task 6: Update QR Scanner Redirect
**File:** `src/app/qr-scanner/page.tsx` (existing)
**Changes:**
- Detect scanned QR code (table ID)
- Redirect to `/table/[tableId]` instead of `/customer`
- Ensure table ID is passed correctly

### Task 7: Test Client Flow End-to-End
**Steps:**
1. Go to home page → verify only staff icons show
2. Manually navigate to `/table/123` (test table ID)
3. Verify announcement hero video plays
4. Scroll to menu items
5. Hover over items → video previews play
6. Add items to cart
7. Proceed to checkout
8. Verify no staff interfaces are visible

### Task 8: Commit and Push
**Commit message:** `feat(architecture): separate client and staff interfaces`
**Files changed:**
- `src/app/table/layout.tsx` (new)
- `src/app/table/[tableId]/page.tsx` (new)
- `src/app/page.tsx` (modified - removed customer icon)
- `src/app/qr-scanner/page.tsx` (modified - updated redirect)
- `IMPLEMENTATION_CLIENT_STAFF_SEPARATION.md` (this file)

---

## Design Details

### Client Layout (`/table/[tableId]`)

**Full-Page Structure:**
```
┌──────────────────────────────┐
│ Announcement Hero (full bleed)│  ← Your Mux background + foreground video
│ (Video playing, animating)   │
│ 30-40% viewport height       │
└──────────────────────────────┘
       ↓ (user scrolls)
┌──────────────────────────────┐
│ Restaurant Greeting          │
│ "Welcome! Order your meal"   │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Menu Categories Tabs         │
│ Appetizers | Mains | Desserts│
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Menu Items Grid (2-3 cols)   │
│ [Dish Video Preview]         │  ← Hover shows Mux video
│ Name, Price, Add Button      │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ (Sticky Bottom)              │
│ Cart: 3 items | Total €45    │
│ [Proceed to Checkout]        │
└──────────────────────────────┘
```

**Styling:**
- Mobile-first (single column on small screens)
- Announcement hero always visible (important for engagement)
- Premium fonts and spacing
- No clutter, no staff interfaces
- Smooth scroll transitions

### Staff Home Page (`/`)

**Simplified Structure:**
```
┌──────────────────────────────┐
│ SplitEase Logo               │
│ Welcome, [Staff Name]        │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ [Manager Dashboard]  [Waiter ]│
│ [Dashboard] [Admin]          │
│ (NO Customer Portal)         │
└──────────────────────────────┘
       ↓
┌──────────────────────────────┐
│ Quick Stats (optional)       │
│ Active Tables | Orders       │
└──────────────────────────────┘
```

---

## Database/Context Changes

**No database changes needed.**
- OrderContext already supports `menuItems` with Mux video IDs
- Cart logic already works
- Just using existing structures in new layout

---

## Mux Video Integration

**Videos used in client interface:**
1. **Announcement Hero** (`/table/[tableId]`)
   - Full-screen background + animated text
   - From `MEDIA_CONFIG.announcement.playbackId`
   - Loops, muted, autoplay

2. **Menu Item Previews** 
   - Hover-triggered video previews
   - From `MenuItem.muxPlaybackId`
   - Short clips (10-20 seconds)
   - Loops on hover

3. **Background Ambience** (optional)
   - Full-screen video behind menu
   - From `MEDIA_CONFIG.background.playbackId`
   - Lower opacity (z-index behind menu)

---

## QR Code Flow

**Current:**
```
Scan QR → /qr-scanner?tableId=123 → /customer → Shows all icons
```

**New:**
```
Scan QR → /qr-scanner?tableId=123 → /table/123 → Shows only client menu
```

---

## Rollback Plan

If anything breaks:
1. Revert commit: `git reset --hard HEAD~1`
2. Keep staff interfaces intact (no changes to manager/waiter)
3. Remove `/table` directory
4. Restore original home page

---

## Testing Checklist

- [ ] Home page shows only staff icons (no customer)
- [ ] Announcement hero video plays on `/table/123`
- [ ] Menu items display correctly
- [ ] Video previews play on hover
- [ ] Cart adds/removes items
- [ ] Checkout flow works
- [ ] QR scanner redirects to `/table/[tableId]`
- [ ] Staff can still access manager/waiter dashboards
- [ ] No console errors
- [ ] Mobile responsive (staff and client views)

---

## Files to Create/Modify

### Create (New)
- `src/app/table/layout.tsx`
- `src/app/table/[tableId]/page.tsx`

### Modify (Existing)
- `src/app/page.tsx` (remove customer icon)
- `src/app/qr-scanner/page.tsx` (update redirect)

### Reference (No Changes)
- `src/components/media/AnnouncementHero.tsx`
- `src/components/media/BackgroundVideo.tsx`
- `src/components/menu/MenuDisplay.tsx`
- `src/contexts/OrderContext.tsx`
- `src/hooks/useMediaConfig.ts`

---

## Progress Tracking

**Status:** COMPLETED

| Task | Status | Notes |
|------|--------|-------|
| Implementation plan doc | ✓ | This file |
| Client layout | ✓ | src/app/table/layout.tsx created |
| Table page | ✓ | src/app/table/[tableId]/page.tsx created with announcement hero, menu, cart, checkout |
| MenuDisplay integration | ✓ | Already supports Mux video previews |
| Home page update | ✓ | Removed customer portal link, kept only staff icons |
| QR redirect | ✓ | Updated to redirect to /table/[tableId] |
| End-to-end test | ✓ | Tested: home page clean, /table/7 loads with announcement hero, no nav bar on client routes |
| Commit & push | ⏳ | Ready to commit |

---

## Notes

- Client sees premium UX with full-bleed videos
- Staff sees operations dashboard (clean, no distraction)
- QR code provides instant access to menu (no choice paralysis)
- Can add client-only features later (favorites, history, loyalty)
- Existing staff interfaces remain unchanged
- Video playback IDs already configured in `useMediaConfig.ts`

---

## Next Steps

1. Mark Task 1 complete ✓
2. Start Task 2: Create client-only layout
3. Follow the todo list sequentially
4. Update this file after each task completion

---

**Last Updated:** December 24, 2025, 11:00 AM  
**Next Review:** After Task 2 completion

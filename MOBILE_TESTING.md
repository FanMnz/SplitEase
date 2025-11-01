# 📱 Mobile Testing Guide for SplitEase

## Quick Setup for Android Testing

### 1. **Local Network Testing** (Easiest)

**Step 1:** Make sure your phone and computer are on the same WiFi network

**Step 2:** Open any browser on your Android phone and go to:
```
http://192.168.0.122:3000
```
*or if that doesn't work:*
```
http://10.144.74.81:3000
```

**Step 3:** If you get "can't connect" errors, run this command in PowerShell as Administrator:
```powershell
netsh advfirewall firewall add rule name="NextJS Dev Server" dir=in action=allow protocol=TCP localport=3000
```

### 2. **Using ngrok** (For external testing)

**Step 1:** Install ngrok
```bash
# Download from https://ngrok.com/download
# Or use chocolatey: choco install ngrok
```

**Step 2:** Expose your local server
```bash
ngrok http 3000
```

**Step 3:** Use the provided https URL on your phone (works from anywhere!)

### 3. **PWA Installation Test**

Once you have the app running on your phone:

1. **Chrome:** Tap the menu → "Add to Home screen"
2. **Edge:** Tap the menu → "Install app" 
3. **Samsung Internet:** Tap the menu → "Add page to" → "Home screen"

## 🧪 Mobile Testing Checklist

### Touch & Gestures
- [ ] All buttons are easily tappable (44px minimum)
- [ ] Navigation works smoothly
- [ ] Swipe gestures feel natural
- [ ] No accidental taps on small elements

### Layout & Responsive Design
- [ ] No horizontal scrolling
- [ ] Text is readable without zooming
- [ ] Tables fit properly on screen
- [ ] Dashboard cards stack nicely
- [ ] Bottom navigation is accessible

### Performance
- [ ] Pages load quickly on mobile network
- [ ] Animations are smooth (60fps)
- [ ] No lag when scrolling
- [ ] Images load properly

### Restaurant Workflow Testing
- [ ] **Dashboard:** Quick stats are visible
- [ ] **Tables:** Easy to see table status
- [ ] **Orders:** Can manage orders with touch
- [ ] **Payments:** Bill splitting works on mobile
- [ ] **Navigation:** Easy to switch between sections

### PWA Features
- [ ] "Add to Home Screen" prompt appears
- [ ] App works offline (basic functionality)
- [ ] App icon appears on home screen
- [ ] Splash screen shows on launch

## 🔧 Troubleshooting

### "Site can't be reached"
1. Check both devices are on same WiFi
2. Try the alternative IP address
3. Disable Windows Firewall temporarily
4. Restart the dev server with `npm run dev:mobile`

### App looks weird on mobile
1. Clear browser cache
2. Hard refresh (pull down on page)
3. Try in incognito/private mode
4. Check if you're using an ad blocker

### Touch targets too small
The app is designed with 44px minimum touch targets, but if something feels too small:
1. Check your phone's display scaling settings
2. Try pinch-to-zoom if needed
3. Report the specific element for fixing

## 📊 Testing Different Screen Sizes

### Test on different devices if available:
- **Small phones** (iPhone SE, Android compact)
- **Standard phones** (iPhone 14, Galaxy S23)
- **Large phones** (iPhone 14 Pro Max, Galaxy Note)
- **Tablets** (iPad, Android tablets)

### Browser testing:
- Chrome (most important)
- Samsung Internet
- Firefox Mobile
- Edge Mobile

## 🚀 Advanced Testing

### Network Conditions
Test with different connection speeds:
1. Chrome DevTools → Network tab → Throttling
2. Or use your phone's developer options

### Device Orientation
- Portrait mode (primary use)
- Landscape mode (should work for tablets)

### Accessibility
- Enable TalkBack/Voice Assistant
- Test with high contrast mode
- Try with larger font sizes

## 📝 Feedback Collection

When testing, note:
- Which actions feel slow or clunky
- Any buttons that are hard to tap
- Text that's too small to read
- Features that don't work as expected
- Overall feeling: does it feel like a professional app?

## 🎯 Expected Mobile Experience

The SplitEase mobile experience should feel:
- **Fast** - Pages load in under 2 seconds
- **Smooth** - No lag during navigation
- **Native** - Like a real mobile app, not a website
- **Professional** - High-quality interface suitable for restaurant staff
- **Reliable** - Works consistently across different Android devices

---

**Ready to test?** Just open `http://192.168.0.122:3000` on your Android phone! 📱
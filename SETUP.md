# The Code Fairy App — Setup Guide

## Quick Start (5 minutes)

### 1. Install Node.js
Download from [nodejs.org](https://nodejs.org) (LTS version).

### 2. Navigate to the project
```bash
cd ~/Desktop/CLAUDE/the-code-fairy-app
```

### 3. Install dependencies (already done, but just in case)
```bash
npm install
```

### 4. Run the app
```bash
npx expo start
```

This opens Expo DevTools. From there:
- **iPhone:** Download "Expo Go" from the App Store, scan the QR code
- **Android:** Download "Expo Go" from Google Play, scan the QR code
- **Web preview:** Press `w` in the terminal

---

## Supabase Setup (15 minutes)

### 1. Create a Supabase project
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project", name it "the-code-fairy"
3. Set a database password and wait ~2 minutes

### 2. Run the database schema
1. In Supabase dashboard → **SQL Editor** → "New Query"
2. Paste the entire contents of `supabase-schema.sql`
3. Click "Run" — you should see "Success"

### 3. Connect the app
1. In Supabase → **Settings > API**
2. Copy "Project URL" and "anon/public" key
3. Open `src/config/supabase.js`
4. Replace the placeholder values

### 4. Enable email auth
1. In Supabase → **Authentication > Providers**
2. Ensure "Email" is enabled
3. (Optional) Disable "Confirm email" for testing

---

## Project Structure

```
the-code-fairy-app/
├── App.js                           # Entry point
├── supabase-schema.sql              # Database schema
├── SETUP.md                         # This file
├── src/
│   ├── config/
│   │   ├── theme.js                 # Colors, fonts, planets, zodiac
│   │   └── supabase.js              # Supabase client
│   ├── context/
│   │   └── AuthContext.js           # Auth state management
│   ├── navigation/
│   │   ├── RootNavigator.js         # Auth vs Main routing
│   │   ├── AuthNavigator.js         # Pre-login flow
│   │   └── MainNavigator.js         # Bottom tabs
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── WelcomeScreen.js     # Landing page
│   │   │   ├── SignUpScreen.js      # Create account
│   │   │   ├── SignInScreen.js      # Log in
│   │   │   ├── OnboardingScreen.js  # Birth data (3 steps)
│   │   │   └── CompilingScreen.js   # Animated loading
│   │   └── main/
│   │       ├── DailyReadingScreen.js   # Cosmic weather
│   │       ├── ChartScreen.js          # Birth chart explorer
│   │       ├── CoursesScreen.js        # Learning content
│   │       └── ProfileScreen.js        # Settings & account
│   ├── components/
│   │   └── common/
│   │       ├── Button.js            # Styled buttons
│   │       ├── Card.js              # Glass-morphism cards
│   │       ├── Input.js             # Form inputs
│   │       ├── ScreenWrapper.js     # Base layout
│   │       └── StarField.js         # Twinkling stars
│   └── services/
│       └── astrology.js             # Chart calculation API
```

---

## Tech Stack

| What | Tool | Cost |
|------|------|-----|
| App framework | React Native (Expo) | Free |
| Backend + Auth + DB | Supabase | Free tier |
| Astrology engine | Kerykeion (Python) | ~$5/mo on Railway |
| Payments | RevenueCat | Free until revenue |
| Push notifications | OneSignal | Free to 10k users |
| Error monitoring | Sentry | Free tier |
| Analytics | Firebase Analytics | Free |

---

## What's Next

1. Set up Supabase (above)
2. Deploy the Python astrology API (Kerykeion on Railway)
3. Connect real chart calculations
4. Add RevenueCat for subscriptions
5. Load content into Supabase
6. Polish, test on real devices
7. Submit to App Store ($99/yr) and Google Play ($25)

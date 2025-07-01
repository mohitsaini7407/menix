# BGMI Tournament Host App (Fantasy-Style)

## 🛠️ Tech Stack
- React (Vite, Functional Components)
- React Router
- useState, useEffect
- Context API (for state management)
- JSON Server (for mock backend)
- Tailwind CSS (for UI)

## 🎯 Objective
Fantasy-style web application to host and manage BGMI tournaments. Users can view matches, register squads, and participate in scheduled tournaments. Admins can create and manage matches.

## 📄 Pages
- Home (`/`): Banner, quick links, leaderboard snapshot, live ticker
- Tournaments (`/tournaments`): List, filter, and view tournaments
- Create Tournament (`/admin/create`): Admin panel to host a new tournament
- Register Team (`/tournament/:id/register`): Team registration form
- Tournament Details (`/tournament/:id`): Info, countdown, register/watch
- Live Match (`/tournament/:id/live`): Room info, livestream, leaderboard
- Leaderboard (`/leaderboard`): Global and tournament-specific leaderboards
- Profile (`/profile`): User profile, past tournaments, teams, earnings
- Login/Signup (`/login`, `/signup`): Auth system

## 🕓 Time Series Match Logic
- Each tournament has a startTime
- Countdown before start, status changes to "Ongoing" after start
- Auto-switch to Live Match Page when match starts

## 🔐 Admin Features
- Create/Edit/Delete tournaments
- Lock room after time
- Update match results and leaderboard

## 📦 Bonus Features (optional)
- Email notification, payment gateway, Google Sign-In, chat lobby

## 🧪 Folder Structure
```
src/
├── components/
│   ├── TournamentCard.jsx
│   ├── CountdownTimer.jsx
│   ├── Navbar.jsx
├── pages/
│   ├── Home.jsx
│   ├── Tournaments.jsx
│   ├── CreateTournament.jsx
│   ├── TournamentDetail.jsx
│   ├── RegisterTeam.jsx
│   ├── LiveMatch.jsx
│   ├── Leaderboard.jsx
│   ├── Profile.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── App.jsx
├── main.jsx
```

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Start the development server
```bash
npm run dev
```

### 3. Start the mock backend (JSON Server)
```bash
npx json-server --watch db.json --port 3001
```

### 4. Open in browser
Visit [http://localhost:5173](http://localhost:5173)

---
# menix

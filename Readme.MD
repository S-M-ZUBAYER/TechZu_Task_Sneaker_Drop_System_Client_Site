# 🎨 Sneaker Drop Frontend

Real-time sneaker drop system with atomic reservations, live inventory updates, and 60-second checkout timer.

Built with **React**, **Vite**, **Zustand**, **Socket.IO**, and **Tailwind CSS**.

---

## 🚀 Features

### ✅ Real-Time Updates
- **Live Stock Updates** - See inventory changes instantly
- **WebSocket Connection** - Socket.IO for real-time communication
- **Auto Stock Recovery** - Watch stock return after reservation expiration
- **Purchase Notifications** - See who's buying in real-time

### ✅ User Authentication
- **Register/Login** - JWT-based authentication
- **Persistent Sessions** - Auto-login from localStorage
- **Protected Routes** - Secure user-specific features
- **Profile Management** - View and update user info

### ✅ Reservation System
- **One-Click Reserve** - Instant item reservation
- **60-Second Timer** - Visual countdown with progress bar
- **Atomic Operations** - Race-condition safe reservations
- **Auto-Expiration** - Automatic stock recovery

### ✅ Purchase Flow
- **Purchase Modal** - Complete checkout interface
- **Order Summary** - Clear price breakdown
- **Instant Confirmation** - Real-time purchase completion
- **Activity Feed** - See recent purchasers

### ✅ Modern UI/UX
- **Responsive Design** - Mobile, tablet, desktop optimized
- **Tailwind CSS** - Beautiful, consistent styling
- **Toast Notifications** - User-friendly alerts
- **Loading States** - Smooth loading indicators
- **Animations** - Subtle, professional transitions

---

## 📦 Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.3.1 |
| **Vite** | Build Tool | 5.2.0 |
| **Zustand** | State Management | 4.5.0 |
| **Socket.IO Client** | WebSocket | 4.7.4 |
| **Axios** | HTTP Client | 1.6.5 |
| **Tailwind CSS** | Styling | 3.4.1 |
| **React Hot Toast** | Notifications | 2.4.1 |
| **Lucide React** | Icons | 0.263.1 |

---

## 🛠️ Installation

### Prerequisites
- **Node.js** 16+ and npm
- **Backend Server** running on `http://localhost:5000`

### Steps

```bash
# 1. Navigate to frontend directory
cd sneaker-drop-frontend

# 2. Install dependencies
npm install

# 3. Configure environment (already done)
# Check .env file for API and Socket URLs

# 4. Start development server
npm run dev

# 5. Open browser
# http://localhost:5173
```

---

## 📁 Project Structure

```
sneaker-drop-frontend/
├── public/                     # Static assets
├── src/
│   ├── components/             # React components
│   │   ├── Navbar.jsx          # Navigation bar
│   │   ├── AuthModal.jsx       # Login/Register modal
│   │   ├── DropCard.jsx        # Product card
│   │   ├── ReserveButton.jsx   # Reserve logic
│   │   ├── PurchaseModal.jsx   # Checkout modal
│   │   ├── ActivityFeed.jsx    # Recent buyers
│   │   ├── Timer.jsx           # 60s countdown
│   │   ├── LoadingSpinner.jsx  # Loading state
│   │   └── ProtectedRoute.jsx  # Auth guard
│   ├── pages/
│   │   └── Dashboard.jsx       # Main page
│   ├── services/
│   │   ├── api.js              # Axios API service
│   │   └── socket.js           # Socket.IO client
│   ├── store/
│   │   ├── useAuthStore.js     # Auth state
│   │   ├── useDropsStore.js    # Drops state
│   │   ├── useReservationsStore.js  # Reservations
│   │   └── usePurchasesStore.js     # Purchases
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── App.jsx                 # Main app component
│   ├── main.jsx                # React entry
│   └── index.css               # Global styles
├── index.html                  # HTML entry
├── vite.config.js              # Vite config
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
├── package.json                # Dependencies
└── .env                        # Environment variables
```

---

## 🎯 Usage Guide

### 1. Register/Login

```javascript
// New user registration
Click "Register" → Fill form → Auto-login

// Existing user login
Click "Login" → Enter credentials → Dashboard
```

### 2. Browse Drops

```javascript
// View available drops
Dashboard shows all drops with:
- Real-time stock count
- Price information
- Recent purchasers (last 3)
- Availability status
```

### 3. Reserve Item

```javascript
// Click "Reserve Now" button
→ Stock decreases immediately
→ Purchase modal opens
→ 60-second timer starts
→ Socket broadcasts update to all users
```

### 4. Complete Purchase

```javascript
// In purchase modal
→ Review product details
→ Watch countdown timer
→ Click "Confirm Purchase"
→ Success notification
→ Activity feed updates
```

### 5. Real-Time Updates

```javascript
// Watch for:
- Stock decreases when others reserve
- Stock recovers after 60s expiration
- New purchases in activity feed
- Live connection status indicator
```

---

## ⚙️ Configuration

### Environment Variables (`.env`)

```env
# API Base URL
VITE_API_URL=http://localhost:5000

# Socket.IO URL
VITE_SOCKET_URL=http://localhost:5000
```

### Vite Proxy (for CORS)

Already configured in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
  '/socket.io': {
    target: 'http://localhost:5000',
    ws: true,
  }
}
```

---

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add custom colors here
    }
  }
}
```

### Button Styles

Edit `src/index.css`:

```css
.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}
```

### Timer Duration

Backend controls reservation duration:

```env
# In backend .env
RESERVATION_DURATION=60000  # 60 seconds
```

---

## 🔌 API Integration

### API Service (`src/services/api.js`)

```javascript
// Automatic JWT token injection
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth and redirect
    }
  }
);
```

### Socket.IO Service (`src/services/socket.js`)

```javascript
// Connect once, use everywhere
socketService.connect();

// Listen to events
socketService.onStockUpdate((data) => {
  // Handle stock updates
});

socketService.onPurchaseCompleted((data) => {
  // Handle purchases
});
```

---

## 📊 State Management (Zustand)

### Auth Store

```javascript
const { user, login, logout, isAuthenticated } = useAuthStore();

// Login
await login({ email, password });

// Check auth
if (isAuthenticated) {
  // User is logged in
}
```

### Drops Store

```javascript
const { drops, fetchDrops, updateDropStock } = useDropsStore();

// Fetch drops
await fetchDrops();

// Update stock (real-time)
updateDropStock(dropId, newStock);
```

### Reservations Store

```javascript
const { reserveItem, activeReservation } = useReservationsStore();

// Reserve
await reserveItem(dropId);

// Check active reservation
if (activeReservation) {
  // Show purchase modal
}
```

---

## 🧪 Testing

### Manual Testing

```bash
# 1. Start backend
cd sneaker-drop-backend
npm run dev

# 2. Start frontend
cd sneaker-drop-frontend
npm run dev

# 3. Open multiple browser tabs
# Test real-time updates across tabs
```

### Test Scenarios

1. **Registration Flow**
   - Register new user
   - Verify auto-login
   - Check profile display

2. **Reservation Flow**
   - Click "Reserve Now"
   - Watch stock decrease
   - See 60s timer
   - Complete purchase

3. **Real-Time Updates**
   - Open 2 tabs
   - Reserve in tab 1
   - Watch stock update in tab 2
   - Wait 60s for recovery

4. **Expiration Flow**
   - Reserve item
   - Don't purchase
   - Wait 60 seconds
   - Watch stock recover
   - See toast notification

---

## 🐛 Troubleshooting

### Issue: Can't connect to backend

**Solution:**
```bash
# Make sure backend is running
cd sneaker-drop-backend
npm run dev

# Check if running on port 5000
curl http://localhost:5000/health
```

### Issue: Socket.IO not connecting

**Solution:**
```javascript
// Check vite.config.js proxy settings
proxy: {
  '/socket.io': {
    target: 'http://localhost:5000',
    ws: true,  // Important!
  }
}
```

### Issue: CORS errors

**Solution:**
Backend CORS is already configured. If issues persist:
```javascript
// In backend index.js
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### Issue: Toast notifications not showing

**Solution:**
```javascript
// Make sure Toaster is in App.jsx
import { Toaster } from 'react-hot-toast';

<Toaster position="top-right" />
```

### Issue: CSS not working

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Make sure index.css is imported in main.jsx
import './index.css'
```

---

## 📦 Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build
npm run preview

# Output directory
dist/
```

Deploy `dist/` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting

---

## 🔐 Security Features

### Authentication
- JWT tokens stored in localStorage
- Automatic token injection via Axios
- Auto-logout on 401 responses
- Protected routes with auth guards

### Data Validation
- Client-side form validation
- Server-side validation (backend)
- Input sanitization
- Error handling

---

## 🎯 Performance

### Optimizations
- ✅ Lazy loading components
- ✅ Memoized callbacks
- ✅ Direct state updates (avoid refetches)
- ✅ Efficient Socket.IO listeners
- ✅ Debounced user actions
- ✅ Optimized re-renders

### Bundle Size
```bash
# Analyze bundle
npm run build

# Check dist/ folder size
du -sh dist/
```

---

## 📝 Scripts

```bash
# Development server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint
```

---

## 🤝 Contributing

### Code Style
- Use functional components
- Follow React hooks best practices
- Keep components small and focused
- Use Tailwind utility classes
- Write clear comments

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/new-component

# Make changes and commit
git add .
git commit -m "Add new component"

# Push and create PR
git push origin feature/new-component
```

---

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

---

## 🙏 Acknowledgments

- **React** - UI framework
- **Vite** - Lightning-fast build tool
- **Zustand** - Simple state management
- **Socket.IO** - Real-time communication
- **Tailwind CSS** - Utility-first CSS
- **Lucide** - Beautiful icons

---

## 📧 Support

For issues or questions:
1. Check troubleshooting section above
2. Review backend README
3. Check browser console for errors
4. Verify backend is running

---

## 🎉 Quick Start Summary

```bash
# Install
npm install

# Configure (already done)
# Check .env file

# Run
npm run dev

# Open
http://localhost:5173

# Test
Register → Browse drops → Reserve → Purchase
```

**Enjoy your real-time sneaker drop system!** 🚀👟

---

**Made with ❤️ using React, Vite, and Socket.IO**
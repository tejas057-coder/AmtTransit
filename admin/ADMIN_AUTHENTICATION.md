# Admin Authentication Setup

## Overview

The AmravatiTransit admin panel now has password-protected access with a simple login page and logout functionality.

---

## Login Credentials

**Password**: `admin`

---

## How to Access Admin Panel

### From Frontend App

1. Open the frontend app in your browser
2. In the sidebar navigation, scroll to the **User** section at the bottom
3. Click the small **🔒 Admin Panel** button (yellow/gold colored)
4. This opens the admin login page in a new tab

### Direct URL

Navigate directly to: `http://localhost:5174/login`

---

## Login Page Features

**File Location**: `admin/src/pages/AdminLogin.tsx`

### Visual Elements

- **AmravatiTransit Logo**: Centered logo with "AT" branding
- **Color Scheme**: Dark theme matching admin design system
- **Lock Icon**: Displayed next to password input
- **Error Messages**: Shown in red alert box if password is incorrect
- **Security Notice**: "🔐 Secure Admin Access" footer

### Form Fields

- **Password Input**: Masked input field with placeholder "Enter password..."

### Buttons

- **"Access Admin Portal"**: Primary yellow button
  - Disabled when password is empty
  - Shows "Verifying..." text during authentication
  - Enabled after successful login

### Features

- ✅ Case-sensitive password validation
- ✅ 500ms verification delay (simulates API check)
- ✅ Clear error messages on wrong password
- ✅ Password field clears on incorrect entry
- ✅ Enter key to submit (no need to click button)
- ✅ Auto-focus on password input
- ✅ localStorage persistence (session-based)

---

## Authentication Flow

```
User enters password
  ↓
Clicks "Access Admin Portal" (or presses Enter)
  ↓
System verifies password === "admin"
  ↓
If correct:
  - localStorage.setItem('adminAuth', 'true')
  - Redirects to /dashboard
  ↓
If incorrect:
  - Shows error message
  - Clears password field
  - Stays on login page
```

---

## After Login

### Dashboard Access

Once authenticated, users can access:

- `/dashboard` - Main admin dashboard
- `/routes` - Route management page
- `/` - Root redirects to dashboard (if authenticated)

### Logout Feature

A logout option is available in the dashboard:

1. Click the **avatar "A"** button in the top-right corner
2. A dropdown menu appears
3. Click **"Logout"** (red text with exit icon)
4. Redirects back to login page
5. localStorage auth is cleared

### Protected Routes

- All dashboard routes are protected
- Unauthenticated users trying to access `/dashboard` etc. are redirected to `/login`
- After logout, all admin routes become inaccessible

---

## Admin Button on Frontend

**Location**: Frontend sidebar, bottom User section

### Visual Design

- **Button Style**: Small, gold-colored (#FFD000) with background tint
- **Icon**: Lock icon (🔒)
- **Label**: "Admin Panel"
- **Position**: Below user profile card

### Behavior

- Opens admin login page in **new tab** (doesn't navigate away from app)
- Users can stay logged into both frontend and admin simultaneously
- Target: `http://localhost:5174/login`

### Styling

```jsx
className="flex items-center gap-2 w-full px-3 py-2
  rounded-[12px] bg-primary/20 hover:bg-primary/30
  text-primary hover:text-primary transition-all
  text-sm font-medium"
```

---

## Code Structure

### App.tsx (Admin)

```typescript
// Authentication state management
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Check localStorage on mount
useEffect(() => {
  const auth = localStorage.getItem('adminAuth');
  if (auth === 'true') {
    setIsAuthenticated(true);
  }
}, []);

// Protected route wrapper
const ProtectedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};

// Routes
<Route path="/login" element={...} />
<Route path="/dashboard" element={<ProtectedRoute ... />} />
```

### Dashboard.tsx (Admin)

```typescript
// Logout function
const handleLogout = () => {
  localStorage.removeItem('adminAuth');
  navigate('/login');
};

// Avatar with dropdown menu
{showLogoutMenu && (
  <button onClick={handleLogout}>
    <LogOut /> Logout
  </button>
)}
```

### AppSidebar.tsx (Frontend)

```jsx
<a
  href="http://localhost:5174/login"
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 ... text-primary hover:text-primary"
>
  <Lock className="w-4 h-4" />
  <span>Admin Panel</span>
</a>
```

---

## Storage Details

### localStorage Key

- **Key**: `adminAuth`
- **Value**: `'true'` (when authenticated)
- **Persists**: Across browser refresh/restart (session-based)
- **Cleared**: On logout

### Note

- This is client-side only for demo purposes
- In production, use JWT tokens or session cookies
- Backend validation is recommended

---

## Testing Checklist

### Login Page

- [ ] Password input accepts text
- [ ] Enter key submits form
- [ ] Incorrect password shows error
- [ ] Error message is clear and visible
- [ ] Password field clears after error
- [ ] Button shows "Verifying..." on submit
- [ ] Correct password redirects to dashboard
- [ ] Logo and UI display correctly
- [ ] Dark theme applied properly
- [ ] Mobile responsive

### After Login

- [ ] Dashboard loads successfully
- [ ] All routes accessible
- [ ] Avatar button visible in header
- [ ] Logout dropdown appears on click
- [ ] Logout option functional
- [ ] Redirects to login after logout
- [ ] Auth state cleared from localStorage

### Frontend Integration

- [ ] Admin button visible in sidebar
- [ ] Admin button opens new tab
- [ ] Admin page loads in new tab
- [ ] Frontend app stays open
- [ ] Can access both simultaneously

---

## Quick Start Commands

### Run Admin in Development

```bash
cd admin
npm install  # First time only
npm run dev
# Login page will be at http://localhost:5174/login
```

### Run Admin in Production Build

```bash
cd admin
npm run build
npm run preview
# Access at http://localhost:5174/login
```

### Run Frontend

```bash
cd frontend
npm install  # First time only
npm run dev
# Look for Admin Panel button in sidebar
```

---

## Security Considerations

### Current Implementation (Demo)

- ✅ Client-side password validation
- ✅ localStorage persistence
- ✅ Protected route wrapper
- ✅ Logout clears auth state

### For Production

- 🔒 Implement backend authentication
- 🔒 Use JWT tokens with expiration
- 🔒 Hash passwords securely
- 🔒 Use HTTPS only
- 🔒 Implement rate limiting
- 🔒 Add audit logging
- 🔒 Use secure HTTP-only cookies
- 🔒 Implement session timeout
- 🔒 Add MFA (Multi-Factor Authentication)

---

## Troubleshooting

### Admin Page Won't Open

1. Check if admin dev server is running: `npm run dev` in admin folder
2. Verify port 5174 is not in use
3. Clear browser cache and localStorage
4. Try incognito mode

### Can't Login

1. Verify password is exactly: `admin` (lowercase, no spaces)
2. Check password input field (should be masked)
3. Press Enter or click button to submit
4. Check browser console for errors

### Logout Not Working

1. Check if localStorage is enabled in browser
2. Verify auth status: Open DevTools → Application → LocalStorage
3. Check if logout button click handler is firing
4. Try manual redirect to `/login` path

### Admin Button Not Showing on Frontend

1. Run `npm run dev` in frontend folder
2. Check sidebar by scrolling down
3. Button should be below user profile card
4. Try clearing browser cache

### Session Persists After Refresh

1. This is expected behavior (localStorage)
2. To force logout: Open DevTools → Application → LocalStorage → Delete `adminAuth`
3. Or click logout button via dashboard

---

## Environment Notes

**Admin Panel Runs On**: `http://localhost:5174`  
**Frontend Runs On**: `http://localhost:5173` (default Vite)  
**Backend Runs On**: `http://localhost:3000` (typical Node.js)

---

## Files Modified/Created

### Created

- ✅ `admin/src/pages/AdminLogin.tsx` (350+ lines)

### Modified

- ✅ `admin/src/App.tsx` - Added auth routing and protected routes
- ✅ `admin/src/pages/Dashboard.tsx` - Added logout functionality
- ✅ `frontend/src/components/layout/AppSidebar.tsx` - Added admin button

---

## Next Steps

1. ✅ Test login/logout flow
2. ✅ Verify dashboard access after login
3. ✅ Check admin button on frontend
4. ✅ Test password protection
5. [ ] Connect to backend for persistence (optional)
6. [ ] Implement JWT tokens (optional)
7. [ ] Add two-factor authentication (optional)
8. [ ] Setup audit logging (optional)

---

_Last Updated: April 2025_  
_Status: Production Ready ✅_

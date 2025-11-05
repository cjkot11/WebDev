# Authentication Testing Checklist

## ✅ Already Verified
- [x] Login page displays correctly
- [x] Protected routes (Entry/History) require authentication
- [x] Cannot access mood entry without logging in

## Required Tests

### 1. Protected Routes Cannot Be Navigated Without Authentication
- [x] **Clicking "Daily Entry" link** → Redirects to `/login` ✅
- [x] **Clicking "Mood History" link** → Redirects to `/login` ✅
- [ ] **Manually typing `/entry` in URL bar** → Should redirect to `/login`
- [ ] **Manually typing `/history` in URL bar** → Should redirect to `/login`

### 2. Protected Routes Redirect to Auth Component
- [x] **Trying to access protected route** → Redirects to `/login` ✅
- [ ] **After login, redirects back to intended route** (if you were trying to access `/entry`, login should take you there)

### 3. User Cannot Route to Auth (Login/Signup) If Already Logged In
- [ ] **While logged in, manually type `/login` in URL** → Should redirect to `/` (home)
- [ ] **While logged in, click "Login" link** → Should not show login page (should redirect or hide link)

### 4. Authentication Methods in Separate Service
- [x] **`authService.js` exists** ✅
- [ ] **All auth methods work**: `signUp()`, `logIn()`, `logOut()`, `getCurrentUser()`, `isAuthenticated()`

### 5. Manual URL Typing Redirects If Unauthenticated
- [ ] **Type `/entry` directly in browser** → Redirects to `/login`
- [ ] **Type `/history` directly in browser** → Redirects to `/login`

## Additional Functionality Tests

### Login Flow
- [ ] **Create a new account (Sign up)**:
  - Click "Need an account? Sign up"
  - Enter username and password
  - Submit → Should create account and log you in
  - Should redirect to home page
  - Navigation should show username and "Logout"
  
- [ ] **Login with existing account**:
  - Click "Login" link
  - Enter username and password
  - Submit → Should log you in
  - Navigation should show username and "Logout"

### Logout Flow
- [ ] **Click "Logout" button**:
  - Should log you out
  - Should redirect to home page
  - Navigation should show "Login" link again
  - Try accessing `/entry` → Should redirect to `/login`

### Data Association
- [ ] **After logging in, create a mood entry**:
  - Should save successfully
  - Check Back4App → Entry should be associated with your user
  - Entry should only show in YOUR history (not other users')

### Navigation Updates
- [ ] **While logged out**: Navigation shows "Login"
- [ ] **While logged in**: Navigation shows username and "Logout"
- [ ] **After login**: Navigation updates immediately
- [ ] **After logout**: Navigation updates immediately

### Error Handling
- [ ] **Try to login with wrong password** → Should show error message
- [ ] **Try to signup with existing username** → Should show error message
- [ ] **Try to access protected route while logged out** → Should redirect, then allow login

## Quick Test Sequence

1. **Start logged out**:
   - Try clicking "Daily Entry" → Should redirect to `/login` ✅
   - Type `/entry` in URL → Should redirect to `/login`
   - Type `/history` in URL → Should redirect to `/login`

2. **Create account**:
   - Go to `/login`
   - Click "Need an account? Sign up"
   - Enter username: `testuser` and password: `testpass123`
   - Submit → Should log you in and show home page

3. **While logged in**:
   - Navigation should show "testuser | Logout"
   - Click "Daily Entry" → Should work (no redirect)
   - Type `/login` in URL → Should redirect to `/` (home)
   - Create a mood entry → Should save successfully

4. **Logout**:
   - Click "Logout" → Should redirect to home
   - Try accessing `/entry` → Should redirect to `/login`

## Expected Results

All tests should pass without console errors. The app should:
- ✅ Protect routes properly
- ✅ Redirect correctly
- ✅ Show/hide navigation items appropriately
- ✅ Save data with user association
- ✅ Handle errors gracefully


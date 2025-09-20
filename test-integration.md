# Integration Test Guide

## Prerequisites
1. Backend server running on port 5000
2. Frontend server running on port 5173
3. MongoDB Atlas connected

## Test Steps

### 1. Start Backend
```bash
cd NotesAppBackend
npm run dev
```

### 2. Start Frontend
```bash
cd NotesAppFrontend
npm install
npm run dev
```

### 3. Test Authentication Flow
1. Open http://localhost:5173
2. Should redirect to /login
3. Click "Sign up" and create a new account
4. Should redirect to /notes after successful signup
5. Logout and test login with the same credentials

### 4. Test Notes CRUD
1. Create a new note with title, body, and tags
2. Edit the note and save changes
3. Search for notes using the search bar
4. Filter by tags
5. Delete a note

### 5. Test Token Refresh
1. Wait for access token to expire (10 minutes)
2. Try to perform an action (should auto-refresh)
3. Verify you stay logged in

### 6. Test Error Handling
1. Try to access /notes without being logged in
2. Should redirect to /login
3. Try invalid login credentials
4. Should show error message

## Expected Behavior
- All API calls should go to http://localhost:5000/api/v1
- Authentication should work with JWT + refresh tokens
- Notes should persist in MongoDB
- UI should show loading states and error messages
- Token refresh should happen automatically

## Troubleshooting
- Check browser console for errors
- Check backend console for API logs
- Verify MongoDB connection
- Check CORS settings if having issues

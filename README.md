# Cohabitask

A web application designed to help couples find balance in household responsibilities.

## Features

- User authentication with Firebase
- Modern UI with Chakra UI
- TypeScript for better type safety
- React Router for navigation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

4. Copy your Firebase configuration values and update the `.env` file with your actual Firebase credentials:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

- `src/config/firebase.ts` - Firebase configuration
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/App.tsx` - Main application component with routing

## Technologies Used

- React
- TypeScript
- Firebase Authentication
- Chakra UI
- React Router
- Vite

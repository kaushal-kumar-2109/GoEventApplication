# GoEventApp

This folder contains the React Native Expo frontend for the GoEvent mobile application.

## Requirements
- Node.js 18+ (recommended)
- Expo CLI installed globally: `npm install -g expo-cli`
- Android/iOS simulator or a physical device for native testing
- A web browser for Expo web preview

## Install dependencies
Run this from the `GoEventApp` folder:

```bash
npm install
```

## Run the app
From the `GoEventApp` folder, use one of these commands:

- Start the Expo development server:

```bash
npm start
```

- Launch on Android:

```bash
npm run android
```

- Launch on iOS (macOS only):

```bash
npm run ios
```

- Open in a browser:

```bash
npm run web
```

## Configure Backend URL

By default, the frontend is configured to connect to `http://10.210.126.18:3000`. To change this to your own backend localhost URL:

1. Open `GoEventApp/mailer/routers.js`
2. Find the line:
   ```javascript
   const HOST_NETWORK_PATH = 'http://10.210.126.18:3000';
   ```
3. Replace it with your backend server URL. For example:
   ```javascript
   const HOST_NETWORK_PATH = 'http://localhost:3000';
   ```
   or
   ```javascript
   const HOST_NETWORK_PATH = 'http://192.168.1.100:3000';
   ```
4. Save the file and restart the frontend app

## Notes
- The frontend uses local SQLite storage and connects to the backend mailer service for OTP and invitation delivery.
- Backend API endpoints are configured inside `GoEventApp/mailer/routers.js`.
- Ensure the backend server (GoEventMailer) is running before starting the frontend.
- If the app cannot reach the backend, verify the mailer server is running and the `HOST_NETWORK_PATH` URL in `routers.js` is correct.

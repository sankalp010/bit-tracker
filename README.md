# Bit Tracker

A React cryptocurrency dashboard built with Vite, Material UI, CoinGecko, and Firebase.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Run locally

```sh
npm install
npm run dev
```

Vite prints the local URL when the development server starts.

## Production build

```sh
npm run build
npm run preview
```

The production bundle is written to `dist/`. Configure the deployment host to serve `index.html` as the fallback for client-side routes such as `/coins/:id`.

## Services

The app uses the Firebase web configuration in `src/config/firebaseConfig.js` and the public CoinGecko API. Firebase web configuration is client-side; secure access with Firebase Authentication and Firestore security rules.

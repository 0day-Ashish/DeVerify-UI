# DeVerify

DeVerify is an AI-assisted judging assistant for hackathons. It verifies submissions, helps judges score objectively, and provides admin tooling to manage hackathons and submissions.

![Screenshot: Landing page](./docs/screenshots/image.png)

## Key features
- Automated submission analysis and scoring
- Admin dashboard with wallet-based access (Celo Sepolia)
- Hacker dashboard for participants
- MongoDB-backed storage for hackathons, submissions, and newsletter subscriptions
- Minimal, responsive UI with blurred / glassmorphism design

## Table of contents
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [API endpoints](#api-endpoints)
- [Run locally](#run-locally)
- [Deployment notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)

## Getting started
Prerequisites:
- Node.js 18+ (or the version your project requires)
- npm or yarn
- MongoDB instance (Atlas or self-hosted)
- MetaMask or other EVM wallet for admin testing (connect to Celo Sepolia when using admin features)

Clone and install:
```bash
git clone https://github.com/<your-org>/DeVerify.git
cd DeVerify/frontend
npm install
```

## Environment variables
Create a `.env.local` at the frontend root with the following:

```env
NEXT_PUBLIC_ADMIN_ADDRESS=0x...             # admin wallet address (lowercase accepted)
MONGODB_URI=mongodb+srv://<user>:<pw>@...   # MongoDB connection string
MONGODB_DB=deverify                         # database name (default: deverify)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # optional, for previews / links
```

Restart dev server after updating env vars.

## Database
Collections used (example):
- `hackathons`
- `submissions`
- `subscriptions`

Recommended index for subscriptions:
```js
db.subscriptions.createIndex({ email: 1 }, { unique: true });
```

## API endpoints (examples)
- GET `/api/hackathons` — list hackathons
- POST `/api/subscribe` — add newsletter subscription { email }

## Run locally
Start the dev server:
```bash
cd frontend
npm run dev
# open http://localhost:3000
```

Build for production:
```bash
npm run build
npm run start
```

## Wallet & Admin access
- Admin access requires connecting a wallet and matching `NEXT_PUBLIC_ADMIN_ADDRESS` and chain = Celo Sepolia (chain id hex `0xaa044c`).

## Contributing
- Fork, create a feature branch, open a PR with description and screenshots.

## License
Specify your license (e.g., MIT).

## Notes
Place the screenshot at `docs/screenshots/image.png`. Remove or replace as needed.
```// filepath: /Users/ashishranjandas/Desktop/DeVerify/README.md
# DeVerify

DeVerify is an AI-assisted judging assistant for hackathons. It verifies submissions, helps judges score objectively, and provides admin tooling to manage hackathons and submissions.

![Screenshot: Landing page](./docs/screenshots/image.png)

## Key features
- Automated submission analysis and scoring
- Admin dashboard with wallet-based access (Celo Sepolia)
- Hacker dashboard for participants
- MongoDB-backed storage for hackathons, submissions, and newsletter subscriptions
- Minimal, responsive UI with blurred / glassmorphism design

## Table of contents
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database](#database)
- [API endpoints](#api-endpoints)
- [Run locally](#run-locally)
- [Deployment notes](#deployment-notes)
- [Contributing](#contributing)
- [License](#license)

## Getting started
Prerequisites:
- Node.js 18+ (or the version your project requires)
- npm or yarn
- MongoDB instance (Atlas or self-hosted)
- MetaMask or other EVM wallet for admin testing (connect to Celo Sepolia when using admin features)

Clone and install:
```bash
git clone https://github.com/<your-org>/DeVerify.git
cd DeVerify/frontend
npm install
```

## Environment variables
Create a `.env.local` at the frontend root with the following:

```env
NEXT_PUBLIC_ADMIN_ADDRESS=0x...             # admin wallet address (lowercase accepted)
MONGODB_URI=mongodb+srv://<user>:<pw>@...   # MongoDB connection string
MONGODB_DB=deverify                         # database name (default: deverify)
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # optional, for previews / links
```

Restart dev server after updating env vars.

## Database
Collections used (example):
- `hackathons`
- `submissions`
- `subscriptions`

Recommended index for subscriptions:
```js
db.subscriptions.createIndex({ email: 1 }, { unique: true });
```

## API endpoints (examples)
- GET `/api/hackathons` — list hackathons
- POST `/api/subscribe` — add newsletter subscription { email }

## Run locally
Start the dev server:
```bash
cd frontend
npm run dev
# open http://localhost:3000
```

Build for production:
```bash
npm run build
npm run start
```

## Wallet & Admin access
- Admin access requires connecting a wallet and matching `NEXT_PUBLIC_ADMIN_ADDRESS` and chain = Celo Sepolia (chain id hex `0xaa044c`).

## Contributing
- Fork, create a feature branch, open a PR with description and screenshots.

## License
Specify your license (e.g., MIT).

## Notes
Place the screenshot at `docs/screenshots/image.png`. Remove or replace as needed.
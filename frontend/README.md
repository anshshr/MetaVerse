# MetaVerse Frontend (React)

Minimal React frontend that maps directly to the backend modules in `/src/http/modules` and WebSocket events in `/src/websocket`.

## Covered backend modules

- Auth: register, login
- Admin: create/update element, create avatar, create map
- User: update metadata, get avatars, get avatars by bulk IDs
- Space: create, delete, list my spaces
- Arena: list elements, get space details, add/delete space elements
- WebSocket: join, move, leave-space

## Setup

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
VITE_WS_URL=ws://localhost:8080
```

Install and run:

```bash
cd frontend
npm install
npm run dev
```

Build:

```bash
npm run build
```

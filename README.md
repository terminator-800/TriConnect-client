# TriConnect — Client

TriConnect is a full-stack job-matching platform that connects five user roles in one system: **job seekers**, **business employers**, **individual employers**, **manpower providers**, and **administrators**. It handles the full hiring lifecycle — registration and email verification, profile and document uploads, job posting and applications, saved jobs, employer–agency matching, real-time messaging, hiring/rejection workflows, final agreements, manpower team management and deployments (with admin verification), user reports, feedback, and an admin dashboard with charts.

This repository (`TriConnect-client`) is the React frontend. It communicates with the backend (`TriConnect-api`) over REST HTTP, plus Socket.IO for live chat and notifications.

## Tech Stack

- **React 19** + **Vite 5** (`@vitejs/plugin-react`)
- **Tailwind CSS v4** (`@tailwindcss/vite`, `tailwindcss-font-inter`)
- **React Router DOM v7**
- **TanStack React Query v5** — server/async state (`useQuery` / `useMutation`)
- **Axios** — HTTP client
- **Socket.IO Client** — real-time messaging and notifications
- **Chart.js** + **react-chartjs-2** — admin dashboard analytics
- **date-fns**, **react-easy-crop**, **js-cookie**, **prop-types**

## Architecture

### Entry Point

`main.jsx` wraps the application in:

- `QueryClientProvider` (TanStack React Query)
- `BrowserRouter` (React Router)

### State Management

State is layered by concern rather than centralized in a single store. There is **no Redux, Zustand, or Recoil** in this codebase.

| Layer | Tool | Responsibility |
|---|---|---|
| Server/async data | TanStack React Query v5 | Fetching, caching, mutating server state |
| Auth session | React Context (`AuthContext`) | `authenticated`, `role`, `userId` |
| UI state | `useState` | Local component state |
| Complex flows | `useReducer` | Job-post modal flows only |

### API Layer

- Most requests are direct Axios calls using `import.meta.env.VITE_API_URL`.
- A shared Axios client (`api/axios.js`) is used for login, logout, and select deployment endpoints, configured with:
  - Base URL
  - `withCredentials: true`
  - Bearer token interceptor

### Custom Hooks (`/hooks`)

Custom hooks form the integration layer between components and the API, wrapping React Query around Axios:

- `useLogin`
- `useUserProfiles`
- `useJobposts`
- `useCreateJobPost`
- `useApplicants`
- `useNotification`
- `CHAT.js`
- ...and others, following the same pattern.

### Real-Time

Socket.IO Client connects to the same API URL as REST requests:

- `utils/socket.js` — socket instance/configuration
- `useSocket.js` — hook for consuming the socket connection in components

Used for live chat and real-time notifications.

### Routing & Auth Gating

Routes are gated using two wrapper components:

- **`PublicRoute`** — accessible without authentication
- **`PrivateRoute`** — requires authentication; handles role-based redirects

Example role-based redirects:

- Job seeker → `/jobseeker/jobs`
- Employers → `/role/dashboard`

## Core Features

- Registration and email verification
- Profile and document uploads
- Job posting and applications
- Saved jobs
- Employer–agency matching
- Real-time messaging
- Hiring / rejection workflows
- Final agreements
- Manpower team management and deployments (with admin verification)
- User reports and feedback
- Admin dashboard with charts and analytics

## User Roles

1. Job Seeker
2. Business Employer
3. Individual Employer
4. Manpower Provider
5. Administrator

## Dev Tooling

- **ESLint 9**
- **Prettier**
- **PostCSS** + **Autoprefixer**

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the `TriConnect-api` backend |

## Related Repository

- [`TriConnect-api`](#) — Node.js/Express backend (REST + Socket.IO)
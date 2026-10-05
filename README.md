# User Dashboard

A user dashboard built with React, TypeScript, and Vite. The user list comes from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Search and sort run on the client, because the API does not support them. Add and delete are sent to the API, then stored in `localStorage` so they remain after refresh.

## Run

Node.js 20.19 or newer is required.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Other commands:

```bash
npm run lint      # check the code
npm run build     # production build
npm run preview   # preview the production build
```

## Structure

```text
src/
  main.tsx                 # app entry
  App.tsx                  # routing and QueryClientProvider
  pages/
    dashboard-page.tsx     # dashboard page
  components/
    ui/                    # shadcn/ui components
    users/                 # search, sort, list, add, and delete
  features/users/
    api.ts                 # API requests
    schema.ts              # user model and Zod validation
    use-users.ts           # TanStack Query reads and mutations
    directory.ts           # client-side merge, search, and sort
    storage.ts             # persist added and deleted users in localStorage
  lib/
    query-client.ts        # TanStack Query setup
    utils.ts               # cn helper
```

The page renders the states from `useUsers`: loading, error, empty list, and no search results. The add-user form is validated with React Hook Form and Zod.

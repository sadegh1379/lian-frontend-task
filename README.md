# User Dashboard

A responsive user directory built with React, TypeScript, and Vite. It loads people from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users) and lets you search, sort, add, and delete them in the browser.

JSONPlaceholder does not filter, search, or sort on the server, and it does not keep writes. Those operations run on the client. Each add is sent with `POST` and each delete of a server user is sent with `DELETE`. The app then stores the change in `localStorage`, so the directory looks the same after a refresh.

## What you can do

The dashboard lists three fields for every user: name, email, and company name. On a wide screen the list is a table. On a narrow screen it becomes stacked cards.

- Search by name or email. Matching is case-insensitive and happens on the list already loaded in the browser.
- Sort by user ID, name, or username, in ascending or descending order. The default is user ID, ascending.
- Add a user. The form asks for name, email, and company name, and checks them with React Hook Form and Zod before anything is sent.
- Open a user's details. The page loads that person from `GET /users/{id}` and shows name, username, email, phone, address, and company name. It has its own loading and error states, and a link back to the list. A user created in this browser is read from local storage, because the API does not keep that record.
- Delete a user after a confirmation dialog. A user that came from the API is deleted remotely and remembered as removed. A user created in this browser is removed from local storage only, because that record does not exist on the server.

New users get the next free numeric ID. Deleted server IDs are not reused, so a removed person does not reappear when the list is fetched again.

## Screen states

The page does not render an empty table while data is in flight.

| State | What you see |
| --- | --- |
| Loading | Skeleton placeholders while the user list is requested |
| Error | A message and a Retry button when the request fails |
| Empty | A short explanation when every user has been removed |
| No results | A clear-search action when the query matches nobody |
| Ready | The filtered, sorted list |

A status line under the list explains that local adds and deletes survive refresh.

## Stack

- React and TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query for loading users and for add/delete mutations
- Zod for the API payload and the add-user form
- React Hook Form for the add-user form
- React Router for the app shell

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

UI, data fetching, and list rules live in separate folders so the page mostly composes them.

```text
src/
  main.tsx                 # app entry
  App.tsx                  # routing and QueryClientProvider
  pages/
    dashboard-page.tsx     # dashboard page: search, sort, and screen states
    user-detail-page.tsx   # one user: loading, error, and a link back to the list
  components/
    ui/                    # shadcn/ui components
    users/                 # toolbar, list, dialogs, skeleton, empty and error views
  features/users/
    api.ts                 # fetch, create, and delete requests
    schema.ts              # user model and Zod validation
    use-users.ts           # TanStack Query reads and mutations
    use-user.ts            # load one user by id
    format-address.ts      # readable address line
    directory.ts           # merge remote users with local edits, then search and sort
    storage.ts             # read and write added and deleted users in localStorage
    query-keys.ts          # query keys for the remote list and local edits
  lib/
    query-client.ts        # TanStack Query setup
    utils.ts               # cn helper
```

`useUsers` fetches the remote list, reads local edits, and returns one merged array. The dashboard page never calls `fetch` itself. Search text and sort choices stay in page state and are not written to storage.

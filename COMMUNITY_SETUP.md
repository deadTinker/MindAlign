# MindAlign Community Hub

The Community Hub is implemented inside the existing React + Express + MongoDB application. It does not depend on another branch or an external article service.

## Features

- Authenticated community feed with latest/popular sorting, category filters, search and pagination.
- Article creation, reading, editing and deletion (authors can only edit/delete their own articles).
- Public contributor pages showing published articles.
- Article likes and comment counts.
- Comments, one-level replies, comment likes and author-only comment deletion.
- Responsive feed cards and article reading layout using the project's existing Tailwind styling and Lucide icons.

## Backend

The backend mounts the community API at `/api/community` and protects all endpoints with the existing JWT middleware.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/community/articles` | Paginated feed (`page`, `limit`, `sort`, `category`, `search`) |
| POST | `/api/community/articles` | Publish an article |
| GET | `/api/community/articles/:id` | Read article and its comments/replies |
| PUT | `/api/community/articles/:id` | Edit own article |
| DELETE | `/api/community/articles/:id` | Delete own article and its comments |
| POST | `/api/community/articles/:id/like` | Toggle article like |
| POST | `/api/community/articles/:id/comments` | Add comment or reply (`parentId` for reply) |
| POST | `/api/community/comments/:id/like` | Toggle comment/reply like |
| DELETE | `/api/community/comments/:id` | Delete own comment; deleting a parent also deletes its replies |
| GET | `/api/community/users/:userId` | Public contributor profile |
| GET | `/api/community/users/:userId/articles` | Contributor's published articles |

## Run locally

1. Configure `Backend/.env` with the same `MONGO_URI` and `JWT_SECRET` used by the existing authentication feature. Do not commit this file.
2. In `Backend`, run `npm install`, then `npm run dev` (or `npm start`). The API listens on port `5000` by default.
3. In `Frontend`, run `npm install`, then `npm run dev`.
4. Sign in, open **Community** in the sidebar, publish an article and test likes/comments/replies using a second account.

The frontend defaults to `http://localhost:5000/api`. To change it, set `VITE_API_URL` in `Frontend/.env` to the API base URL (without `/community`), e.g. `VITE_API_URL=http://localhost:5000/api`.

## Notes

- MongoDB collections are created automatically by Mongoose when the first article/comment is written; no manual migration is required.
- Article content is stored as plain text and rendered as text, not interpreted as HTML.
- Only authenticated users can view or interact with the hub, matching the app's current protected-route model.

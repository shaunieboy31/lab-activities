# Activity 6: Movie Review System

## Description
A full-stack web application for browsing movies, leaving reviews, and managing movie content. Users can view movies and submit reviews with ratings. Admin users can create, edit, and delete movies, as well as delete user reviews.

## Features
- **Authentication**: User login/signup with JWT tokens
- **Admin Dashboard**: Create, edit, and delete movies
- **Movie Management**: Browse all movies with average ratings
- **Reviews**: Users can submit reviews (rating + comment) for movies
- **Admin Controls**: Delete reviews, manage movie inventory
- **Session Persistence**: Auto-login on page refresh using stored tokens
- **Logout**: Clear session and return to login

## Tech Stack
- **Backend**: NestJS + TypeScript + TypeORM + SQLite
- **Frontend**: React (TSX) + Vite + Axios
- **Authentication**: JWT + bcrypt
- **API Docs**: Swagger/OpenAPI

## Running the Project

### Backend
```bash
cd Activity6/backend
npm install
npm run seed          # Create admin user (username: admin, password: admin)
npm run start:dev     # Runs on http://localhost:3000
```

Access Swagger docs: http://localhost:3000/api

### Frontend
```bash
cd Activity6/frontend
npm install
npm run dev           # Runs on http://localhost:5173
```

## API Endpoints

### Auth
- `POST /auth/signup` - Create new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user (requires auth)

### Movies
- `GET /movies` - List all movies
- `GET /movies/:id` - Get movie with reviews
- `POST /movies` - Create movie (admin only)
- `PUT /movies/:id` - Update movie (admin only)
- `DELETE /movies/:id` - Delete movie (admin only)

### Reviews
- `GET /movies/:id/reviews` - Get reviews for a movie
- `POST /movies/:id/reviews` - Submit a review (requires auth)
- `DELETE /reviews/:id` - Delete review (admin only)

## Demo Login Credentials
- **Admin**: username `admin`, password `admin`
- Can create other users via signup

## Key Files
- Backend: `src/app.module.ts`, `src/auth/`, `src/movies/`, `src/reviews/`
- Frontend: `src/AuthProvider.tsx`, `src/pages/`, `src/components/`

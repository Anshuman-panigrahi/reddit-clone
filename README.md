# Full-Stack Reddit Clone

A full-stack Reddit clone built using the MERN stack (MongoDB, Express, React, Node.js) with Vite.

## Features

*   **User Authentication**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt for password hashing.
*   **Communities**: Users can create new communities (subreddits) and view existing ones.
*   **Posts**: 
    *   Create text posts or upload image posts (using Multer).
    *   Dynamic sorting (Hot, New, Top, Rising).
    *   Search functionality across post titles and content.
    *   Upvote and downvote system.
    *   Save and unsave posts to your profile.
    *   Authors can delete their own posts.
*   **Comments**: 
    *   Add comments to specific posts.
    *   Authors can delete their own comments.

## Tech Stack

*   **Frontend**: React (with Hooks), Vite, React Router DOM, Axios, standard CSS for styling.
*   **Backend**: Node.js, Express.js, MongoDB with Mongoose, JWT, Multer (for handling multipart/form-data for image uploads).

## Prerequisites

*   Node.js (v14 or higher)
*   MongoDB (running locally or a MongoDB Atlas URI)

## Installation & Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd reddit-clone
    ```

2.  **Setup Backend**:
    ```bash
    cd reddit-clone/backend
    npm install
    ```
    *Ensure your `.env` file in the `backend` directory is properly configured:*
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/redditclone
    JWT_SECRET=mysecretkey
    ```
    *Start the backend development server:*
    ```bash
    npm run dev
    ```

3.  **Setup Frontend**:
    Open a new terminal window/tab:
    ```bash
    cd frontend
    npm install
    ```
    *Start the frontend Vite development server:*
    ```bash
    npm run dev
    ```

4.  **Access the application**:
    Open your browser and navigate to the frontend URL (typically `http://localhost:5173`). The backend API runs on `http://localhost:5000`.

## API Endpoints

### Auth Routes (`/api/auth`)
*   `POST /register` - Register a new user
*   `POST /login` - Login a user and receive JWT
*   `GET /profile` - Get user profile (Protected)

### Community Routes (`/api/communities`)
*   `GET /` - Get all communities
*   `POST /` - Create a community (Protected)

### Post Routes (`/api/posts`)
*   `GET /` - Get all posts (supports `search` and `sort` query params)
*   `POST /` - Create a post (Protected, supports `image` upload)
*   `PATCH /:id/vote` - Upvote or downvote a post (Protected)
*   `PATCH /:id/save` - Save or unsave a post (Protected)
*   `DELETE /:id` - Delete a post by author (Protected)

### Comment Routes (`/api/comments`)
*   `GET /` - Get all comments
*   `GET /post/:postId` - Get comments for a specific post
*   `POST /` - Create a comment (Protected)
*   `DELETE /:id` - Delete a comment by author (Protected)

## Folder Structure

*   `frontend/`: Contains the Vite React application.
    *   `src/components/`: Reusable React components.
    *   `src/pages/`: Main page components (Home, Login, Register, etc.).
    *   `src/api/`: Axios configuration and API helpers.
*   `reddit-clone/backend/`: Contains the Express server.
    *   `controllers/`: Request handler logic.
    *   `models/`: Mongoose database schemas.
    *   `routes/`: API endpoint definitions.
    *   `middleware/`: Express middleware (e.g., JWT protection).
    *   `uploads/`: Directory for user-uploaded post images.

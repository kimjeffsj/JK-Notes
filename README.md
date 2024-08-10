# JK Notes

JK Notes is a simple note-taking application built with Node.js, Express, and MongoDB uses local storage.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete notes

## Prerequisites

Before you begin, ensure you have these installed:

- Node.js
- MongoDB (you can download it from https://www.mongodb.com/try/download/community )

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/jk-notes.git
   cd jk-notes
   ```

2. Install the dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   - Copy the `.env_sample` file to a new file named `.env`
   - Update the values in `.env` with your specific configuration

## Configuration

Make sure to a `.env` file in the root directory of the project and add the following environment variables:

```
MONGO_URI=mongodb://localhost:27017/your-database-name
SECRET=your_jwt_secret_key
PORT=your_port
```

Make sure to replace the placeholder values with your actual configuration.

## Usage

To start the server, run:

```
npm start
```

The application will be available at `http://localhost:4000` (or the port you specified in the `.env` file).

## API Endpoints

- `GET /`: Home page
- `GET /login`: Login page
- `POST /login`: Login user
- `GET /register`: Registration page
- `POST /register`: Register new user
- `GET /home`: User home page (authenticated)
- `GET /notes`: Get all notes (authenticated)
- `GET /notes/:id`: Get a specific note (authenticated)
- `GET /create`: Create note page (authenticated)
- `POST /create`: Create a new note (authenticated)
- `GET /notes/:id/edit`: Edit note page (authenticated)
- `POST /notes/:id/edit`: Update a note (authenticated)
- `DELETE /notes/:id`: Delete a note (authenticated)
- `GET /profile/:id`: User profile page (authenticated)
- `POST /profile/:id`: Update user profile (authenticated)
- `GET /logout`: Logout

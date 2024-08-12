# JK Notes

JK Notes is a simple note-taking application built with Node.js, Express, and MongoDB uses local storage.

## Features

- User authentication (register, login, logout)
- Create, read, update, and delete notes (CRUD)

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

Make sure make a `.env` file in the root directory of the project and add the following environment variables:

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
- `GET /create`: Create a note page (authenticated)
- `POST /create`: Create a new note (authenticated)
- `GET /notes/:id/edit`: Edit note page (authenticated)
- `POST /notes/:id/edit`: Update a note (authenticated)
- `DELETE /notes/:id`: Delete a note (authenticated)
- `GET /profile/:id`: User profile page (authenticated)
- `POST /profile/:id`: Update user profile (authenticated)
- `GET /logout`: Logout

## API Documentation

Requests and responses in JSON format.

### Authentication Endpoints

- **POST** `/register`
- **Request Body**:

```json
{
  "name": "John Doe",
  "email": "John@example.com",
  "password": "123456",
  "password2": "123456"
}
```

- **Response**:

```json
{
  "message": "New user john@example.com registered"
}
```

- **POST** `/login`
- **Request Body**:

```json
{
  "email": "John@example.com",
  "password": "123456"
}
```

- **Response**:

```json
{
  "message": "Login successful",
  "email": "John@example.com",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjgyNTg5ZjhlNzk2MzUwN2U3OTEzMCIsImlhdCI6MTcyMzM0NDU3NCwiZXhwIjoxNzIzMzQ4MTc0fQ.ILWcbQXkbQ5uzJKL3LNVhAx90Q4cRkfn20YvPAckJXE"
}
```

### Endpoints

All notes endpoints require authentication. JWT tokens are used for authentication.

```
Authorization: Bearer <accessToken>
```

#### Create a Note

required to un comment json message in noteController.js to see response in json format. Otherwise will be rendered as html

- **POST** `/create`
- **Request Body**

```json
{
  "title": "My First Note",
  "content": "This is content of my first note"
}
```

- **Response**:

```json
{
  "message": "Note successfully created",
  "newNote": {
    "title": "My First Note",
    "content": "This is content of my first note",
    "creator": "66b120a2b551b9f273499c51",
    "_id": "66b946e2c6af7254914782aa",
    "createdAt": "2024-08-11T23:18:58.959Z",
    "updatedAt": "2024-08-11T23:18:58.959Z",
    "__v": 0
  }
}
```

#### Get all Notes

required to un comment json message in noteController.js to see response in json format. Otherwise will be rendered as html

- **GET** `/notes`

```json
{
  "message": "Notes fetched successfully",
  "notes": {
    "_id": "66b946e2c6af7254914782aa",
    "title": "My First Note",
    "content": "This is content of my first note",
    "creator": "66b120a2b551b9f273499c51",
    "createdAt": "2024-08-11T23:18:58.959Z",
    "updatedAt": "2024-08-11T23:18:58.959Z",
    "__v": 0
  }
}
```

#### Get a Note

required to un comment json message in noteController.js to see response in json format. Otherwise will be rendered as html

- **GET** `/notes/:_id`

```json
{
  "message": "Note fetched successfully",
  "note": {
    "_id": "66b946e2c6af7254914782aa",
    "title": "My First Note",
    "content": "This is content of my first note",
    "creator": "66b120a2b551b9f273499c51",
    "createdAt": "2024-08-11T23:18:58.959Z",
    "updatedAt": "2024-08-11T23:18:58.959Z",
    "__v": 0
  }
}
```

#### Edit a note

required to un comment json message in noteController.js to see response in json format. Otherwise will be rendered as html

- **POST** `/notes/:_id/edit`

- **Request Body**:

```json
{
  "title": "My Amended Note",
  "content": "This is amendedcontent of my Amended note"
}
```

- **Response**:

```json
{
  "message": "Note updated successfully",
  "updatedNote": {
    "_id": "66b946e2c6af7254914782aa",
    "title": "My Amended Note",
    "content": "This is amendedcontent of my Amended note",
    "creator": "66b120a2b551b9f273499c51",
    "createdAt": "2024-08-11T23:18:58.959Z",
    "updatedAt": "2024-08-11T23:18:58.959Z",
    "__v": 0
  }
}
```

#### Delete a Note

-**DELETE** `/notes/:_id`

```json
{
  "message": "Note deleted successfully"
}
```

#### Update User Profile

-**POST** `/profile/:_id`

-**Request Body**:

```json
{
  "name": "Jane Doe",
  "email": "Jane@example.com",
  "currentPassword": "123456",
  "newPassword": "654321",
  "confirmNewPassword": "654321"
}
```

-**Response**:

```json
{
  "message": "Profile updated successfully"
}
```

## Details

1. **Authentication**: This app uses JWT for authentication. Tokens are valid for 1hour.
2. **Data Validation**:

- User email must be unique
- Password must be at least 6 characters

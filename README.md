# Express Book Review — IBM Final Project

REST API implementation for the IBM Developing Back-End Apps with Node.js and Express final project.

## Setup

```bash
npm install
npm start
```

Server: http://localhost:5000

## Public endpoints

- `GET /` — all books
- `GET /isbn/:isbn` — book by ISBN
- `GET /author/:author` — books by author
- `GET /title/:title` — books by title
- `GET /review/:isbn` — reviews for a book
- `POST /register` — register a user

## Authenticated endpoints

- `POST /customer/login` — login and receive JWT
- `PUT /customer/auth/review/:isbn` — add/update your review
- `DELETE /customer/auth/review/:isbn` — delete your review

Send `Authorization: Bearer <token>` for protected requests.

## Task 10

`general.js` contains the four required Axios + async/await methods:

- `getAllBooks()`
- `getBooksByISBN(isbn)`
- `getBooksByAuthor(author)`
- `getBooksByTitle(title)`

Example:

```bash
node general.js all
node general.js isbn 1
node general.js author "Jane Austen"
node general.js title "Pride and Prejudice"
```

## Important

The IBM course grader expects your own fork of the course repository. This implementation is intended to be copied into the corresponding `final_project` structure after you fork the official repository. Do not claim a fork URL you do not own.

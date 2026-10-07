# E-Commerce Application

A RESTful E-Commerce API built with Node.js, Express, TypeScript, and MongoDB.

## Technologies

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* bcrypt
* JSON Web Token (JWT)
* Postman

## Project Structure

```text
src/
├── config/
│   └── db.ts
├── model/
│   ├── product.model.ts
│   └── user.model.ts
├── controller/
│   ├── product.controller.ts
│   └── auth.controller.ts
├── router/
│   ├── product.router.ts
│   └── auth.router.ts
├── middleware/
│   └── auth.middleware.ts
└── server.ts
```

## Authentication

Authentication was implemented using bcrypt and JWT.

### Register

Create a new user account:

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "Fabrice",
  "email": "fabrice@example.com",
  "password": "123456"
}
```

The password is hashed using bcrypt before being stored in MongoDB.

### Login

Login with an existing account:

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "fabrice@example.com",
  "password": "123456"
}
```

After successful login, the API returns a JWT token.

### Protected Routes

Product routes are protected using authentication middleware.

Example:

```http
GET /api/products
```

The request must include:

```http
Authorization: Bearer <JWT_TOKEN>
```

The middleware verifies the JWT before allowing access to the protected route.

Without a valid token, the API returns:

```json
{
  "message": "Authentication token is required"
}
```

## Authentication Flow

```text
Register
   ↓
bcrypt.hash()
   ↓
Save user to MongoDB
   ↓
Login
   ↓
bcrypt.compare()
   ↓
Generate JWT
   ↓
Send JWT with requests
   ↓
Authentication Middleware
   ↓
Verify JWT
   ↓
Access Protected Routes
```

## API Endpoints

### Authentication

| Method | Endpoint             | Description           |
| ------ | -------------------- | --------------------- |
| POST   | `/api/auth/register` | Register a user       |
| POST   | `/api/auth/login`    | Login and receive JWT |

### Products

| Method | Endpoint            | Authentication |
| ------ | ------------------- | -------------- |
| GET    | `/api/products`     | Required       |
| GET    | `/api/products/:id` | Required       |
| POST   | `/api/products`     | Required       |
| PUT    | `/api/products/:id` | Required       |
| DELETE | `/api/products/:id` | Required       |

## Environment Variables

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/productdb
JWT_SECRET=your_secret_key
```

Do not commit `.env` to GitHub.

## Testing

The authentication system was tested using Postman:

1. Register a user.
2. Login with the registered email and password.
3. Copy the returned JWT token.
4. Send the token as a Bearer Token.
5. Access the protected product routes.

## Running the Application

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:3000
```

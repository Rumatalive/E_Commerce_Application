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
| POST   | `/api/auth/register` | Create a buyer account |
| POST   | `/api/auth/login`    | Login and receive JWT plus role |
| POST   | `/api/admin/sellers` | Admin creates a seller account |

### Products

| Method | Endpoint            | Authentication |
| ------ | ------------------- | -------------- |
| GET    | `/api/products`     | Public         |
| GET    | `/api/products/:id` | Public         |
| GET    | `/api/seller/products` | Seller         |
| POST   | `/api/products`     | Seller or admin |
| PUT    | `/api/products/:id` | Owner seller or admin |
| DELETE | `/api/products/:id` | Owner seller or admin |

### Admin Dashboard

Open `/admin` in the frontend and sign in with the admin account. The dashboard shows product, user, seller, and order counts, paid revenue, recent orders, tools to add/edit/delete products, and a form to create seller accounts.

Buyers use `/shop`, `/login`, and `/signup`. Public signup always creates a buyer. Sellers sign in at `/login` and are sent to `/seller`, where they only see and manage their own products. Admins create seller accounts from the admin dashboard. Existing database records with the old `user` role are changed to `buyer` at backend startup.

For a local setup, copy `.env.admin.example` to `.env.admin` and set a unique email and password of at least 12 characters. Keep `.env.admin` private; it is ignored by Git. When the server connects to MongoDB, it creates the admin account if that email is not already registered. If the email belongs to a regular account, choose a different email rather than changing that account's role.

Adding a product requires the Cloudinary variables in `.env` because product images are uploaded there. Admin dashboard and seller account creation require an admin account. Seller product changes are restricted to the seller who owns the product.

The dashboard data endpoint is:

```http
GET /api/admin/dashboard
Authorization: Bearer <ADMIN_JWT>
```

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

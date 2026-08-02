# MERN Veterinary E-commerce Website

A full-stack veterinary e-commerce application built with the MERN stack (MongoDB, Express, React, Node) and TypeScript. This project supports product listings (pet supplies, medications), user accounts, shopping cart, orders, and an admin dashboard for managing inventory and orders.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](#)
[![License](https://img.shields.io/badge/license-MIT-blue)](#)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Install](#install)
  - [Environment variables](#environment-variables)
  - [Run (development)](#run-development)
  - [Build (production)](#build-production)
- [API](#api)
- [Database & Migrations](#database--migrations)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## About

This repository contains a veterinary e-commerce web application designed to let users browse and purchase pet products, manage orders, and let admins maintain products and inventory. It is intended as a full-stack example (or a starting point for a production app).

---

## Links
Following is the live URL:
https://magnificent-rabanadas-087581.netlify.app/


---

## Features

- User registration, login, and profile management
- Product listings with categories and search
- Product detail pages with images and reviews
- Shopping cart and checkout
- Order history and order status tracking
- Admin dashboard for product, order, and user management
- Optional: Payment integration (Stripe, PayPal)

---

## Tech Stack

- Frontend: React, TypeScript, Vite or Create React App
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Authentication: JWT (or session-based)
- Styling: Tailwind CSS / CSS Modules
- Payments: Stripe (optional)

---

## Screenshots

### Home / Landing

<img width="2048" height="1200" alt="magnificent-rabanadas-087581 netlify app_(Nest Hub)" src="https://github.com/user-attachments/assets/db36f0c4-32c2-4688-92f9-b882ad4ace46" />


### Product Listing

<img width="2048" height="1200" alt="magnificent-rabanadas-087581 netlify app_(Nest Hub) (1)" src="https://github.com/user-attachments/assets/b363a146-510f-49c8-bd3d-ed3eccd5364d" />


### Product Detail

<img width="2048" height="1200" alt="magnificent-rabanadas-087581 netlify app_(Nest Hub) (2)" src="https://github.com/user-attachments/assets/9c3d851b-47e1-4b2e-a29a-2c1adca79333" />


### Admin Dashboard

<img width="2048" height="1200" alt="magnificent-rabanadas-087581 netlify app_(Nest Hub) (3)" src="https://github.com/user-attachments/assets/29bc7ed0-a0f4-4879-b0ad-30d67936a3ab" />


---

## Getting Started

### Prerequisites

- Node.js >= 16
- npm or yarn
- MongoDB instance (local or remote) or MongoDB Atlas

### Install

Clone the repository:

```bash
git clone https://github.com/Abdullah929-design/MERN-VETERINARY-FULL-STACK-ECOMMERCE-WEBSITE.git
cd MERN-VETERINARY-FULL-STACK-ECOMMERCE-WEBSITE
```

Install dependencies (adjust if client and server are separate folders):

```bash
npm install
# or, for separate folders:
# cd server && npm install
# cd ../client && npm install
```

### Environment variables

Create a `.env` file in the server directory (or root) with values similar to the example below. Do NOT commit real secrets.

```
PORT=4000
MONGO_URI=mongodb://localhost:27017/vet-ecommerce
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
NODE_ENV=development
```

### Run (development)

If client and server are separate, start both; otherwise start the unified dev script.

```bash
# from project root
npm run dev
# or, if separate
# cd server && npm run dev
# cd client && npm run dev
```

Open the frontend at the port shown by your dev server (commonly http://localhost:3000 or http://localhost:5173) and the backend API at http://localhost:4000.

### Build (production)

```bash
# build frontend
cd client && npm run build
# start backend in production
cd ../server && npm start
```

---

## API

Example endpoints — adapt names and routes to your implementation:

- POST /api/auth/register — Register new user
- POST /api/auth/login — Authenticate and receive token
- GET /api/products — List products
- GET /api/products/:id — Get product details
- POST /api/orders — Create order
- GET /api/orders/:id — Get order by id
- GET /api/users/:id/orders — Get user orders
- Admin routes: POST/PUT/DELETE /api/products, GET /api/orders

Consider adding OpenAPI/Swagger or a Postman collection and linking it from this README.

---

## Database & Migrations

- Models to expect: User, Product, Category, Order, Cart, Review
- Use your chosen migration or seeding strategy (e.g., mongoose-seed, TypeORM migrations, or scripts) and keep migration files in a `migrations/` folder.

Example (MongoDB):

```bash
# seed the database (if you have seed scripts)
npm run seed
```

---

## Usage

- Register a user and verify email (if implemented)
- Browse products, add to cart, and checkout
- View order history in profile
- Admins can add/edit/remove products and manage orders

---

## Contributing

Contributions welcome!

1. Fork the repo
2. Create a branch: `git checkout -b feature/awesome-feature`
3. Commit your changes: `git commit -m "feat: ..."`
4. Push to your branch: `git push origin feature/awesome-feature`
5. Open a pull request

Please include tests, run linters, and provide clear PR descriptions.

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

Project maintainer: Abdullah929-design

Open an issue or contact via the GitHub profile for questions or feature requests.

---


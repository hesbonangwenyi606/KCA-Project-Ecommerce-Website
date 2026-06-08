# KCA Project – Dynamic E-Commerce Website

## Overview

The Dynamic E-Commerce Website is a modern web application developed to provide businesses with an online platform for selling products and managing customer orders efficiently. The system allows customers to browse products, search for items, add products to their cart, manage wishlists, and complete purchases through a user-friendly interface.

This project was developed as part of the KCA University Software Engineering coursework to demonstrate practical skills in full-stack web development, user interface design, and database integration.

---

## Features

### Customer Features

* User-friendly and responsive interface
* Browse products by category
* View product details
* Search for products
* Add products to cart
* Update cart quantities
* Manage wishlist
* Checkout process
* Order confirmation page
* Mobile-friendly design

### System Features

* Dynamic product catalog
* Product categorization
* Shopping cart management
* Wishlist management
* Order processing
* State management using React Context API
* Modern UI components using Shadcn/UI
* Responsive layouts for desktop and mobile devices

---

## Technologies Used

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Shadcn/UI
* React Context API

### Development Tools

* Git
* GitHub
* ESLint
* PostCSS

### Backend & Database

* Node.js
* Express.js
* MongoDB
* Mongoose

---

## Project Structure

```text
src/
├── components/
├── contexts/
├── hooks/
├── lib/
├── pages/
├── App.tsx
├── main.tsx
└── index.css

public/
├── robots.txt
└── placeholder.svg
```

### Navigate to the Project

```bash
cd KCA-Project-Ecommerce-Website
```

### Install Dependencies

```bash
npm install
```

### Run the Frontend

```bash
npm run dev
```

### Run the Backend API

```bash
npm run server
```

### Run Both Together

```bash
npm run dev:all
```

### Apply Database Performance Indexes

Run the SQL in [supabase/migrations/001_add_product_performance_indexes.sql](supabase/migrations/001_add_product_performance_indexes.sql) in the Supabase SQL Editor to speed up product, collection, and variant queries.

The application will be available at:

```text
http://localhost:5173
```

---

## Available Scripts

### Start Frontend

```bash
npm run dev
```

### Start Backend

```bash
npm run server
```

### Start Frontend + Backend

```bash
npm run dev:all
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Linting

```bash
npm run lint
```

---

## Learning Outcomes

Through this project, the following concepts were applied:

* React Component Architecture
* TypeScript Development
* State Management
* Responsive Web Design
* E-Commerce System Design
* Git Version Control
* Modern Frontend Development Practices

---

## Future Improvements

* User authentication and authorization
* Admin dashboard
* Product management system
* Payment gateway integration
* Inventory management
* Customer reviews and ratings
* Order tracking
* Email notifications
* Backend API integration
* MongoDB database connectivity

---

## License
This project is developed for educational and learning purposes as part of KCA University coursework.

# IT Helpdesk Management System

A full-stack IT helpdesk platform for submitting, managing, assigning, and resolving technical support tickets.

## Features

- User registration and login
- JWT authentication
- Role-based access control
- Employee ticket creation
- Employee ticket history
- Ticket ownership authorization
- Admin ticket management
- Ticket assignment
- Ticket status workflow
- Ticket resolution
- Ticket comments
- Admin dashboard
- Ticket statistics

## Tech Stack

### Frontend
- Next.js
- React
- Tailwind CSS

### Backend
- Node.js
- Express.js
- JWT
- bcrypt

### Database
- MongoDB
- Mongoose

### Security
- JWT authentication
- Role-based authorization
- bcrypt password hashing
- Helmet
- CORS

## Ticket Lifecycle

open
→ assigned
→ in_progress
→ resolved
→ closed

## Architecture

Next.js
↓
Express REST API
↓
Controllers
↓
Mongoose
↓
MongoDB Atlas

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
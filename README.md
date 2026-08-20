# IT Helpdesk Management System

A full-stack IT Helpdesk Management System that allows employees to raise technical support tickets and admins to manage, assign, and resolve them.

## Live Demo

**Frontend:**  
https://it-helpdesk-frontend-msk-bpakg8ahh3ftc7h9.centralindia-01.azurewebsites.net/

### Demo Credentials

**Employee**

- Email: `myEmployee@test.com`
- Password: `TestPassword123`

**Admin**

- Email: `admin@helpdesk.com`
- Password: `AdminPassword123`

## Features

- User registration and login
- JWT-based authentication
- Role-based access control
- Create support tickets
- Ticket categories and priorities
- Ticket status workflow
- Admin ticket management
- Assign tickets to admins
- Resolve and close tickets
- Ticket comments
- Ticket statistics dashboard
- File attachments
- Azure Blob Storage for attachments
- Secure attachment downloads

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS

### Backend

- Node.js
- Express.js
- REST API
- JWT
- bcrypt
- Multer

### Database

- MongoDB
- Mongoose
- MongoDB Atlas

### Cloud & Deployment

- Microsoft Azure
- Azure App Service
- Azure Blob Storage
- GitHub Actions

### Security

- JWT Authentication
- Role-Based Authorization
- bcrypt Password Hashing
- Helmet
- CORS

## Project Structure

```text

it-helpdesk/
│
├── .github/
│   └── workflows/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── server.js
│   │   └── testModels.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── tickets/
│   │   │   ├── globals.css
│   │   │   ├── layout.js
│   │   │   └── page.js
│   │   │
│   │   ├── components/
│   │   └── lib/
│   │
│   ├── public/
│   ├── .env.example
│   ├── AGENTS.md
│   ├── next.config.ts
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Architecture

      Next.js Frontend
            ↓
      Express.js REST API
            ↓
        Controllers
            ↓
        Mongoose
            ↓
      MongoDB Atlas

## Ticket Workflow

    Open -> Assigned -> In Progress -> Resolved -> Closed

## Azure Blob Storage

Ticket attachments are stored in Azure Blob Storage instead of the application server.

The database stores only the attachment metadata such as:

Original file name
Blob name
File type
File size

This keeps file storage separate from application data.

## Local Setup

1. Clone the repository
   git clone <repository-url>
   cd it-helpdesk
2. Backend
   cd backend
   npm install
   npm run dev
3. Frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

The frontend runs on: http://localhost:3000

The backend runs on: http://localhost:5000

## Environment Variables

### Backend

Create:

backend/.env

Add the required MongoDB, JWT, and Azure Blob Storage environment variables.

Example:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

AZURE_STORAGE_CONNECTION_STRING=your_azure_storage_connection_string

AZURE_STORAGE_CONTAINER_NAME=your_container_name

### Frontend

Create:

frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api

## Deployment

The application is deployed using Microsoft Azure.

GitHub -> GitHub Actions -> Azure App Service

The frontend and backend are deployed separately.

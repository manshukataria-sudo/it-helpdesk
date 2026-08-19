# IT Helpdesk Management System

A full-stack IT Helpdesk Management System for submitting, managing, assigning, tracking, and resolving technical support tickets.

The application provides separate employee and administrator workflows with JWT-based authentication, role-based authorization, ticket management, and a production deployment using Microsoft Azure and MongoDB Atlas.

## Live Demo

**Frontend:**  
https://it-helpdesk-frontend-msk-bpakg8ahh3ftc7h9.centralindia-01.azurewebsites.net/

## Features

### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control
- Protected routes
- Password hashing using bcrypt
- Ticket ownership authorization

### Employee Features
- Create support tickets
- View submitted tickets
- View ticket history
- Track ticket status
- View ticket details
- Add comments to tickets

### Admin Features
- Admin dashboard
- View all support tickets
- Assign tickets
- Manage ticket status
- Resolve tickets
- Close tickets
- Add comments
- View ticket statistics

### Ticket Management
Tickets follow a structured lifecycle:

```text
Open
  ↓
Assigned
  ↓
In Progress
  ↓
Resolved
  ↓
Closed
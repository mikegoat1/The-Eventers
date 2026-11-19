# Event Management System

## Overview
The Event Management System is a platform designed to simplify the organization and management of events. It enables users to create events, RSVP, set reminders, and post messages on each event's discussion board, with analytics for organizers. This repository contains the codebase and documentation for the project.

---

## Tech Stack

### Backend
- **Technologies**: Next.js API routes (Node.js), MongoDB with Mongoose, JWT, bcrypt, express-validator
- **Features**: Authentication, event management, RSVPs, reminders, event messages, search, analytics

### Frontend
- **Technologies**: React, Material UI, FullCalendar, Formik, Yup
- **Features**: User-friendly UI for event creation, RSVPs, reminders, and analytics

### Deployment
- Runs as a single Next.js app (frontend and API together); a `.vercelignore` is included for Vercel deploys.

### Testing
- **Framework**: Jest, with tests for auth, events, RSVPs, reminders and messages in `event_management_system/__tests__`

---

## Features
1. **User Authentication and Profile Management**  
   Secure login and profile customization using JWT.

2. **Event Creation and Management**  
   Tools for users to organize events, manage details, and update attendees.

3. **RSVP System**  
   Attendee lists and confirmations for efficient event tracking.

4. **Event Calendar and Reminders**  
   Visual schedule of events, plus reminders users can set and dismiss.

5. **Event Search and Categorization**  
   Filter and find events by categories and keywords.

6. **Event Messages**  
   A message board on each event for attendees, served through REST endpoints.

7. **Event Analytics and Reporting**  
   Insights into attendance, engagement, and other key metrics.

---

## How to Run

### Requirements
- Node.js 18.17 or later
- A MongoDB database (local or Atlas)

### Setup
1. Clone the repository and open the app folder:
   ```bash
   git clone https://github.com/mikegoat1/The-Eventers.git
   cd The-Eventers/event_management_system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your environment file from the example, then set `MONGODB_URI` and a long random `JWT_SECRET`:
   ```bash
   cp .env.example .env
   ```
4. Optionally load sample data:
   ```bash
   npm run seed:users
   npm run seed:events
   ```
5. Start the dev server at http://localhost:3000:
   ```bash
   npm run dev
   ```

### Tests and linting
```bash
npm test
npm run lint
```

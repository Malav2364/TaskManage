# Taskoo - Task Management Application

Welcome to Taskoo, a task management application designed to help you manage your tasks efficiently. This project uses PostgreSQL with Prisma and Redis for a robust and scalable backend. The application is hosted on Vercel and can be accessed at [taskoo.vercel.app](https://taskoo.vercel.app).

## Overview

Taskoo is a simple yet powerful task management application that allows users to create, update, and manage their tasks. It is built using modern web technologies, providing a seamless user experience.

## Features

- **User Authentication**: Secure login and registration system using NextAuth.
- **Task Management**: Create, edit, delete, and mark tasks as complete or pending.
- **Real-time Updates**: Instant updates with Redis for real-time task management.
- **Responsive Design**: Mobile-friendly design for managing tasks on the go.

## Technologies Used

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Node.js, Express, PostgreSQL, Prisma
- **Real-time**: Redis
- **Authentication**: NextAuth
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14.x or later)
- PostgreSQL
- Redis

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Malav2364/taskoo.git
   cd taskoo
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory and add the following variables:

   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/taskoo
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret
   REDIS_URL=redis://localhost:6379
   ```

4. **Set up the database:**

   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

   The application will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. **Sign Up / Login:**

   Users can sign up or log in using their email and password.

2. **Manage Tasks:**

   - Create new tasks.
   - Edit existing tasks.
   - Delete tasks.
   - Mark tasks as complete or pending.

3. **Real-time Updates:**

   Task updates are instantly reflected across all connected clients.

## Deployment

Taskoo is deployed on Vercel. You can access the live application at [taskoo.vercel.app](https://taskoo.vercel.app).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

## Contact

For any questions or feedback, please contact [Malav2364](https://github.com/Malav2364).

# Project1 - Next.js Social Media App

A modern social media application built with Next.js 15, featuring user authentication, posts, and comments functionality.

## Features

- **Authentication**: Login with Google OAuth or email/password
- **Posts Management**: Create, read, update, and delete posts with image uploads
- **Comments System**: Add comments to posts
- **Responsive Design**: Built with Tailwind CSS and Radix UI
- **Dark/Light Theme**: Theme switching support
- **Real-time UI**: Interactive components with animations

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS v4, Radix UI components
- **Forms**: React Hook Form with Zod validation
- **Animations**: Motion library, Magic UI components
- **File Upload**: Image upload functionality

## Installation

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google OAuth credentials (optional)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/project1_db"
   
   # NextAuth
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # App URL
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Optional: Open Prisma Studio
   npx prisma studio
   ```

5. **Run the application**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   ├── (main)/          # Main application pages
│   └── api/             # API routes
├── components/          # Reusable components
├── lib/                 # Utility functions
├── prisma/              # Database schema and migrations
└── types/               # TypeScript type definitions
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Key Features

### Authentication
- Google OAuth integration
- Email/password registration and login
- Protected routes and middleware

### Posts
- Create posts with title, content, and images
- Edit and delete own posts
- Image upload functionality
- Responsive post cards

### Comments
- Add comments to posts
- Real-time comment display
- User attribution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is for educational purposes.

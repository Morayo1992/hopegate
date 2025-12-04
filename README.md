# Hope Bridge - Poverty Alleviation Crowdfunding Platform

A transparent, full-stack crowdfunding application for verified NGOs and individuals to fund poverty-related projects. Built as a final project for AI/Software Engineering coursework.

## Project Overview

**Hope Bridge** connects donors with verified poverty alleviation projects through a secure, transparent platform. The application features role-based access control, real-time project tracking, and a comprehensive admin approval workflow.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **Lucide React** for icons

### Backend & Database
- **Supabase** for:
  - PostgreSQL database
  - Authentication (Email/Password)
  - Row Level Security (RLS)
  - Real-time subscriptions

### Architecture
- Component-based architecture with clear separation of concerns
- Context API for authentication state management
- Type-safe database schema with TypeScript
- RESTful patterns with Supabase client

## Key Features

### User Roles
1. **Donor** - Browse and donate to projects
2. **Project Creator** - Create and manage crowdfunding projects
3. **Admin** - Review and approve projects, manage platform

### Core Functionality

#### Authentication
- Secure email/password signup and login
- Role-based access control
- Protected routes and components
- User profile management

#### Project Management
- Create, edit, and submit projects for review
- Draft and publish workflow
- Rich project details with images
- Category-based organization
- Location and date tracking
- Progress tracking with raised amounts

#### Donation System
- Simulated payment processing (Stripe integration ready)
- Anonymous donation option
- Donation history tracking
- Real-time project funding updates
- Custom and preset donation amounts

#### Admin Panel
- Project approval/rejection workflow
- Pending review queue
- Overview of all platform projects
- User verification management

#### Search & Discovery
- Keyword search across projects
- Category filtering
- Status-based filtering
- Responsive grid/card layout

## Database Schema

### Tables
- **profiles** - Extended user information with roles and verification status
- **projects** - Crowdfunding project data with goals, status, and progress
- **donations** - Transaction records with donor and project relationships
- **categories** - Project categorization (Education, Healthcare, etc.)
- **project_updates** - Creator updates and progress reports
- **comments** - Community engagement on projects

### Security
- Row Level Security (RLS) enabled on all tables
- Role-based policies for data access
- Authenticated operations with ownership validation
- Public read access for active projects only

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm
- A Supabase account and project

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project dashboard under Settings > API.

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Database Setup

The database migration has already been applied. If you need to review or modify the schema, check the migration file created during development. The migration includes:

- All table definitions with proper constraints
- Row Level Security policies
- Database triggers for automatic updates
- Initial category data

### Creating Test Users

#### Admin User
1. Sign up through the application
2. Manually update the user's role in Supabase Dashboard:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'user_id';
   ```

#### Project Creator
1. Sign up and select "Create Projects" during registration
2. User automatically gets `project_creator` role

#### Donor
1. Sign up and select "Support Projects" during registration
2. User automatically gets `donor` role

## Usage Guide

### For Donors
1. **Sign Up** - Create an account as a donor
2. **Explore Projects** - Browse active crowdfunding projects
3. **View Details** - Click any project to see full information
4. **Donate** - Support projects with one-time donations
5. **Track Impact** - View donation history in your dashboard

### For Project Creators
1. **Sign Up** - Create an account as a project creator
2. **Create Project** - Fill out the project creation form
3. **Submit for Review** - Submit your project to admins
4. **Manage Projects** - Edit drafts and track project performance
5. **Post Updates** - Keep donors informed of progress

### For Admins
1. **Access Admin Panel** - Navigate to the admin section
2. **Review Projects** - View pending projects awaiting approval
3. **Approve/Reject** - Make decisions on project submissions
4. **Monitor Platform** - Overview of all projects and activity

## API Endpoints (Supabase)

### Projects
- `GET /projects` - List all projects (filtered by status via RLS)
- `POST /projects` - Create new project (project creators only)
- `PATCH /projects/:id` - Update project (creator or admin)
- `DELETE /projects/:id` - Delete project (admin only)

### Donations
- `GET /donations` - List user's donations
- `POST /donations` - Create new donation

### Categories
- `GET /categories` - List all categories

## Future Enhancements

This is a foundation for further development. Potential additions include:

### Technical
- [ ] Actual Stripe payment integration
- [ ] Email notifications for project updates
- [ ] Image upload functionality (Supabase Storage)
- [ ] Real-time project updates with Supabase Realtime
- [ ] Advanced search with full-text search
- [ ] Export donation receipts as PDF

### Features
- [ ] Project recommendation algorithm
- [ ] Social sharing integration
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Recurring donation subscriptions
- [ ] Project milestones and goal tracking
- [ ] Donor recognition badges and levels

### AI Features
- [ ] Project risk assessment scoring
- [ ] Fraud detection algorithms
- [ ] Personalized project recommendations
- [ ] Automated content moderation
- [ ] Sentiment analysis on project updates
- [ ] Predictive funding success analytics

## Project Structure

```
src/
├── components/
│   ├── Auth/              # Authentication components
│   │   ├── SignIn.tsx
│   │   └── SignUp.tsx
│   ├── Layout/            # Layout components
│   │   └── Header.tsx
│   ├── Home/              # Landing page
│   │   └── Hero.tsx
│   ├── Projects/          # Project-related components
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectList.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── CreateProject.tsx
│   ├── Dashboard/         # User dashboard
│   │   └── Dashboard.tsx
│   ├── Admin/             # Admin panel
│   │   └── AdminPanel.tsx
│   └── Donation/          # Donation flow
│       └── DonationModal.tsx
├── contexts/
│   └── AuthContext.tsx    # Authentication state management
├── lib/
│   ├── supabase.ts        # Supabase client configuration
│   └── database.types.ts  # TypeScript types for database
├── App.tsx                # Main application component
└── main.tsx               # Application entry point
```

## Security Considerations

- All sensitive operations require authentication
- Row Level Security prevents unauthorized data access
- User roles strictly enforced at database level
- Input validation on all forms
- XSS protection through React's built-in escaping
- CSRF protection through Supabase authentication
- No secrets exposed in frontend code

## Testing

### Manual Testing Checklist
- [ ] User registration (both roles)
- [ ] Login/logout functionality
- [ ] Project creation and editing
- [ ] Project submission for review
- [ ] Admin approval workflow
- [ ] Donation flow
- [ ] Search and filtering
- [ ] Dashboard statistics
- [ ] Responsive design on mobile

### Automated Testing (To Be Implemented)
This project is structured to easily add:
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

## License

This project is for educational purposes as a final project submission.

## Credits

- Built with [Vite](https://vitejs.dev/)
- Powered by [Supabase](https://supabase.com/)
- Icons by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

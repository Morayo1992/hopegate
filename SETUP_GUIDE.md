# Quick Setup Guide for Hope Bridge

This guide will help you get Hope Bridge running locally in under 5 minutes.

## Step 1: Get Supabase Credentials

The project is already connected to a Supabase database. The environment variables should already be set up for you.

If you need to connect to a different Supabase project:

1. Go to [supabase.com](https://supabase.com) and sign in
2. Navigate to your project dashboard
3. Click on Settings (gear icon) > API
4. Copy your Project URL and anon/public key
5. Create a `.env` file and add:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start Development Server

The development server starts automatically - you don't need to run anything!

## Step 4: Create Your First User

1. Navigate to the signup page
2. Create an account with either role:
   - **Donor** - To browse and donate to projects
   - **Project Creator** - To create and manage projects

## Step 5: Create an Admin User (Optional)

To access the admin panel:

1. Sign up with any account
2. Go to your Supabase Dashboard > Table Editor > profiles
3. Find your user and change the `role` column to `admin`
4. Refresh the app and you'll see "Admin Panel" in the navigation

## Testing the Platform

### As a Project Creator:
1. Click "Create Project" in the header
2. Fill out the project form
3. Submit for review
4. View your projects in the Dashboard

### As an Admin:
1. Go to Admin Panel
2. See pending projects
3. Approve or reject projects
4. Approved projects appear on the homepage

### As a Donor:
1. Browse projects on the homepage
2. Click any project to view details
3. Click "Support This Project"
4. Enter a donation amount (simulated payment)
5. View your donation history in Dashboard

## Common Issues

### "Missing Supabase environment variables"
- Make sure your `.env` file exists and has the correct variables
- Restart the dev server after adding environment variables

### "Authentication error"
- Check that your Supabase project is active
- Verify your API keys are correct

### Database tables not found
- The migration should have been applied automatically
- If tables are missing, check the Supabase Dashboard > SQL Editor

## Next Steps

Now that you have the platform running, you can:

1. **Customize the design** - Modify Tailwind classes in components
2. **Add features** - Extend the existing architecture
3. **Integrate Stripe** - Add real payment processing
4. **Deploy** - Use Vercel, Netlify, or similar platforms

## Need Help?

Check the main README.md for:
- Detailed architecture documentation
- Database schema information
- API endpoints
- Security considerations
- Future enhancement ideas

## Development Tips

- All components are in `src/components/`
- Database types are in `src/lib/database.types.ts`
- Authentication logic is in `src/contexts/AuthContext.tsx`
- The build output goes to the `dist/` folder

Happy coding!

# unusual-directory




A modern, AI-powered Next.js directory template for creating beautiful resource collections and bookmarks. Perfect for creating your own curated list of resources, bookmarks, or link directories.

## Overview

Built with modern web technologies and designed with a focus on user experience, this template provides everything you need to create a professional resource directory:

- **Resource Management**: Organize and share bookmarks with rich metadata
- **AI Integration**: Automatic content generation and smart categorization
- **Newsletter**: Built-in email subscription with Loops integration
- **Beautiful UI**: Responsive design with dark/light mode support
- **Admin Dashboard**: Powerful tools for content management

## Tech Stack

- **Framework**: Next.js 14+ with App Router and Server Actions
- **Database**: Turso (SQLite) with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui components
- **AI**: Anthropic Claude for content generation
- **Search**: Exa for semantic search capabilities
- **Analytics**: Built-in Vercel Analytics

## Features

### For Users

- **Smart Search**: Search across titles, descriptions, categories, and tags
- **Category Filtering**: Browse resources by custom categories
- **Tag System**: Filter and organize bookmarks with custom tags
- **Status Indicators**: See favorite and archived bookmarks
- **Responsive Design**: Works beautifully on all devices
- **Theme Support**: Automatic dark/light mode
- **Newsletter**: Subscribe for weekly resource updates

### For Admins

- **Secure Admin Panel**: Password-protected admin interface
- **Rich Content Editor**: Full-featured bookmark management with organized form fields
- **Tag Management**: Add and manage tags for better organization
- **Status Management**: Mark bookmarks as favorite or archived
- **AI Assistance**: Automatic metadata extraction and content generation
- **Dashboard**: View statistics and manage content
- **Category Management**: Create and organize categories

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/theNahar/unusual-directory.git
cd unusual-directory
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:

```bash
cp .env.example .env
```

### Database Configuration

- `TURSO_DATABASE_URL`: Your Turso SQLite database URL
- `TURSO_AUTH_TOKEN`: Authentication token for Turso database access

### Authentication

- `BOHO_PASSWORD`: Password for accessing the `/admin` routes
  - Must be at least 8 characters
  - Used for admin dashboard authentication
- `BOHO_SECRET`: Secret key for JWT token signing
  - Used for secure session management

### AI Features

- `ANTHROPIC_API_KEY`: Anthropic API key for AI features
  - Required for content generation
  - Get one at [Anthropic Console](https://console.anthropic.com)
- `EXASEARCH_API_KEY`: Exa API key for enhanced search capabilities
  - Powers the semantic search feature
  - Get one at [Exa](https://exa.ai)

### Email Features

- `LOOPS_API_KEY`: API key for email subscription functionality
  - Required for newsletter features
  - Get one at [Loops](https://loops.so)

### Site Configuration

- `NEXT_PUBLIC_SITE_URL`: Your site's public URL
  - Format: `https://yourdomain.com`
  - Used for generating OpenGraph images and links

4. Initialize the database:

```bash
pnpm db:generate   # Generate migrations
pnpm db:migrate    # Run migrations
pnpm db:seed      # Seed initial data (optional)
```

5. Start the development server:

```bash
pnpm dev
```

## Admin Dashboard

The admin dashboard at `/admin` provides a powerful interface for managing your directory:

### Managing Bookmarks

1. **Add Single Bookmark**

   - **Name**: Enter the bookmark name (required)
   - **Description**: Brief description of the bookmark
   - **Category**: Select from existing categories or create new ones
   - **Tags**: Add comma-separated tags for better organization
   - **Overview**: Detailed overview or notes about the bookmark
   - **Favicon**: Custom favicon URL for the bookmark
   - **OG Image**: Custom Open Graph image URL
   - **URL**: Website URL with AI-powered metadata extraction
   - **Status**: Mark as favorite or archived

2. **Bulk Import**

   - Paste multiple URLs for batch processing
   - Automatic metadata extraction for all entries
   - Review and edit before final import

3. **Edit Bookmarks**
   - Update all metadata fields including tags and status
   - Regenerate AI content
   - Manage bookmark status (favorite/archived)
   - View analytics and engagement

### Managing Categories

- Create custom categories with colors and icons
- Organize bookmarks into categories
- Edit category metadata
- View category statistics

### Managing Tags

- Add comma-separated tags to bookmarks
- Tags are displayed as badges on bookmark cards and detail pages
- Use tags for better organization and filtering
- Tags support free-form text input

### API Integration

The admin interface uses Next.js Server Actions for:

- Real-time updates
- Optimistic UI
- Error handling
- Progress tracking

## Customization

Edit `directory.config.ts` to customize your site:

```typescript
export const directory = {
  baseUrl: "https://your-domain.com",
  name: "Your Directory Name",
  title: "Your Site Title",
  description: "Your site description",
};
```

## Deployment

### 🚀 Deploy to Vercel (Recommended)

#### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/theNahar/unusual-directory)

#### Option 2: Manual Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your repository
   - Configure environment variables

3. **Set Environment Variables in Vercel**
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add all variables from your `.env` file:
     - `TURSO_DATABASE_URL`
     - `TURSO_AUTH_TOKEN`
     - `BOHO_PASSWORD`
     - `BOHO_SECRET`
     - `ANTHROPIC_API_KEY`
     - `EXASEARCH_API_KEY`
     - `LOOPS_API_KEY`
     - `NEXT_PUBLIC_SITE_URL`

4. **Deploy**
   - Vercel will automatically build and deploy your app
   - Your app will be available at `your-app-name.vercel.app`

### 🌐 Custom Domain Setup

#### Free Subdomain
- Your app will be available at: `your-app-name.vercel.app`
- Update `NEXT_PUBLIC_SITE_URL` in Vercel environment variables

#### Custom Domain (Optional)
1. **Purchase a domain** (Namecheap, GoDaddy, etc.)
2. **Add domain in Vercel**:
   - Go to project settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions
3. **Update environment variables**:
   - Set `NEXT_PUBLIC_SITE_URL` to your custom domain

### 🔧 Post-Deployment

1. **Run Database Migrations**
   ```bash
   # In Vercel dashboard or via CLI
   vercel env pull .env.local
   npm run db:migrate
   ```

2. **Verify Setup**
   - Visit your deployed URL
   - Test admin login at `/admin`
   - Add some test bookmarks
   - Verify all features work

### 📊 Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Function Logs**: View serverless function execution
- **Database**: Monitor Turso database usage

The project is optimized for Vercel deployment with:

- Edge runtime support
- Automatic SQLite database setup
- Built-in analytics
- Zero-config deployment
- Serverless functions optimization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Some areas we'd love help with:

- Additional bookmark import sources
- Enhanced AI features
- New UI components
- Documentation improvements

## License

MIT License - feel free to use this template for your own projects!

## Support

For support:

- Open an issue in the [GitHub repository](https://github.com/theNahar/unusual-directory)
- Check out the documentation
- Join our community

## Created by

Built with ❤️ for the open source community, forked from [9d8](https://github.com/9d8dev/directory).
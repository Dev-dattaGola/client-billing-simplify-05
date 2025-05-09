
# LYZ Law Firm Application

## Project info

**URL**: https://lovable.dev/projects/bb979997-2954-4f76-8692-75a0568158b2

## Project Structure

This project is organized with frontend and backend code clearly separated:

- `/src/frontend` - Contains all frontend React components and logic
- `/src/backend` - Contains all backend server code, routes, and controllers

## Getting Started

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development servers (frontend and backend concurrently)
npm run dev
```

## Development Scripts

```sh
# Run frontend development server only
npm run dev:frontend

# Run backend development server only
npm run dev:backend

# Run both frontend and backend in development mode
npm run dev

# Build the frontend for production
npm run build

# Start the production server (serves built frontend)
npm run start
```

## Technologies

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Express.js
- MongoDB

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Custom Domain Setup

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

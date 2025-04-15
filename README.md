
# Medical Equipment Sharing Platform

A comprehensive platform for hospitals, manufacturers, and investors to manage medical equipment leasing, financing, and tracking.

## Features

- **Role-based Access Control**: Different dashboards and functionality for hospitals, manufacturers, investors, and administrators
- **Equipment Management**: Track inventory, status, and availability
- **Leasing System**: Manage equipment leases between hospitals and manufacturers
- **Financing Options**: Investors can provide financing for equipment purchases
- **IoT Integration**: Track equipment usage and maintenance with IoT devices
- **User Authentication**: Secure email-based authentication with role assignment

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Deployment

### Build for Production

```
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations located in `supabase/migrations/`
3. Set up authentication providers in the Supabase dashboard
4. For development, you may want to disable email confirmation in settings

## Architecture

- **Frontend**: React with TypeScript
- **UI Components**: Shadcn UI library
- **State Management**: React Context API and TanStack Query
- **Styling**: Tailwind CSS
- **Backend**: Supabase for authentication, database, and storage
- **Routing**: React Router v6

## User Roles

- **Hospital**: Browse equipment, manage inventory, lease equipment
- **Manufacturer**: List equipment, track usage, manage maintenance
- **Investor**: Provide financing, track investments
- **Admin**: Manage users, view all data, system configuration

## License

This project is licensed under the MIT License - see the LICENSE file for details.

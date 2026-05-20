# Travel Planner Frontend

A modern, professional React-based frontend for the Travel Planner API. Built with React 19, Vite, Tailwind CSS, and Axios.

## 🎯 Features

- ✅ **User Authentication** - Register, Login, JWT-based auth
- ✅ **Trip Management** - Create, Read, Update, Delete trips
- ✅ **Activity Management** - Add activities to trips with types and costs
- ✅ **Budget Tracking** - Visual budget tracker showing planned vs actual spending
- ✅ **Responsive Design** - Professional black & yellow theme with Tailwind CSS
- ✅ **Protected Routes** - Secure pages requiring authentication
- ✅ **Status Filtering** - Filter trips by status (Planned, Ongoing, Completed)

## 🛠️ Tech Stack

- **React 19.2** - Latest React with hooks
- **Vite 8.0** - Fast build tool and dev server
- **React Router 7.15** - Client-side routing
- **Axios 1.16** - HTTP client with interceptors
- **Tailwind CSS 4.3** - Utility-first CSS framework
- **date-fns 4.1** - Modern date utility library

## 📦 Installation

### Prerequisites

- Node.js 20+ and npm
- Backend API running on http://localhost:8080

### Setup

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

The app will be available at \`http://localhost:5173\`

## 🚀 Usage

### 1. Register a New Account
- Navigate to \`/register\`
- Fill in username, email, and password
- Token is automatically saved on successful registration

### 2. Login
- Go to \`/login\`
- Enter email and password
- Redirects to dashboard on success

### 3. Dashboard
- View trip statistics (Total, Planned, Ongoing, Completed)
- Quick access to create trip or view all trips

### 4. Manage Trips
- **Create Trip** - Click "Create New Trip" button
- **View Trip** - Click on any trip card to see details and budget tracker
- **Edit Trip** - Click "Edit" button on trip card
- **Delete Trip** - Click "✕" button (confirms before deleting)

### 5. Manage Activities
- **Add Activity** - On trip detail page, click "+ Add Activity"
- **Edit Activity** - Click "Edit" on activity card
- **Delete Activity** - Click "Delete" on activity card

### 6. Budget Tracking
- Automatically calculated on trip detail page
- Visual progress bar with color coding:
  - 🟢 Green: < 80% spent
  - 🟡 Yellow: 80-100% spent
  - 🔴 Red: Over budget

## 📁 Project Structure

\`\`\`
src/
├── api/
│   └── apiService.js       # Axios instance, API endpoints
├── components/
│   ├── Navbar.jsx          # Navigation bar with auth state
│   └── ProtectedRoute.jsx  # Route wrapper for auth
├── context/
│   └── AuthContext.jsx     # Authentication context & provider
├── pages/
│   ├── Login.jsx           # Login page
│   ├── Register.jsx        # Registration page
│   ├── Dashboard.jsx       # Main dashboard with stats
│   ├── TripList.jsx        # All trips with filtering
│   ├── TripDetail.jsx      # Single trip view with budget tracker
│   ├── TripForm.jsx        # Create/Edit trip form
│   └── ActivityForm.jsx    # Create/Edit activity form
├── App.jsx                 # Main app with routing
└── main.jsx                # Entry point
\`\`\`

## 🔧 Configuration

### Environment Variables

Create/edit \`.env\` file:

\`\`\`env
VITE_API_BASE_URL=http://localhost:8080
\`\`\`

## 🎨 Theme

Professional design with:
- **Background**: Black (#000000)
- **Cards**: Zinc-900 (#18181b)
- **Primary**: Yellow-600 (#ca8a04)
- **Status Colors**: Planned (Yellow), Ongoing (Green), Completed (Gray)

## 🔐 Security

- JWT tokens stored in localStorage
- Automatic token injection via Axios interceptors
- Protected routes redirect to login if not authenticated

## 📝 License

Educational project for Computer Science course 2025/2026

## 👤 Author

**Nurbek** - Student, Computer Science

---

Built with ❤️ using React + Vite + Tailwind CSS

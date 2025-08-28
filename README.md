# Proxoma Admin Dashboard

A modern, feature-rich admin dashboard for the Proxoma platform built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Enhanced Dashboard Overview
- **Real-time Statistics**: Live updates of user counts, financial metrics, and system status
- **Performance Metrics**: User growth, revenue tracking, conversion rates, and churn analysis
- **Quick Actions**: Direct navigation to key management functions
- **System Status**: Real-time monitoring of database, API services, and background jobs
- **System Alerts**: Important notifications and maintenance schedules
- **Recent Activity Feed**: Live activity stream with categorized events

### Financial Management
- **Advanced Filtering**: Multi-criteria filtering for deposits and withdrawals
- **Quick Filters**: Predefined filter sets for common scenarios
- **Wallet Address Management**: 
  - One-click copy wallet addresses to clipboard
  - Direct links to blockchain explorers
  - Visual feedback for copy actions
- **Bulk Operations**: Approve/reject multiple transactions
- **Real-time Updates**: Live status changes and notifications
- **Export Functionality**: Download filtered data in various formats

### Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme switching capability
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Accessibility**: WCAG compliant with keyboard navigation
- **Loading States**: Skeleton loaders and progress indicators

### Enhanced Navigation
- **Collapsible Sidebar**: Space-efficient navigation with tooltips
- **Breadcrumb Navigation**: Clear path indication
- **Search Functionality**: Global search across users and transactions
- **Notification Center**: Real-time alerts with detailed previews

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Lucide React Icons
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd temp-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Build for production**
   ```bash
   npm run build
   # or
   yarn build
   # or
   pnpm build
   ```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── DataTable.tsx
│   │   ├── StatCard.tsx
│   │   ├── WalletAddress.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   └── layout/           # Layout components
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── ...
├── pages/                # Page components
│   ├── Dashboard.tsx
│   ├── FinancialManagement.tsx
│   ├── UserManagement.tsx
│   └── ...
├── context/              # React Context providers
│   ├── AuthContext.tsx
│   └── ...
├── services/             # API services
│   └── apiService.ts
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🎯 Key Components

### WalletAddress Component
A specialized component for displaying cryptocurrency wallet addresses with:
- Copy to clipboard functionality
- Blockchain explorer integration
- Visual feedback for user actions
- Responsive design

```tsx
import WalletAddress from '../components/common/WalletAddress';

<WalletAddress 
  address="0x1234567890abcdef..."
  showExplorer={true}
  maxLength={15}
/>
```

### Enhanced DataTable
Advanced data table with:
- Sorting and filtering
- Pagination
- Custom cell renderers
- Action buttons
- Loading states

### StatCard Component
Reusable statistics cards with:
- Trend indicators
- Icon support
- Color-coded changes
- Hover effects

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=Proxoma Admin
VITE_APP_VERSION=1.0.0
```

### API Configuration
Update the API service configuration in `src/services/apiService.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
```

## 🎨 Customization

### Theme Colors
Modify the color scheme in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          // ... more shades
        }
      }
    }
  }
}
```

### Component Styling
All components use Tailwind CSS classes and can be easily customized by modifying the className props.

## 📱 Responsive Design

The dashboard is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security Features

- **Authentication**: JWT-based authentication
- **Route Protection**: Protected routes with role-based access
- **Input Validation**: Client-side and server-side validation
- **XSS Protection**: Sanitized user inputs
- **CSRF Protection**: Token-based CSRF protection

## 🚀 Performance Optimizations

- **Code Splitting**: Lazy-loaded components
- **Memoization**: React.memo for expensive components
- **Bundle Optimization**: Tree shaking and minification
- **Image Optimization**: WebP format support
- **Caching**: Browser and API response caching

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📊 Analytics Integration

The dashboard includes analytics tracking for:
- User interactions
- Page views
- Error tracking
- Performance metrics

## 🔄 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t proxoma-admin .

# Run container
docker run -p 3000:3000 proxoma-admin
```

### Static Hosting
```bash
# Build for production
npm run build

# Deploy to any static hosting service
# (Netlify, Vercel, AWS S3, etc.)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0 (Latest)
- ✨ Enhanced dashboard with real-time metrics
- ✨ Wallet address copy functionality
- ✨ Improved UI/UX with modern design
- ✨ Advanced filtering and search
- ✨ Responsive design improvements
- ✨ Performance optimizations
- 🐛 Bug fixes and stability improvements

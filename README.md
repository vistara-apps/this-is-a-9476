# CreatorFlow

**Track, Understand, and Grow Your Creator Earnings**

CreatorFlow is a comprehensive web application that helps content creators aggregate income from various platforms, gain insights into performance, and receive personalized learning recommendations to optimize their earnings.

## 🚀 Features

### Core Features

- **Revenue Aggregation Dashboard**: Unified dashboard displaying total earnings across all connected platforms (YouTube, Patreon, Ko-fi, brand deals) in real-time
- **Platform Performance Insights**: Analytics and visualizations showing which content or platform generates the most revenue
- **Personalized Learning Pathways**: AI-powered curated articles, guides, and tips tailored to earnings data and growth opportunities

### Additional Features

- **Multi-Platform Integration**: Connect YouTube, Patreon, Ko-fi, Twitch, Twitter, and Instagram
- **Real-time Earnings Tracking**: Automatic synchronization of earnings data
- **Advanced Analytics**: Detailed insights into revenue trends and performance metrics
- **Goal Setting & Tracking**: Set and monitor earnings goals
- **Subscription Management**: Tiered pricing with basic and advanced features
- **AI-Powered Recommendations**: Personalized learning content based on performance data

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icon library
- **React Query** - Data fetching and caching
- **React Hook Form** - Form handling
- **Framer Motion** - Animation library

### Backend & Services
- **Supabase** - Backend as a Service (database, auth, storage)
- **Stripe** - Payment processing and subscription management
- **OpenAI/Anthropic** - AI-powered content recommendations

### Platform Integrations
- YouTube Analytics API
- Patreon API
- Ko-fi Webhooks
- Twitch API
- Twitter API
- Instagram Basic Display API

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project
- Stripe account (for payments)
- OpenAI or Anthropic API key (for AI features)
- Platform API credentials (YouTube, Patreon, etc.)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/vistara-apps/creatorflow.git
cd creatorflow
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Copy the environment template and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your actual API keys and configuration:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key

# AI Service Configuration
VITE_AI_API_KEY=your-ai-api-key
VITE_AI_PROVIDER=openai

# Platform API Keys
VITE_YOUTUBE_CLIENT_ID=your-youtube-client-id
VITE_PATREON_CLIENT_ID=your-patreon-client-id
# ... other platform credentials
```

### 4. Database Setup

Run the database schema in your Supabase project:

```sql
-- Copy and execute the SQL from docs/database-schema.sql
```

### 5. Start Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 📖 Documentation

- [API Documentation](docs/API_DOCUMENTATION.md) - Complete API reference
- [Database Schema](docs/database-schema.sql) - Database structure and setup
- [User Flows](docs/USER_FLOWS.md) - Application user journeys
- [Deployment Guide](docs/DEPLOYMENT.md) - Production deployment instructions

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── AuthView.jsx    # Authentication interface
│   ├── DashboardView.jsx # Main dashboard
│   ├── InsightsView.jsx  # Analytics and insights
│   ├── LearnView.jsx     # Learning content
│   ├── SettingsView.jsx  # User settings
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── hooks/              # Custom React hooks
│   ├── useEarnings.js  # Earnings data management
│   ├── usePlatformIntegrations.js # Platform connections
│   └── useLearning.js  # Learning content
├── lib/                # Utility libraries
│   ├── supabase.js     # Supabase client and helpers
│   ├── stripe.js       # Stripe integration
│   └── ai.js           # AI service integration
├── data/               # Mock data and constants
└── App.jsx             # Main application component
```

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the database schema from `docs/database-schema.sql`
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers (Google, GitHub)

### Stripe Setup

1. Create Stripe products and prices for subscription tiers
2. Set up webhooks for subscription events
3. Configure customer portal settings

### Platform Integrations

Each platform requires OAuth app setup:

- **YouTube**: Google Cloud Console → YouTube Data API
- **Patreon**: Patreon Developer Portal
- **Ko-fi**: Ko-fi Developer Settings
- **Twitch**: Twitch Developer Console
- **Twitter**: Twitter Developer Portal
- **Instagram**: Meta for Developers

## 🎨 Design System

CreatorFlow follows a consistent design system based on the PRD specifications:

### Colors
- **Primary**: `hsl(210 70% 50%)` - Main brand color
- **Accent**: `hsl(160 60% 45%)` - Secondary actions
- **Background**: `hsl(220 20% 98%)` - Page background
- **Surface**: `hsl(0 0% 100%)` - Card backgrounds
- **Text Primary**: `hsl(220 15% 25%)` - Main text
- **Text Secondary**: `hsl(220 15% 45%)` - Secondary text

### Typography
- **Display**: 6xl font-extrabold - Page titles
- **Heading**: 3xl font-bold - Section headers
- **Body**: base font-normal leading-7 - Regular text
- **Caption**: sm font-medium - Small text

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Primary, secondary, and accent variants
- **Forms**: Clean inputs with focus states
- **Charts**: Consistent styling with brand colors

## 🔐 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Row Level Security (RLS) policies
- **API Security**: Rate limiting and input validation
- **Data Protection**: Encrypted API credentials storage
- **HTTPS**: All communications encrypted in transit

## 📊 Analytics & Monitoring

### Key Metrics Tracked
- User engagement and retention
- Platform integration success rates
- Earnings data accuracy
- AI recommendation effectiveness
- Subscription conversion rates

### Error Monitoring
- API error rates and response times
- User authentication failures
- Platform sync failures
- Payment processing errors

## 🚀 Deployment

### Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   ```bash
   # Vercel
   vercel --prod
   
   # Netlify
   netlify deploy --prod --dir=dist
   ```

3. **Environment Variables**
   Set all production environment variables in your deployment platform

4. **Database Migration**
   Run production database schema in Supabase

### Docker Deployment

```bash
# Build Docker image
docker build -t creatorflow .

# Run container
docker run -p 3000:3000 --env-file .env creatorflow
```

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

### Test Coverage
- Component unit tests
- Hook testing with React Testing Library
- API integration tests
- End-to-end user flow tests

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) folder
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions

## 🗺 Roadmap

### Phase 1 (Current)
- ✅ Core dashboard and analytics
- ✅ Platform integrations (YouTube, Patreon, Ko-fi)
- ✅ AI-powered recommendations
- ✅ Subscription management

### Phase 2 (Upcoming)
- 📱 Mobile app (React Native)
- 🔔 Real-time notifications
- 📈 Advanced analytics and reporting
- 🤖 Enhanced AI features
- 🌐 Additional platform integrations

### Phase 3 (Future)
- 👥 Team collaboration features
- 📊 Business intelligence dashboard
- 🎯 Advanced goal setting and tracking
- 🔗 API for third-party integrations

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the amazing backend platform
- [Stripe](https://stripe.com) for seamless payment processing
- [OpenAI](https://openai.com) for AI-powered recommendations
- [Tailwind CSS](https://tailwindcss.com) for the utility-first CSS framework
- [Recharts](https://recharts.org) for beautiful data visualizations

---

**CreatorFlow** - Empowering creators to understand and grow their earnings 🚀

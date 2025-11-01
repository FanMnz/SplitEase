# SplitEase - Group Billing for HORECA

A modern SaaS application that revolutionizes group billing and order management for hotels, restaurants, cafes, bars, and entertainment venues.

## 🚀 Features

### Core Features
- **Digital Order Management** - Create digital profiles for each guest and assign orders individually
- **Automated Split Billing** - Automatic calculation of each guest's total with personalized digital bills
- **Early Checkout** - Guests can leave early with instant tab closure and immediate payment
- **Pre-Orders & Reservations** - Allow guests to order before arrival

### Business Benefits
- **15% Faster Table Turnover** - Eliminate delays caused by manual bill splitting
- **30% Improved Staff Efficiency** - Reduce manual order errors and calculation time
- **25% Better Kitchen Workflow** - Pre-orders and clear guest assignments optimize preparation
- **20% Enhanced Customer Experience** - Eliminate frustration over incorrect bills

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Development**: ESLint, TypeScript strict mode
- **Architecture**: App Router, Server Components
- **Responsive**: Mobile-first design for tablets and phones

## 📱 Application Structure

### Pages
- `/` - Landing page showcasing SplitEase features
- `/dashboard` - Restaurant dashboard with real-time stats
- `/tables` - Table management and guest seating
- `/orders` - Order tracking and kitchen management
- `/payments` - Bill splitting and payment processing
- `/menu` - Menu management (planned)
- `/analytics` - Business analytics (planned)

### Key Components
- **Navigation** - Responsive navigation with mobile support
- **Table Grid** - Visual table management interface
- **Order Status** - Real-time order tracking
- **Bill Splitting** - Multiple split methods (equal, by item, custom, percentage)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd splitease
```

2. Install dependencies
```bash
npm install
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production
```bash
npm run build
npm start
```

## 🏗 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router pages
│   ├── dashboard/       # Dashboard page
│   ├── tables/          # Table management
│   ├── orders/          # Order management
│   ├── payments/        # Payment processing
│   └── layout.tsx       # Root layout
├── components/          # Reusable components
│   └── Navigation.tsx   # Main navigation
├── types/              # TypeScript type definitions
│   └── index.ts        # Core types
└── globals.css         # Global styles
```

### Key Types
- `User` - Staff users (waiters, managers, admins)
- `Restaurant` - Venue information and settings
- `Table` & `TableSession` - Table management
- `Guest` - Individual diners
- `MenuItem` & `OrderItem` - Menu and order management
- `Bill` & `Payment` - Billing and payment processing

## 🎯 Roadmap

### Phase 1: MVP (Current)
- [x] Core UI components and navigation
- [x] Table management interface
- [x] Order tracking system
- [x] Bill splitting interface
- [ ] Payment processing integration
- [ ] Real-time updates with WebSockets

### Phase 2: API Integration
- [ ] REST API with Node.js/Express
- [ ] MongoDB database integration
- [ ] Authentication system
- [ ] POS system integrations (Square, Toast)

### Phase 3: Advanced Features
- [ ] SMS/Email bill delivery
- [ ] QR code generation
- [ ] Advanced analytics
- [ ] Multi-restaurant support
- [ ] Mobile app for guests

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key

# Communications
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
SENDGRID_API_KEY=your_sendgrid_key
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, email support@splitease.com or join our Slack channel.

---

**SplitEase** - Making group dining effortless for everyone.
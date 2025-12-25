# ✨ Personal Portfolio — Modern DevOps Engineer Portfolio

![Portfolio Banner](https://imgur.com/J4YkCks.png)

A modern, performant, and beautifully designed personal portfolio showcasing my journey, skills, and projects in DevOps, cloud computing, and tech content creation. Built with cutting-edge web technologies and optimized for an exceptional user experience across all devices.

---

## 🔗 Live Website  

👉 **[Visit my portfolio](https://notharshhaa.site)**

---

## ✨ Key Features

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Beautiful frosted glass effects with backdrop blur
- **Smooth Animations**: Page transitions and micro-interactions using Framer Motion
- **Typing Animations**: Dynamic text animations for engaging content presentation
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop
- **Dark Mode**: Seamless theme switching with system preference detection
- **Compact Mobile Design**: Optimized for smaller screens without compromising functionality

### 🧭 Navigation
- **Fixed Header**: Always accessible navigation with smooth scroll behavior
- **Mobile Menu**: Hamburger menu with slide-down animation for mobile devices
- **Keyboard Shortcuts**: Quick navigation using keyboard commands (press `?` to see shortcuts)
- **Social Sharing**: Built-in share functionality for Twitter, LinkedIn, Email, and copy link

### 📄 Sections

#### 🏠 About/Hero
- Centered avatar with floating animation
- Professional introduction with gradient text effects
- Technology stack badges with hover effects
- Social links (GitHub, LinkedIn, Twitter, etc.)
- Responsive grid layout adapting to all screen sizes

#### 💼 Career
- Timeline design with animated dots and connecting lines
- Company cards with job roles and descriptions
- Type animation for job titles
- Badge indicators (Remote, Full-time, etc.)
- External profile links
- Compact mobile view with optimized spacing

#### 🚀 Projects
- Grid layout (2 columns on desktop, 1 on mobile)
- Search and filter functionality
- Project cards with:
  - Title with external link indicators
  - Technology tags/badges
  - Preview and GitHub links
  - Image/video previews in tooltips
- Pagination for easy navigation
- Line-clamped descriptions for consistency

#### 📧 Contact
- Interactive contact form with validation
- Real-time error feedback
- Honeypot spam protection
- Email integration via Resend API
- Animated form fields with smooth transitions
- Loading states and success/error notifications

### 🎯 Additional Features
- **Scroll to Top**: Smooth scroll button appears when scrolling down
- **Reading Progress**: Progress bar for blog/content pages
- **Skip to Content**: Accessibility feature for keyboard navigation
- **Error Boundaries**: Graceful error handling with user-friendly messages
- **Form Validation**: Client-side validation with Zod schema
- **Toast Notifications**: User feedback for actions (Sonner)

## 🛠️ Tech Stack

### Core
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[React 18](https://react.dev/)** - UI library with latest features

### Styling
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Tailwind Merge](https://github.com/dcastil/tailwind-merge)** - Merge Tailwind classes
- **[CVA](https://cva.style/)** - Class Variance Authority for component variants
- **[Geist Font](https://vercel.com/font)** - Modern font family by Vercel

### UI Components
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
  - Avatar, Dropdown Menu, Label, Slot, Toast, Tooltip
- **[shadcn/ui](https://ui.shadcn.com/)** - Beautiful component library
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Animation
- **[Framer Motion](https://www.framer.com/motion/)** - Production-ready animation library
- **[Typed.js](https://github.com/mattboldt/typed.js/)** - Typing animation
- **[React Type Animation](https://github.com/maxeth/react-type-animation)** - Type animation component

### Forms & Validation
- **[React Hook Form](https://react-hook-form.com/)** - Performant form management
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hookform/resolvers](https://github.com/react-hook-form/resolvers)** - Validation resolvers

### Theming
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Theme management
- **[next-view-transitions](https://github.com/shuding/next-view-transitions)** - View transitions API

### Backend & API
- **[Resend](https://resend.com/)** - Email API for contact form

### Notifications
- **[Sonner](https://sonner.emilkowal.ski/)** - Beautiful toast notifications

### Analytics & Monitoring
- **[Vercel Analytics](https://vercel.com/analytics)** - Web analytics
- **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** - Performance monitoring

### Development Tools
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting (via config)
- **[@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)** - Bundle analysis
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixing
- **[PostCSS](https://postcss.org/)** - CSS processing

## 📦 Available Scripts

```bash
# Development
npm run dev              # Start development server at localhost:3000

# Production
npm run build            # Build optimized production bundle
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues automatically
npm run type-check       # TypeScript type checking

# Analysis & Formatting
npm run analyze          # Analyze bundle size with visualization
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
```

## 🚀 Performance Optimizations

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: Optimized with priority image loading
- **FID (First Input Delay)**: Minimal JavaScript execution on initial load
- **CLS (Cumulative Layout Shift)**: Reserved space for images and content

### Bundle Optimization
- **Tree Shaking**: Removes unused code
- **Code Splitting**: Dynamic imports for route-based splitting
- **Component Lazy Loading**: Suspense boundaries for heavy components
- **Bundle Analysis**: Monitor and optimize bundle size

### Image Optimization
- **Next.js Image**: Automatic optimization and lazy loading
- **Modern Formats**: AVIF and WebP with fallbacks
- **Responsive Images**: Multiple sizes for different viewports
- **Priority Loading**: Above-the-fold images load first

### SEO & Metadata
- **Structured Data**: JSON-LD for rich search results
- **Open Graph**: Social media preview cards
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawler instructions
- **Meta Tags**: Comprehensive meta information

### Accessibility
- **ARIA Labels**: Semantic HTML and ARIA attributes
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Visible focus indicators
- **Screen Reader Support**: Descriptive labels and alt text
- **Color Contrast**: WCAG AA compliance

### Performance Monitoring
- **Real-time Analytics**: Track user interactions
- **Core Web Vitals Tracking**: Monitor performance metrics
- **Error Tracking**: Error boundaries and monitoring
- **Speed Insights**: Performance bottleneck identification

## 🎨 Design Features

- **Glassmorphism**: Modern frosted glass aesthetic
- **Gradient Text**: Eye-catching gradient effects on headings
- **Micro-interactions**: Hover effects, scale transforms, and transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes
- **Card Design**: Consistent card components with hover states
- **Typography**: Geist font family for modern, readable text
- **Color System**: Primary color theming with dark/light modes
- **Spacing System**: Consistent spacing scale throughout

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/NotHarshhaa/personal-portfolio.git
cd personal-portfolio
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
# Add your environment variables (Resend API key, etc.)
```

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── career/       # Career page
│   │   ├── contact/      # Contact page
│   │   ├── projects/     # Projects page
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── header.tsx   # Navigation header
│   │   ├── hero.tsx     # Hero/About section
│   │   ├── career.tsx   # Career timeline
│   │   ├── projects.tsx # Projects grid
│   │   └── contact.tsx  # Contact form
│   ├── constants/        # App constants and data
│   ├── data/            # Static data (career, projects, etc.)
│   ├── hook/            # Custom React hooks
│   ├── lib/             # Utility functions
│   ├── types/           # TypeScript types
│   └── styles/          # Global styles
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
RESEND_API_KEY=your_resend_api_key
```

### Customization
- **Data**: Edit files in `src/data/` to update content
- **Styles**: Modify Tailwind config in `tailwind.config.ts`
- **Theme**: Adjust colors in `src/app/globals.css`
- **Components**: Customize components in `src/components/`

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🙌 Acknowledgments

- **[@emapeire](https://github.com/emapeire)** - Original inspiration and template structure
- **[shadcn](https://twitter.com/shadcn)** - Amazing UI component library
- **[Vercel](https://vercel.com)** - Hosting and deployment platform
- **Open Source Community** - For the incredible tools and libraries

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ by [Harshhaa Vardhan Reddy](https://github.com/NotHarshhaa)**

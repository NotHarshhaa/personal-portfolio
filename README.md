# ✨ Personal Portfolio — Modern DevOps Engineer Portfolio

![Portfolio Banner](https://imgur.com/dOMs87v.png)

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

---

## 🚀 Getting Started

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

---

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file with:
```env
RESEND_API_KEY=your_resend_api_key
GITHUB_TOKEN=your_github_token
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

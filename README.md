# Java Developer Portfolio

A modern, responsive portfolio website built with React, TypeScript, and Three.js, showcasing professional Java development skills and experience.

## 🚀 Features

- **Interactive WebGL Background**: Stunning 3D animations powered by Three.js
- **Responsive Design**: Optimized for all devices and screen sizes
- **Performance Optimized**: Code splitting, lazy loading, and bundle optimization
- **SEO Ready**: Comprehensive meta tags, sitemap, and social sharing
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Modern Tech Stack**: React 19, TypeScript, Tailwind CSS, Framer Motion

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion, Three.js
- **Build Tool**: Vite
- **Deployment**: Netlify/Vercel ready

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/          # Reusable UI components
│   ├── sections/    # Page sections
│   ├── 3d/          # Three.js components
│   ├── layout/      # Layout components
│   └── lazy/        # Lazy-loaded components
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
├── data/            # Static data and content
├── services/        # API services
└── assets/          # Images, fonts, etc.
```

## 🔧 Development Scripts

```bash
# Development
npm run dev                 # Start dev server
npm run preview            # Preview production build
npm run preview:network    # Preview with network access

# Building
npm run build              # Production build
npm run build:production   # Optimized production build
npm run build:analyze      # Build with bundle analysis

# Code Quality
npm run lint               # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run type-check        # TypeScript type checking

# Maintenance
npm run clean             # Clean build artifacts
npm run prepare           # Pre-commit checks
```

## 🚀 Deployment

### Netlify Deployment

1. **Automatic Deployment** (Recommended):
   - Connect your GitHub repository to Netlify
   - Build settings are configured in `netlify.toml`
   - Automatic deployments on push to main branch

2. **Manual Deployment**:
   ```bash
   npm run build:production
   npx netlify deploy --prod --dir=dist
   ```

### Vercel Deployment

1. **Automatic Deployment**:
   - Connect your GitHub repository to Vercel
   - Configuration is in `vercel.json`

2. **Manual Deployment**:
   ```bash
   npm run build:production
   npx vercel --prod
   ```

### GitHub Actions CI/CD

The project includes a complete CI/CD pipeline in `.github/workflows/deploy.yml`:

- **Continuous Integration**: Runs on all PRs
- **Automated Testing**: Type checking and linting
- **Performance Monitoring**: Lighthouse CI audits
- **Automatic Deployment**: Deploys to Netlify on main branch

#### Required Secrets

Add these secrets to your GitHub repository:

```
NETLIFY_SITE_ID=your-netlify-site-id
NETLIFY_AUTH_TOKEN=your-netlify-auth-token
```

## 📊 Performance Optimization

### Bundle Optimization
- **Code Splitting**: Automatic chunking for optimal loading
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Images, fonts, and static assets
- **Compression**: Gzip/Brotli compression enabled

### Performance Targets
- **Performance Score**: >80
- **First Contentful Paint**: <2s
- **Largest Contentful Paint**: <3s
- **Cumulative Layout Shift**: <0.1
- **Total Blocking Time**: <300ms

### Monitoring
- **Lighthouse CI**: Automated performance audits
- **Bundle Analysis**: Track bundle size changes
- **Core Web Vitals**: Real user monitoring ready

## 🔍 SEO Features

- **Meta Tags**: Comprehensive SEO and social sharing tags
- **Structured Data**: JSON-LD schema markup ready
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling instructions
- **Open Graph**: Facebook and LinkedIn sharing optimization
- **Twitter Cards**: Twitter sharing optimization

## ♿ Accessibility

- **WCAG 2.1 AA Compliant**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Reduced Motion**: Respects user motion preferences
- **Color Contrast**: Meets contrast ratio requirements

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_CONTACT_EMAIL=your-email@example.com
VITE_GITHUB_URL=https://github.com/yourusername
VITE_LINKEDIN_URL=https://linkedin.com/in/yourusername
```

### Customization

1. **Portfolio Data**: Update `src/data/portfolio.ts`
2. **Theme Colors**: Modify `tailwind.config.js`
3. **Meta Tags**: Update `index.html`
4. **Deployment URLs**: Update configuration files

## 📱 Browser Support

- **Modern Browsers**: Chrome 80+, Firefox 78+, Safari 14+, Edge 88+
- **Mobile**: iOS Safari 14+, Chrome Mobile 80+
- **WebGL Fallbacks**: Graceful degradation for unsupported devices

## 🎨 Theme & Design

The portfolio uses a modern dark theme with:

- **Background**: Deep blacks and grays
- **Accents**: Purple/blue gradients (#8b5cf6, #3b82f6)
- **Typography**: Modern, readable fonts
- **Animations**: Smooth, performant transitions
- **Glass Morphism**: Subtle transparency effects

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
# Deployment Checklist

## Pre-Deployment Checklist

### Code Quality
- [ ] All TypeScript errors resolved (`npm run type-check`)
- [ ] ESLint passes without errors (`npm run lint`)
- [ ] All tests pass (when implemented)
- [ ] Code reviewed and approved

### Performance
- [ ] Bundle size optimized (check with `npm run build:analyze`)
- [ ] Images optimized and compressed
- [ ] Lazy loading implemented for heavy components
- [ ] WebGL performance tested on mobile devices

### SEO & Meta Tags
- [ ] Meta descriptions updated
- [ ] Open Graph tags configured
- [ ] Twitter Card tags configured
- [ ] Sitemap.xml updated with current URLs
- [ ] Robots.txt configured correctly

### Accessibility
- [ ] WCAG 2.1 AA compliance verified
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility tested
- [ ] Color contrast ratios verified
- [ ] Reduced motion preferences respected

### Cross-Browser Testing
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile Safari (iOS 14+)
- [ ] Chrome Mobile (Android 8+)

### Security
- [ ] No sensitive data in client-side code
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Content Security Policy implemented
- [ ] External links use rel="noopener"

## Deployment Steps

### Netlify Deployment

1. **Prepare Environment**
   ```bash
   # Ensure clean state
   npm run clean
   npm install
   ```

2. **Build and Test**
   ```bash
   # Run full build
   npm run build:production
   
   # Test production build locally
   npm run preview
   ```

3. **Deploy**
   ```bash
   # Manual deployment
   npx netlify deploy --prod --dir=dist
   
   # Or push to main branch for automatic deployment
   git push origin main
   ```

### Vercel Deployment

1. **Prepare Environment**
   ```bash
   npm run clean
   npm install
   ```

2. **Build and Test**
   ```bash
   npm run build:production
   npm run preview
   ```

3. **Deploy**
   ```bash
   # Manual deployment
   npx vercel --prod
   
   # Or push to main branch for automatic deployment
   git push origin main
   ```

## Post-Deployment Checklist

### Functionality Testing
- [ ] All sections load correctly
- [ ] Navigation works smoothly
- [ ] Contact form submits successfully
- [ ] WebGL animations render properly
- [ ] Responsive design works on all devices
- [ ] All external links work

### Performance Verification
- [ ] Lighthouse audit score >80
- [ ] Core Web Vitals within targets
- [ ] Page load time <3 seconds
- [ ] Images load efficiently
- [ ] No console errors

### SEO Verification
- [ ] Google Search Console configured
- [ ] Sitemap submitted to search engines
- [ ] Meta tags display correctly in social previews
- [ ] Structured data validates
- [ ] Analytics tracking works

### Monitoring Setup
- [ ] Error tracking configured (if applicable)
- [ ] Performance monitoring active
- [ ] Uptime monitoring configured
- [ ] Analytics dashboard accessible

## Rollback Plan

If issues are discovered after deployment:

1. **Immediate Rollback**
   ```bash
   # Netlify
   netlify sites:list
   netlify api listSiteDeploys --site-id=SITE_ID
   netlify api restoreSiteDeploy --site-id=SITE_ID --deploy-id=DEPLOY_ID
   
   # Vercel
   vercel rollback [deployment-url]
   ```

2. **Fix and Redeploy**
   - Identify and fix the issue
   - Test thoroughly in staging
   - Deploy the fix
   - Verify the fix in production

## Environment-Specific Configuration

### Production Environment Variables
```env
NODE_ENV=production
VITE_SITE_URL=https://your-domain.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

### Staging Environment Variables
```env
NODE_ENV=staging
VITE_SITE_URL=https://staging-your-domain.com
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PERFORMANCE_MONITORING=true
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors
   - Verify all dependencies are installed
   - Clear node_modules and reinstall

2. **Performance Issues**
   - Check bundle size
   - Verify lazy loading is working
   - Test WebGL performance on target devices

3. **SEO Issues**
   - Verify meta tags are rendered
   - Check robots.txt accessibility
   - Validate sitemap.xml format

4. **Accessibility Issues**
   - Run automated accessibility tests
   - Test with screen readers
   - Verify keyboard navigation

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review and update content quarterly
- [ ] Monitor performance metrics weekly
- [ ] Check for broken links monthly
- [ ] Update browser support targets annually

### Security Updates
- [ ] Monitor security advisories
- [ ] Update dependencies with security patches
- [ ] Review and update CSP headers
- [ ] Audit third-party integrations
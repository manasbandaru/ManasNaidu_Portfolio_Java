#!/bin/bash

# Java Developer Portfolio Deployment Script
# This script handles the complete deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
print_status "Node.js version: $NODE_VERSION"

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean || true

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run type checking
print_status "Running TypeScript type checking..."
if npm run type-check; then
    print_success "Type checking passed"
else
    print_error "Type checking failed"
    exit 1
fi

# Run linting (allow warnings but not errors)
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_warning "Linting issues detected. Review before deploying to production."
fi

# Build the project
print_status "Building project for production..."
if npm run build:production; then
    print_success "Build completed successfully"
else
    print_error "Build failed"
    exit 1
fi

# Analyze bundle size
print_status "Analyzing bundle size..."
npm run build:analyze

# Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "Build output directory 'dist' not found"
    exit 1
fi

# Deployment target selection
echo ""
echo "Select deployment target:"
echo "1) Netlify"
echo "2) Vercel"
echo "3) Manual (just build)"
echo "4) Preview locally"
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        print_status "Deploying to Netlify..."
        if command -v netlify &> /dev/null; then
            netlify deploy --prod --dir=dist
            print_success "Deployed to Netlify successfully!"
        else
            print_error "Netlify CLI not found. Install with: npm install -g netlify-cli"
            exit 1
        fi
        ;;
    2)
        print_status "Deploying to Vercel..."
        if command -v vercel &> /dev/null; then
            vercel --prod
            print_success "Deployed to Vercel successfully!"
        else
            print_error "Vercel CLI not found. Install with: npm install -g vercel"
            exit 1
        fi
        ;;
    3)
        print_success "Build completed. Files are ready in the 'dist' directory."
        ;;
    4)
        print_status "Starting preview server..."
        npm run preview
        ;;
    *)
        print_error "Invalid choice"
        exit 1
        ;;
esac

# Post-deployment checks
if [ "$choice" = "1" ] || [ "$choice" = "2" ]; then
    echo ""
    print_status "Post-deployment checklist:"
    echo "□ Test the deployed site functionality"
    echo "□ Verify all sections load correctly"
    echo "□ Check WebGL animations work"
    echo "□ Test responsive design on mobile"
    echo "□ Verify contact form submission"
    echo "□ Check social sharing meta tags"
    echo "□ Run Lighthouse audit"
    echo "□ Monitor error logs"
fi

print_success "Deployment process completed!"
echo ""
echo "📊 Next steps:"
echo "- Monitor performance metrics"
echo "- Check error tracking"
echo "- Update analytics dashboard"
echo "- Review user feedback"
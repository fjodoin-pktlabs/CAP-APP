#!/bin/bash

# Docker Build Fix Script for CAP-APP
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[FIX]${NC} $1"
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

# Function to fix pnpm lockfile
fix_lockfile() {
    print_status "Fixing pnpm lockfile..."
    
    if [ -f "pnpm-lock.yaml" ]; then
        print_warning "Removing outdated pnpm-lock.yaml"
        rm pnpm-lock.yaml
    fi
    
    if command -v pnpm &> /dev/null; then
        print_status "Regenerating pnpm-lock.yaml..."
        pnpm install
        print_success "pnpm lockfile regenerated"
    else
        print_warning "pnpm not found locally, will use npm in Docker"
    fi
}

# Function to test build with different Dockerfiles
test_build() {
    local dockerfile=$1
    local image_name=$2
    
    print_status "Testing build with $dockerfile..."
    
    if docker build -f "$dockerfile" -t "$image_name" .; then
        print_success "Build successful with $dockerfile"
        return 0
    else
        print_error "Build failed with $dockerfile"
        return 1
    fi
}

# Function to clean Docker cache
clean_docker() {
    print_status "Cleaning Docker build cache..."
    
    docker builder prune -f
    docker system prune -f
    
    print_success "Docker cache cleaned"
}

# Main fix workflow
fix_docker_build() {
    print_status "Starting Docker build fix workflow..."
    
    # Step 1: Clean Docker cache
    clean_docker
    
    # Step 2: Fix lockfile if needed
    if [ "$1" = "--fix-lockfile" ]; then
        fix_lockfile
    fi
    
    # Step 3: Try different build strategies
    
    # Strategy 1: Original Dockerfile with fixes
    print_status "Attempting build with original Dockerfile (fixed)..."
    if test_build "Dockerfile" "cap-app-frontend:latest"; then
        print_success "Build completed successfully!"
        return 0
    fi
    
    # Strategy 2: Alternative Dockerfile
    print_status "Trying alternative Dockerfile..."
    if [ -f "Dockerfile.alternative" ]; then
        if test_build "Dockerfile.alternative" "cap-app-frontend:latest"; then
            print_success "Build completed with alternative Dockerfile!"
            print_warning "Consider using Dockerfile.alternative as your main Dockerfile"
            return 0
        fi
    fi
    
    # Strategy 3: Simple Dockerfile
    print_status "Trying simple Dockerfile..."
    if [ -f "Dockerfile.simple" ]; then
        if test_build "Dockerfile.simple" "cap-app-frontend:latest"; then
            print_success "Build completed with simple Dockerfile!"
            print_warning "Using fallback simple build - consider optimizing later"
            return 0
        fi
    fi
    
    # Strategy 4: Build without cache
    print_status "Trying build without cache..."
    if docker build --no-cache -t cap-app-frontend:latest .; then
        print_success "Build completed without cache!"
        return 0
    fi
    
    print_error "All build strategies failed. Manual intervention required."
    return 1
}

# Function to show manual fix instructions
show_manual_fix() {
    cat << EOF

🛠️  Manual Fix Instructions:

1. Fix Dependencies:
   # Regenerate lockfile
   rm pnpm-lock.yaml
   pnpm install
   
   # Or switch to npm
   rm pnpm-lock.yaml
   npm install

2. Update next.config.mjs:
   Add: output: 'standalone'

3. Try alternative approaches:
   # Use npm instead of pnpm
   ./build-fix.sh --use-npm
   
   # Use simple Dockerfile
   cp Dockerfile.simple Dockerfile
   
   # Build without lockfile
   rm pnpm-lock.yaml && docker build .

4. Check dependencies:
   npm audit
   npm outdated

EOF
}

# Function to use npm instead of pnpm
use_npm() {
    print_status "Switching to npm build process..."
    
    # Backup existing files
    [ -f "pnpm-lock.yaml" ] && mv pnpm-lock.yaml pnpm-lock.yaml.bak
    
    # Create npm-focused Dockerfile
    cat > Dockerfile.npm << 'EOF'
FROM node:18-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
EOF
    
    # Generate package-lock.json if needed
    if [ ! -f "package-lock.json" ]; then
        npm install
    fi
    
    # Test build
    if test_build "Dockerfile.npm" "cap-app-frontend:latest"; then
        print_success "npm build successful!"
        print_status "You can use Dockerfile.npm as your main Dockerfile"
    else
        print_error "npm build also failed"
    fi
}

# Main script logic
case "${1:-fix}" in
    "fix")
        fix_docker_build
        ;;
    "--fix-lockfile")
        fix_docker_build --fix-lockfile
        ;;
    "--use-npm")
        use_npm
        ;;
    "--clean")
        clean_docker
        ;;
    "--manual")
        show_manual_fix
        ;;
    *)
        echo "Docker Build Fix Tool"
        echo ""
        echo "Usage: $0 {fix|--fix-lockfile|--use-npm|--clean|--manual}"
        echo ""
        echo "Commands:"
        echo "  fix              - Try multiple build strategies"
        echo "  --fix-lockfile   - Regenerate lockfile and build"
        echo "  --use-npm        - Switch to npm instead of pnpm"
        echo "  --clean          - Clean Docker cache"
        echo "  --manual         - Show manual fix instructions"
        echo ""
        ;;
esac

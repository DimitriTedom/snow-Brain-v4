#!/bin/bash

# 🚀 SnowBrain v4 - Development Helper Script
# This script provides common development commands for the SnowBrain project

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${PURPLE}🧠 $1${NC}"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if Supabase is running
check_supabase_status() {
    if supabase status --output=json > /dev/null 2>&1; then
        print_status "Supabase is running"
        return 0
    else
        print_warning "Supabase is not running"
        return 1
    fi
}

# Function to start development environment
start_dev() {
    print_header "Starting SnowBrain v4 Development Environment"
    
    # Check dependencies
    print_info "Checking dependencies..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command_exists npm; then
        print_error "npm is not installed"
        exit 1
    fi
    
    if ! command_exists supabase; then
        print_error "Supabase CLI is not installed"
        print_info "Run: curl -fsSL https://cli.supabase.com/install.sh | sh"
        exit 1
    fi
    
    print_status "All dependencies are installed"
    
    # Start Supabase if not running
    if ! check_supabase_status; then
        print_info "Starting Supabase..."
        supabase start
        print_status "Supabase started"
    fi
    
    # Switch to local environment
    print_info "Switching to local environment..."
    ./switch-env.sh local
    
    # Install npm dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_info "Installing npm dependencies..."
        npm install
        print_status "Dependencies installed"
    fi
    
    # Start Next.js development server
    print_info "Starting Next.js development server..."
    print_status "Development environment ready!"
    print_info "Visit: http://localhost:3000"
    print_info "Supabase Studio: http://localhost:54323"
    
    npm run dev
}

# Function to stop development environment
stop_dev() {
    print_header "Stopping SnowBrain v4 Development Environment"
    
    print_info "Stopping Supabase..."
    supabase stop
    print_status "Development environment stopped"
}

# Function to reset local database
reset_db() {
    print_header "Resetting Local Database"
    
    read -p "⚠️  This will delete all local data. Continue? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Resetting database..."
        supabase db reset
        print_status "Database reset complete"
        
        print_info "Applying schema..."
        psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -f complete-supabase-schema.sql
        print_status "Schema applied"
    else
        print_info "Database reset cancelled"
    fi
}

# Function to run tests
run_tests() {
    print_header "Running Tests"
    
    print_info "Running TypeScript type checking..."
    npm run type-check
    
    print_info "Running linting..."
    npm run lint
    
    if [ -f "package.json" ] && grep -q "test" package.json; then
        print_info "Running tests..."
        npm test
    fi
    
    print_status "All checks passed!"
}

# Function to build for production
build_prod() {
    print_header "Building for Production"
    
    print_info "Switching to remote environment..."
    ./switch-env.sh remote
    
    print_info "Building Next.js application..."
    npm run build
    
    print_status "Production build complete!"
}

# Function to show project status
show_status() {
    print_header "SnowBrain v4 Development Status"
    
    echo
    print_info "Node.js Version:"
    node --version
    
    print_info "npm Version:"
    npm --version
    
    if command_exists supabase; then
        print_info "Supabase CLI Version:"
        supabase --version
        
        echo
        print_info "Supabase Status:"
        if check_supabase_status; then
            supabase status
        fi
    fi
    
    echo
    print_info "Environment Variables:"
    if grep -q "127.0.0.1" .env; then
        print_status "Currently using LOCAL Supabase"
    else
        print_status "Currently using REMOTE Supabase"
    fi
}

# Function to show help
show_help() {
    echo -e "${PURPLE}🧠 SnowBrain v4 - Development Helper${NC}"
    echo
    echo "Usage: $0 [command]"
    echo
    echo "Commands:"
    echo "  start     Start the development environment"
    echo "  stop      Stop the development environment"
    echo "  reset-db  Reset the local database"
    echo "  test      Run tests and type checking"
    echo "  build     Build for production"
    echo "  status    Show project status"
    echo "  help      Show this help message"
    echo
    echo "Examples:"
    echo "  $0 start         # Start development with local Supabase"
    echo "  $0 reset-db      # Reset local database"
    echo "  $0 test          # Run all tests"
    echo
}

# Main script logic
case "$1" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    reset-db)
        reset_db
        ;;
    test)
        run_tests
        ;;
    build)
        build_prod
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo
        show_help
        exit 1
        ;;
esac
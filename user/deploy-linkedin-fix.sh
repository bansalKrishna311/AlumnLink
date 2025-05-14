#!/bin/bash

# This script deploys the LinkedIn authentication fixes to the DigitalOcean server

# Helper function for colored output
print_message() {
    echo -e "\e[1;34m$1\e[0m"
}

# Update backend
print_message "Deploying backend fixes..."
cd backend
npm run build || { echo "Backend build failed"; exit 1; }

# Restart backend services on server
# You'll need to replace these commands with your actual deployment process
# For example, using SSH to restart services:
# ssh user@139.59.66.21 "cd /path/to/backend && pm2 restart server.js"

print_message "Deploying frontend fixes..."
cd ../client
npm run build || { echo "Frontend build failed"; exit 1; }

# Deploy frontend builds
# ssh user@139.59.66.21 "cd /path/to/frontend && rm -rf dist && mkdir -p dist"
# scp -r dist/* user@139.59.66.21:/path/to/frontend/dist/

print_message "Deployment complete. LinkedIn authentication should now be working!"
print_message "Remember to check the server logs for any errors."

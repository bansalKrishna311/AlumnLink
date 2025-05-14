#!/bin/bash

# This script deploys the LinkedIn authentication fixes to the DigitalOcean server

# Helper function for colored output
print_message() {
    echo -e "\e[1;34m$1\e[0m"
}

# Check for git
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install git first."
    exit 1
fi

# Create a branch for the LinkedIn fix
print_message "Creating a branch for the LinkedIn OAuth fix..."
git checkout -b krishna/linkedin-fix 2>/dev/null || git checkout krishna/linkedin-fix

# List fixed files
print_message "The following files have been fixed:"
echo "- backend/controllers/auth.controller.js"
echo "- backend/utils/fix-env-whitespace.js"
echo "- backend/utils/test-linkedin-config.js" 
echo "- client/src/pages/auth/LoginPage.jsx"

# Add and commit changes
print_message "Committing the changes..."
git add backend/controllers/auth.controller.js
git add backend/utils/fix-env-whitespace.js
git add backend/utils/test-linkedin-config.js
git add client/src/pages/auth/LoginPage.jsx
git commit -m "Fix LinkedIn OAuth authentication for Digital Ocean deployment"

# Push to repository
print_message "Pushing changes to remote repository..."
git push origin krishna/linkedin-fix

# Update backend
print_message "Building the backend code..."
cd backend
# First fix environment variable whitespace issues
node utils/fix-env-whitespace.js
# Then build the backend
npm run build || { echo "Backend build failed"; exit 1; }

print_message "Building the frontend code..."
cd ../client
npm run build || { echo "Frontend build failed"; exit 1; }

print_message "==============================================" 
print_message "DEPLOYMENT INSTRUCTIONS FOR DIGITAL OCEAN:"
print_message "1. SSH into your Digital Ocean server"
print_message "2. Navigate to your application directory"
print_message "3. Run: git pull origin krishna/linkedin-fix"
print_message "4. Install any new dependencies: npm install"
print_message "5. Restart backend: pm2 restart server.js"
print_message "6. Run fix-env-whitespace.js: node utils/fix-env-whitespace.js"
print_message "7. Test LinkedIn login at http://139.59.66.21:5000/"
print_message "8. Check logs for errors: pm2 logs"
print_message "==============================================" 

print_message "Deployment preparation complete. LinkedIn authentication should now work on your server!"
print_message "Remember to check the server logs for any errors."

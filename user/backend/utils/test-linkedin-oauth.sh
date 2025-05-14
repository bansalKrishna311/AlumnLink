#!/bin/bash

echo "----- LinkedIn OAuth Configuration Test -----"
echo "This script will test your LinkedIn OAuth configuration"

# Check if the environment variables are set
if [ -f ".env" ]; then
    echo "Loading environment variables..."
    export $(grep -v '^#' .env | xargs)
else
    echo "⚠️ No .env file found. Using environment variables from current session."
fi

# Check if required environment variables are set
echo -e "\nChecking environment variables:"
missing_vars=0

# Function to check environment variable
check_var() {
    var_name=$1
    var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo "❌ $var_name: Missing"
        missing_vars=$((missing_vars + 1))
    else
        # Special handling for client secret
        if [ "$var_name" == "LINKEDIN_CLIENT_SECRET" ]; then
            # Check for leading or trailing spaces
            trimmed=$(echo "$var_value" | xargs)
            if [ "$trimmed" != "$var_value" ]; then
                echo "⚠️ $var_name: [Has leading/trailing spaces] (masked)"
                echo "   This might cause LinkedIn authentication to fail."
            else
                echo "✅ $var_name: (masked)"
            fi
        else
            echo "✅ $var_name: $var_value"
        fi
    fi
}

# Check all required variables
check_var "LINKEDIN_CLIENT_ID"
check_var "LINKEDIN_CLIENT_SECRET"
check_var "LINKEDIN_REDIRECT_URI"
check_var "CLIENT_REDIRECT_URL"

# Exit if any required variables are missing
if [ $missing_vars -gt 0 ]; then
    echo -e "\n❌ Missing $missing_vars required environment variables. LinkedIn OAuth won't work."
    exit 1
fi

# Generate a test LinkedIn OAuth URL
echo -e "\nGenerating test LinkedIn OAuth URL:"
state=$(date +%s)
encoded_redirect_uri=$(printf '%s' "$LINKEDIN_REDIRECT_URI" | jq -s -R -r @uri)
params="response_type=code&client_id=$LINKEDIN_CLIENT_ID&redirect_uri=$encoded_redirect_uri&scope=openid%20email%20profile&state=$state"
linkedin_url="https://www.linkedin.com/oauth/v2/authorization?$params"

echo -e "LinkedIn OAuth URL: $linkedin_url"

# Fix common issues
if [[ "$LINKEDIN_CLIENT_SECRET" =~ ^[[:space:]] ]]; then
    echo -e "\n⚠️ Your LINKEDIN_CLIENT_SECRET begins with whitespace. Let's fix that:"
    read -p "Do you want to update your .env file to remove leading/trailing spaces from LINKEDIN_CLIENT_SECRET? (y/n) " -n 1 -r
    echo 
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        trimmed_secret=$(echo "$LINKEDIN_CLIENT_SECRET" | xargs)
        # Update .env file
        if [ -f ".env" ]; then
            sed -i "s/LINKEDIN_CLIENT_SECRET=.*/LINKEDIN_CLIENT_SECRET=$trimmed_secret/" .env
            echo "✅ Updated LINKEDIN_CLIENT_SECRET in .env file."
        else
            echo "⚠️ No .env file found. Please manually update your LINKEDIN_CLIENT_SECRET."
        fi
    fi
fi

# Test instructions
echo -e "\nTo test your LinkedIn OAuth integration:"
echo "1. Open the LinkedIn URL in your browser"
echo "2. Complete the LinkedIn authentication"
echo "3. Check if you're redirected back to your application"
echo "4. Check your server logs for any errors"

# Additional debugging information
echo -e "\nAdditional debugging tips:"
echo "- Verify that your redirect URI exactly matches what's in LinkedIn Developer Console"
echo "- Check that your application is correctly sending and processing cookies"
echo "- Look for CORS issues if your frontend and backend are on different domains"
echo "- Ensure your LinkedIn app has the correct permissions enabled"

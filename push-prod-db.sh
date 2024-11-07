#!/bin/bash

# Exit on error
set -e

echo "🔍 Loading environment variables..."
if [ ! -f .env.local ]; then
    echo "❌ Error: .env file not found"
    exit 1
fi

# Load environment variables from .env file
export $(cat .env.local | grep -v '^#' | xargs)

if [ -z "$PROD_DB" ]; then
    echo "❌ Error: PROD_DB variable not found in .env file"
    exit 1
fi

echo "🔄 Generating migration..."
npx drizzle-kit push:pg --url="$PROD_DB"

echo "✅ Database changes have been pushed to production"

# Add a timestamp to track when the push was done
echo "🕒 Push completed at $(date)"

# Unset the environment variable after we're done
unset PROD_DB

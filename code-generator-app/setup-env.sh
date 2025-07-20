#!/bin/bash

# This script helps set up the environment variables for the code generator app

echo "🔧 Setting up environment variables..."

# Check if .env exists in api folder
if [ ! -f "apps/api/.env" ]; then
    echo "📝 Creating .env file from .env.example..."
    cp apps/api/.env.example apps/api/.env
fi

echo ""
echo "⚠️  IMPORTANT: Make sure to add your OpenRouter API key to apps/api/.env"
echo ""
echo "Edit the file apps/api/.env and replace:"
echo "OPENROUTER_API_KEY=sk-or-v1-YOUR_API_KEY_HERE"
echo ""
echo "With your actual OpenRouter API key."
echo ""
echo "You can get an API key from: https://openrouter.ai/keys"
echo ""
echo "After adding your key, restart the development server."
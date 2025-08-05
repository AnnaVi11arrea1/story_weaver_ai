#!/bin/bash

# Story Weaver AI Deployment Script for Digital Ocean VPS
# This script will install all dependencies and deploy your app

echo "🚀 Starting Story Weaver AI deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
echo "📋 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
echo "🗄️ Installing MongoDB..."
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install -y nginx

# Install PM2 for process management
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# Create app directory
echo "📁 Creating application directory..."
sudo mkdir -p /var/www/story-weaver-ai
sudo chown -R $USER:$USER /var/www/story-weaver-ai

echo "✅ System setup complete!"
echo "📝 Next steps:"
echo "1. Upload your code to /var/www/story-weaver-ai"
echo "2. Run the app setup script"
echo "3. Configure Nginx"

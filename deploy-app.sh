#!/bin/bash

# App Setup Script - Run this after uploading your code
echo "🔧 Setting up Story Weaver AI application..."

# Navigate to app directory
cd /var/www/story-weaver-ai

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
npm install --save-dev @types/node

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Build the frontend
echo "🏗️ Building frontend..."
npm run build

# Copy environment file
echo "⚙️ Setting up environment..."
cp backend/.env.production backend/.env

# Create PM2 ecosystem configuration
echo "📋 Creating PM2 configuration..."
cat > ecosystem.config.js << 'EOF'
export default {
  apps: [
    {
      name: 'story-weaver-backend',
      script: 'backend/server.js',
      cwd: '/var/www/story-weaver-ai',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      error_file: '/var/log/story-weaver/backend-error.log',
      out_file: '/var/log/story-weaver/backend-out.log',
      log_file: '/var/log/story-weaver/backend-combined.log'
    },
    {
      name: 'story-weaver-frontend',
      script: 'npx',
      args: 'serve -s dist -l 3000',
      cwd: '/var/www/story-weaver-ai',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: '/var/log/story-weaver/frontend-error.log',
      out_file: '/var/log/story-weaver/frontend-out.log',
      log_file: '/var/log/story-weaver/frontend-combined.log'
    }
  ]
};
EOF

# Create log directory
sudo mkdir -p /var/log/story-weaver
sudo chown -R $USER:$USER /var/log/story-weaver

# Install serve for serving the built frontend
npm install -g serve

# Start applications with PM2
echo "🚀 Starting applications..."
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 to start on boot
echo "⚙️ Setting up PM2 to start on boot..."
sudo pm2 startup systemd -u $USER --hp $HOME
pm2 save

echo "✅ Application setup complete!"
echo "🌐 Your app should be running on:"
echo "   Frontend: http://YOUR_VPS_IP:3000"
echo "   Backend API: http://YOUR_VPS_IP:5001"

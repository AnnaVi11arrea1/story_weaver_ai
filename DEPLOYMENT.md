# Story Weaver AI - Digital Ocean VPS Deployment Guide

## Prerequisites
- Digital Ocean VPS (Ubuntu 20.04 or 22.04 recommended)
- VPS IP address
- SSH access (password or key)
- Your Gemini API key

## Step-by-Step Deployment

### 1. Connect to your VPS
```bash
ssh root@YOUR_VPS_IP
# Enter your password when prompted
```

### 2. Upload your code
You have several options:

#### Option A: Using Git (Recommended)
```bash
# On your VPS
cd /var/www
git clone https://github.com/YOUR_USERNAME/story_weaver_ai.git story-weaver-ai
cd story-weaver-ai
```

#### Option B: Using SCP from your local machine
```bash
# From your local machine (in the project directory)
scp -r . root@YOUR_VPS_IP:/var/www/story-weaver-ai/
```

### 3. Run the system setup script
```bash
# On your VPS
cd /var/www/story-weaver-ai
chmod +x deploy-system.sh
./deploy-system.sh
```

### 4. Configure environment variables
```bash
# Edit the backend environment file
nano backend/.env.production

# Update these values:
# - Replace YOUR_VPS_IP with your actual VPS IP
# - Add your actual Gemini API key
# - Change the JWT_SECRET to a secure random string
```

### 5. Run the application setup script
```bash
chmod +x deploy-app.sh
./deploy-app.sh
```

### 6. Configure Nginx
```bash
# Copy the nginx configuration
sudo cp nginx-config /etc/nginx/sites-available/story-weaver-ai

# Edit the config to replace YOUR_VPS_IP with your actual IP
sudo nano /etc/nginx/sites-available/story-weaver-ai

# Enable the site
sudo ln -s /etc/nginx/sites-available/story-weaver-ai /etc/nginx/sites-enabled/

# Remove default nginx site
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### 7. Configure firewall
```bash
# Allow HTTP, HTTPS, and SSH
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 8. Verify deployment
```bash
# Check if services are running
pm2 status

# Check nginx status
sudo systemctl status nginx

# Check mongodb status
sudo systemctl status mongod
```

## Your app should now be accessible at:
- **Main App**: http://YOUR_VPS_IP
- **API**: http://YOUR_VPS_IP/api

## Useful Commands

### Managing services
```bash
# Restart all services
pm2 restart all

# View logs
pm2 logs

# Stop all services
pm2 stop all

# Start all services
pm2 start all
```

### MongoDB management
```bash
# Connect to MongoDB
mongosh

# View databases
show dbs

# Use your app database
use story_weaver_ai
```

### Nginx management
```bash
# Restart nginx
sudo systemctl restart nginx

# Check nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### If the frontend doesn't load:
1. Check PM2 status: `pm2 status`
2. Check frontend logs: `pm2 logs story-weaver-frontend`
3. Ensure port 3000 is not blocked

### If API calls fail:
1. Check backend logs: `pm2 logs story-weaver-backend`
2. Verify MongoDB is running: `sudo systemctl status mongod`
3. Check nginx configuration: `sudo nginx -t`

### If images don't generate:
1. Verify Gemini API key in backend/.env
2. Check backend logs for API errors

## Security Recommendations (Optional)
1. Set up SSL certificate with Let's Encrypt
2. Create a non-root user for the application
3. Configure MongoDB authentication
4. Set up regular backups

## Files created in this deployment:
- `deploy-system.sh` - System setup script
- `deploy-app.sh` - Application setup script  
- `nginx-config` - Nginx configuration
- `backend/.env.production` - Production environment variables
- `ecosystem.config.js` - PM2 process configuration (created during deployment)

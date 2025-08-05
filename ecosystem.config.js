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

module.exports = {
  apps: [
    {
      name: 'story-weaver-frontend',
      script: 'npm',
      args: 'run dev',
      cwd: '/workspaces/story_weaver_ai',
      env: {
        NODE_ENV: 'development'
      }
    },
    {
      name: 'story-weaver-backend',
      script: 'npm',
      args: 'run dev:backend',
      cwd: '/workspaces/story_weaver_ai',
      env: {
        NODE_ENV: 'development'
      }
    }
  ]
};

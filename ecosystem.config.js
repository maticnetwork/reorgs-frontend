module.exports = {
    apps: [
        {
          name: 'App',
          script: 'serve',
          autorestart: true,
          env: {
            PM2_SERVE_PATH: 'build',
            PM2_SERVE_PORT: 3000,
            PM2_SERVE_SPA: 'true',
            PM2_SERVE_HOMEPAGE: '/index.html'
          }
        },
    ]
  }
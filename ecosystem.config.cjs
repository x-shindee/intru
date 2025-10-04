module.exports = {
  apps: [
    {
      name: 'x-intru-ecommerce',
      script: 'npx',
      args: 'wrangler pages dev dist --d1=x-intru-production --local --ip 0.0.0.0 --port 3000',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      log_file: './logs/combined.log',
      out_file: './logs/out.log', 
      error_file: './logs/error.log',
      time: true
    }
  ]
}
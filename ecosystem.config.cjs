module.exports = {
  apps: [
    {
      name: 'logiciel-de-gestion-scolaire',
      script: 'src/index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};

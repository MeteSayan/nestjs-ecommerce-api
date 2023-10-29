module.exports = {
    configName: 'defaultConfig',
    serverConfig: {
      port: 3200,
      secondServerPort: 3201,
      hsts: false,
    },
    dbConfig: {
      dbHost: '127.0.0.1',
      dbName: 'nestjs_ecommerce_api',
      dbPort: 5432,
      dbUser: 'postgres',
      dbPass: '',
    },
  };
  
const conn = require('knex')({
    client: 'mysql',
    connection: {
        host: 'localhost',
        user: 'micro',
        password: 'service',
        database: 'monolithic'
    }
  });

  const ret = conn.raw('select now()').then((item) =>{
      console.log(item[0])
  })

  module.exports = conn;
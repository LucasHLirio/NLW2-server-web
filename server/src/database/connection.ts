import knex from 'knex'; //usar SQL con JS
import path from 'path';

const database = knex({
  client:'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'database.sqlite')
  },
  useNullAsDefault: true,
});

export default database;
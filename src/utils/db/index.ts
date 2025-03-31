import knex from 'knex'

const DB = knex({
    client: 'sqlite3',
    connection: {
        filename: './test.db'
    },
    pool: {
        min: 2,
        max: 100
    },
    useNullAsDefault: true
})

export default DB

let mysql = require('mysql')
let connection = mysql.createConnection({
    host: '192.168.1.202',
    user: 'root',
    password: '123456',
    database: 'jira'
})

exports.mysql = callback => {
    connection.connect()

    console.log(connection)

    connection.query('SELECT 1 + 1 AS solution', (error, results, fields) => {
        if (error) throw error
        console.log('The solution is: ', results[0].solution)
    })

    connection.end()
}

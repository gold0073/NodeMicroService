console.log('--- PostgresDB STRART----');

/*   PostgresDB  */
const {Pool} = require('pg');
const pool =new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'park0070!',
    database: 'monolithic',
    port : '5432'
});



/*
//조회 테스트
const pg_query = 
` SELECT * FROM CONTENT CT 
INNER JOIN USERS U on U.user_id = CT.user_id 
ORDER BY CT.created_at DESC
`;

console.log("Query ==>",pg_query);

pool.connect();
pool.query(pg_query, (err,results) => {;
    if (err || results.rowCount == 0) {
        console.log("no data");
    } else {
        console.log(results.rows);
    }

    console.log(results.rowCount);
});
*/

var pg_query = 
` INSERT INTO CONTENT
(user_id,title,context,created_at,update_at)
values ($1, $2, $3,now(),null)`;
console.log("Query ==>" , pg_query);

//pool.query(pg_query , [params.user_id, params.title, params.context]
pool.query(pg_query , [1 , '제목', '내용']
, (error, results) => {
if (error) {
        console.log("Error ===>",error);
    }
    console.log("Create Sucess");
});          
pool.end();


//////////////////////////////////////////////////////////
/*   MiriaDB  
const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'micro',
    password: 'service',
    database: 'monolithic'
};

var connection = mysql.createConnection(conn);
connection.connect();

const m_query = 
` select * from content;
`;
console.log("Query ==>",m_query);

const response = '';

connection.query(m_query, (error, results)=> {;
    if (error || results.length == 0) {
        console.log("no data");
    } else {
        console.log(results);
    }
});

connection.end();
*/
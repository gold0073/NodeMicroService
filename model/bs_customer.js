
/*   MariaDB */
const mysql = require('mysql');
const conn = require("../config.js").maria_conn;

/**
 *  고객 관리의 각 기능별로 분기
*/
exports.onRequest = function (res, method, pathname, params, cb) {

    switch (method) {
        case "POST":
            return register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "GET":
            return inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "DELETE":
            return unregister(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        default:
            return process.nextTick(cb, res, null);
    }
}

/**
 * 고객 등록 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function register(method, pathname, params, cb) {  
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query("insert into customer(username, password) values('" + params.username + "',password('" + params.password + "'));", (error, results)=> {
        if (error) {
            response.errorcode = 1;
            response.errormessage = error;                
        }
        cb(response);
    });
   

    /*
    let image = '/image/' + params.filename;
    let name = params.name;
    let birthday = params.birthday;
    let gender = params.gender;
    let job = params.job;
    

    let sql = 'INSERT INTO CUSTOMER VALUES (null, ?, ?, ?, ?, ?, now(), 0)';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let birthday = req.body.birthday;
    let gender = req.body.gender;
    let job = req.body.job;

    let params = [image, name, birthday, gender, job];
    connection.query(sql, params,
        (err, results)=> {
            response.send(results);
        }
    )
    */

    connection.end();

}

/**
 * 고객 인증 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function inquiry(method, pathname, params, cb) {   
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };
    var connection = mysql.createConnection(conn);
    connection.connect();
    connection.query("select * from  customer", (error, results)=> {
        if (error || results.length == 0) {
            response.errorcode = 1;
            response.errormessage = error ? error : "no data";
        } else {
            response.results = results;
        }
        cb(response);
    });
    connection.end();
}

/**
 * 고객 탈퇴 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function unregister(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    if (params.username == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("delete from  customer where username = '" + params.username + "';", (error, results)=> {
            if (error) {
                response.errorcode = 1;
                response.errormessage = error;                
            }
            cb(response);
        });
        connection.end();
    }
}

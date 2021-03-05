
const mysql = require('mysql');
const conn = {
    host: 'localhost',
    user: 'micro',
    password: 'service',
    database: 'monolithic'
};

/**
 * Content 기능별로 분기
*/
exports.onRequest = function (res, method, pathname, params, cb) {

    console.log("OnRequest Method ==>", method);
    console.log("params.title ==>", params.act_type );

    switch (method) {
        case "POST":
            switch (params.act_type ) {
                case "cr_type":
                    return create_register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                case "up_type":
                    return update_register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
                case "del_type":
                    return unregister(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                default:
            }

            //return register(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "GET":
            return inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        case "DELETE":
            return unregister(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
        default:
            return process.nextTick(cb, res, null);
    }
}

/**
 * Content 등록 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function create_register(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    console.log("register method =>",method);

    if ( params.title == null || params.context == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();

        //신규작성
        var squery = " INSERT INTO CONTENT values (null,?, ?, ?,now(),null)";
        connection.query(squery , [params.user_id, params.title, params.context]
        , (error, results, fields) => {
        if (error) {
            response.errorcode = 1;
            response.errormessage = error;               
            }
            cb(response);
        });

        connection.end();
    }
}


/**
 * Content 수정 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function update_register(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    console.log("register method =>",method);

    if ( params.title == null || params.context == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();

         //업데이트
         var squery = " UPDATE CONTENT SET title = ?, context = ? WHERE content_id = ?;";
         connection.query(squery , [params.title, params.context, params.content_id]
         , (error, results, fields) => {
         if (error) {
             response.errorcode = 1;
             response.errormessage = error;               
             }
             cb(response);    
         });

        connection.end();
    }
}

function register(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    console.log("register method =>",method);

    if ( params.title == null || params.context == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();

        //신규작성
        if(params.content_id == null)
        {
            var squery = " INSERT INTO CONTENT values (null,?, ?, ?,now(),null)";
            connection.query(squery , [params.user_id, params.title, params.context]
            , (error, results, fields) => {
            if (error) {
                response.errorcode = 1;
                response.errormessage = error;               
                }
                cb(response);
            });
        }else
        {
            //업데이트
            var squery = " UPDATE CONTENT SET title = ?, context = ? WHERE content_id = ?;";
            connection.query(squery , [params.title, params.context, params.content_id]
            , (error, results, fields) => {
            if (error) {
                response.errorcode = 1;
                response.errormessage = error;               
                }
                cb(response);    
            });
        }
        connection.end();
    }
}

/**
 * Content 조회 기능
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

    console.log("content_id ==>",params.content_id);

    //전체리스트
    if (params.content_id ==null)
    {
        var squery = " SELECT * FROM CONTENT CT INNER JOIN USER U on U.user_id = CT.user_id ORDER BY CT.created_at DESC";

        console.log("Query ==>",squery);

        connection.query(squery, (error, results, fields) => {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.results = results;
            }
            cb(response);
        });
    }else{          //상세 뷰
        var squery = " SELECT * FROM CONTENT CT INNER JOIN USER U on U.user_id = CT.user_id WHERE CT.content_id = ?";
        console.log("Query ==>",squery);

        connection.query(squery,[params.content_id] ,(error, results, fields) => {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.results = results;
            }
            cb(response);
        });
    }
    
    connection.end();
    
}

/**
 * Content 삭제 기능
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

    if (params.content_id == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        var connection = mysql.createConnection(conn);
        connection.connect();
        connection.query("delete from content where content_id = ?"
            , [params.content_id]
            , (error, results, fields) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
        });
        connection.end();
    }
}

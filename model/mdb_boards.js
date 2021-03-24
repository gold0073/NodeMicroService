

/*   MariaDB */
const mysql = require('mysql');
const conn = require("../config.js").maria_conn;

/**
 * Content 기능별로 분기
*/
exports.onRequest = function (res, method, pathname, params, cb) {

    console.log("OnRequest Method ==>", method);
    console.log("params.act_type ==>", params.act_type );

    switch (method) {
        case "POST":
            //return fn_content_create(method, pathname, params, (response) => { process.nextTick(cb, res, response); });

            switch (params.act_type) {
                case "content_create":
                    return fn_content_create(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                case "content_update":
                    return fn_content_update(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
                case "content_delete":
                    return fn_content_delete(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                default:
            }
        case "PUT":  
            return fn_content_update(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
        case "GET":
            switch (params.act_type) {
                case "content_inquery":
                    return fn_content_inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                default:
                    return fn_content_inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
            }    
        case "DELETE":
            return fn_content_delete(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
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
function fn_content_create(method, pathname, params, cb) {
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
        var squery = " INSERT INTO BOARD values (null,?, ?, ?,now(),null)";
        console.log("Query ==>" , squery);

        connection.query(squery , [params.user_id, params.title, params.context]
        , (error, results)=> {
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
function fn_content_update(method, pathname, params, cb) {
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
         var squery = " UPDATE BOARD SET title = ?, context = ? WHERE content_id = ?;";
         console.log("Query ==>" , squery);

         connection.query(squery , [params.title, params.context, params.content_id]
         , (error, results)=> {
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
 * Content 조회 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function fn_content_inquiry(method, pathname, params, cb) {
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
        const squery = 
        ` SELECT * FROM BOARD CT 
          INNER JOIN USER U on U.user_id = CT.user_id 
          ORDER BY CT.created_at DESC
        `;
        console.log("Query ==>",squery);

        connection.query(squery, (error, results)=> {
            if (error || results.length == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
            } else {
                response.results = results;
            }
            cb(response);
        });
    }else{          //상세 뷰
        var squery = 
        ` SELECT * FROM BOARD CT 
        INNER JOIN USER U on U.user_id = CT.user_id 
        WHERE CT.content_id = ?`;
        console.log("Query ==>",squery);

        connection.query(squery,[params.content_id] ,(error, results)=> {
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
function fn_content_delete(method, pathname, params, cb) {
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

        const squery = `delete from BOARD where content_id = ?`;
        console.log("Query ==>" , squery);

        connection.query(squery
            , [params.content_id]
            , (error, results)=> {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
        });
        connection.end();
    }
}


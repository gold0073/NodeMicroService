
/*   PostgresDB  */
const {Pool} = require('pg');
const pool =new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'park0070!',
    database: 'monolithic',
    port : '5432'
});

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
                case "comment_create":
                    return fn_comment_create(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                case "sub_comment_create":
                    return fn_sub_comment_create(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                case "comment_update":
                    return fn_comment_update(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
                //case "comment_delete":
                //    return fn_comment_delete(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
                default:
            }
        case "PUT":  
            return fn_content_update(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
        case "GET":
            switch (params.act_type) {
                case "content_inquery":
                    return fn_content_inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });
                case "comment_inquery":
                    return fn_comment_inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });    
                case "sub_comment_inquery":
                    return fn_sub_comment_inquiry(method, pathname, params, (response) => { process.nextTick(cb, res, response); });        
                default:
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

        var pg_query = 
        ` INSERT INTO CONTENT
        (user_id,title,context,created_at,update_at)
        values ($1, $2, $3,now(),null)`;
        console.log("Query ==>" , pg_query);

        pool.query(pg_query , [params.user_id, params.title, params.context]
        , (error, results) => {
        if (error) {
                console.log("Error ===>",error);
            }
            console.log("Create Sucess");
            cb(response);
        });          

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
        
         //업데이트
         var pg_query = " UPDATE CONTENT SET title = $1, context = $2 WHERE content_id = $3;";
         console.log("Query ==>" , pg_query);

         pool.query(pg_query , [params.title, params.context, params.content_id]
         , (error, results) => {
         if (error) {
             response.errorcode = 1;
             response.errormessage = error;               
             }
             cb(response);    
         });

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

    console.log("content_id ==>",params.content_id);

    //전체리스트
    if (params.content_id ==null)
    {
        const pg_query = 
        ` SELECT * FROM CONTENT CT 
          INNER JOIN USERS U on U.user_id = CT.user_id 
          ORDER BY CT.created_at DESC
        `;
        console.log("Query ==>",pg_query);

        pool.query(pg_query, (error, results) => {
            if (error || results.rowCount == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
                console.log("Data ===>","No data");
            } else {
                response.results = results.rows;
            }
            cb(response);
        });
    }else{          //상세 뷰
        var pg_query = 
        ` SELECT * FROM CONTENT CT 
        INNER JOIN USERS U on U.user_id = CT.user_id 
        WHERE CT.content_id = $1`;
        console.log("Query ==>",pg_query);

        pool.query(pg_query,[params.content_id] ,(error, results) => {
            if (error || results.rowCount == 0) {
                response.errorcode = 1;
                response.errormessage = error ? error : "no data";
                console.log("Data ===>","No data");
            } else {
                response.results = results.rows;
            }
            cb(response);
        });
    }
    
    
    
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

        const pg_query = `delete from content where content_id = $1`;
        console.log("Query ==>" , pg_query);

        pool.query(pg_query
            , [params.content_id]
            , (error, results) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
        });
        
    }
}


/**
 * Comment 등록 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function fn_comment_create(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    console.log("register method =>",method);

    if ( params.content_id == null || params.context == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        
        

        //신규작성
        var pg_query = 
        ` INSERT INTO COMMENT
           ( user_id, content_id, context, created_at, updated_at) 
            values ($1, $2, $3 ,now(),null)`;
        console.log("Query ==>" , pg_query);

        pool.query(pg_query , [params.user_id, params.content_id, params.context]
        , (error, results) => {
        if (error) {
            response.errorcode = 1;
            response.errormessage = error;               
            }
            cb(response);
        });

        
    }
}

function fn_sub_comment_create(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    console.log("register method =>",method);

    if ( params.comment_id == null || params.context == null) {
        response.errorcode = 1;
        response.errormessage = "Invalid Parameters";
        cb(response);
    } else {
        
        

        //신규작성
        var pg_query = 
        ` INSERT INTO SUB_COMMENT 
            (user_id, comment_id, context, created_at, updated_at)
            values ($1, $2, $3, now(), null) `;
        console.log("Query ==>" , pg_query);

        pool.query(pg_query , [params.user_id, params.comment_id, params.context]
        , (error, results) => {
        if (error) {
            response.errorcode = 1;
            response.errormessage = error;               
            }
            cb(response);
        });

        
    }
}


/**
 * comment 수정 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function fn_comment_update(method, pathname, params, cb) {
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
        
        

         //업데이트
         var pg_query = ` UPDATE CONTENT SET title = $1, context = $2 WHERE content_id = $3;`;
         console.log("Query ==>" , pg_query);

         pool.query(pg_query , [params.title, params.context, params.content_id]
         , (error, results) => {
         if (error) {
             response.errorcode = 1;
             response.errormessage = error;               
             }
             cb(response);    
         });

        
    }
}


/**
 * comment 조회 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
function fn_comment_inquiry(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    
    

    console.log("content_id ==>",params.content_id);

    //전체리스트
    const pg_query = ` SELECT * FROM COMMENT CM
        INNER JOIN USERS U on U.user_id = CM.user_id
        WHERE CM.content_id = $1`;
    console.log("Query ==>",pg_query);

    pool.query(pg_query,[params.content_id] ,(error, results) => {
        if (error || results.rowCount == 0) {
            response.errorcode = 1;
            response.errormessage = error ? error : "no data";
            console.log("Data ===>","No data");
        } else {
            response.results = results.rows;
        }
        cb(response);
    });
    
    
    
}

function fn_sub_comment_inquiry(method, pathname, params, cb) {
    var response = {
        key: params.key,
        errorcode: 0,
        errormessage: "success"
    };

    
    

    console.log("comment_id ==>",params.comment_id);

    //전체리스트
    const pg_query = `SELECT * FROM SUB_COMMENT SCM
    INNER JOIN USERS U on U.user_id = SCM.user_id
    WHERE comment_id = $1`;
    console.log("Query ==>",pg_query);

    pool.query(pg_query,[params.comment_id] ,(error, results) => {
        if (error || results.rowCount == 0) {
            response.errorcode = 1;
            response.errormessage = error ? error : "no data";
            console.log("Data ===>","No data");
        } else {
            response.results = results.rows;
        }
        cb(response);
    });
    
    
    
}

/**
 * comment 삭제 기능
 * @param method    메서드
 * @param pathname  URI
 * @param params    입력 파라미터
 * @param cb        콜백
 */
/*
function fn_comment_delete(method, pathname, params, cb) {
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
        
        
        pool.query("delete from content where content_id = $1"
            , [params.content_id]
            , (error, results) => {
                if (error) {
                    response.errorcode = 1;
                    response.errormessage = error;
                }
                cb(response);
        });
        
    }
}
*/
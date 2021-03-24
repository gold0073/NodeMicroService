
'use strict';

const tcpServer = require('../tcpServer.js');

// 비즈니스로직 파일 참조
const business = require('../model/mdb_contents.js');

// Server클래스 참조
class mariaDb_contents extends tcpServer{
    constructor() {
        
        super("mariaDb_contents"                                                     // 부cd..모 클래스 생성자 호출
            , process.argv[2] ? Number(process.argv[2]) : 9040
            , ["POST/mdb_contents", "GET/mdb_contents", "DELETE/mdb_contents"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {            // Distributor 연결
            console.log("Distributor Notification", data);
        });
    }
    
    // 클라이언트 요청에 따른 비즈니스로직 호출
    onRead(socket, data) {

        console.log("data.method ==>",data.method);

        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

new mariaDb_contents();                                                              // 인스턴스 생성

'use strict'

const business = require('../business/bs_goods');
const serverjs = require('../server.js');

class goods extends serverjs{
    constructor() {
        super("goods"                                                   // 부모 클래스 생성자 호출
            , process.argv[2] ? Number(process.argv[2]) : 9010
            , ["POST/goods", "GET/goods", "DELETE/goods"]
        );

        this.connectToDistributor("127.0.0.1", 9000, (data) => {        // Distributor 연결
            console.log("Distributor Notification", data);
        });
    }

    // 클라이언트 요청에 따른 비즈니스로직 호출
    onRead(socket, data) {
        console.log("onRead", socket.remoteAddress, socket.remotePort, data);
        business.onRequest(socket, data.method, data.uri, data.params, (s, packet) => {
            socket.write(JSON.stringify(packet) + '¶');
        });
    }
}

new goods();

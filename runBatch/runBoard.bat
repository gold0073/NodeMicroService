@echo off
START "distributor" node ../distributor.js
START "gate" node ../gate.js

START "MicroService_PostgreDb_Board" node ./../microService/ms_pgdb_contents.js

START "Microservice_boards" node ./../microService/ms_mdb_boards.js

START "Microservice_boards_comment" node ./../microService/ms_mdb_boards_comments.js

START "Microservice_contents" node ./../microService/ms_mdb_contents.js

START "customer" node ./../microService/ms_customer.js






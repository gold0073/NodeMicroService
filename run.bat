@echo off
START "distributor" node distributor.js
START "gate" node gate.js
START "goods" node ./microService/ms_goods.js
START "members" node ./microService/ms_members.js
START "purchases" node ./microService/ms_purchases.js
START "contents" node ./microService/ms_contents.js



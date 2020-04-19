/**
 * proxy.js
 * Responds incoming requests by sending to another user API/app that will provide response
 * Adapter acts as a proxy
 */

 const Req = require('../../_classes/request');

 let fun = {};

    fun.getProperty = async function(oid, pid, url, endpoint){
        try{
            let request = new Req();
            request.setUri(url, '/get');
            request.setBody({oid: oid, pid: pid});
            let result = await request.send();
            return Promise.resolve(result)
        } catch(err) {
            return Promise.reject(err);
        }
    }

    fun.setProperty = async function(oid, pid){
        try{
            let request = new Req();
            request.setUri(url, '/set');
            request.setBody({oid: oid, pid: pid});
            let result = await request.send();
            return Promise.resolve(result)
        } catch(err) {
            return Promise.reject(err);
        }
    }

 module.exports = fun;
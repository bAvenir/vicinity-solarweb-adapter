/**
 * dummy.js
 * Responds incoming requests with a dummy payload
 * Testing
 */

 let fun = {};

 fun.getProperty = (oid, pid)=>{return {value: Math.random()*100, property: pid, oid: oid}}
 fun.setProperty = (oid, pid)=>{return {value: true, property: pid, oid: oid}}

 module.exports = fun;
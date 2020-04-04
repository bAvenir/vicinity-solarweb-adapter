const requestmock = require('./_mocks/request');
const request = require('../_classes/request');
const Log = require('../_classes/logger');
let logger = new Log();

describe("request.js", () => {
    it("Check request misses uri", () => {
        let req = new request();
        return req.send()
        // .then(response => expect(response).toEqual(''))
        .catch(err => {
            expect(err).toEqual('Missing URI');
        });
    });
    it("Success sending request", () => {
        return requestmock.send("success", "http://")
        .then(response => {
                expect(response.msg).toEqual('success');
            } 
        );
    });
});
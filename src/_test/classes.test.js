const resp = require("../_classes/response");

describe("response.js", () => {
    it("Check response is an object", () => {
        expect(new resp(200, "Hello")).toMatchObject({
            error: expect.any(Boolean),
            status: expect.any(Number),
            message: expect.any(String),
            success: expect.any(Boolean)
      })
    });
});
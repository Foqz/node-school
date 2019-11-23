const except = require('chai');
const describe = require("mocha");

describe("Sample test", () => {
   it("runs correctly", () =>{
       except(true).to.be.true;
       except(1+2).to.be.equal(3);
   })
});
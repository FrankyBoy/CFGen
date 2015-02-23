//var jasmine = require('jasmine');
var calcCF = require('../lib/calc.js');

describe('CF-Calculation', function () {
    it('should work in the basic case', function () {
        var result = calcCF.calculateCF(
            {
                firstname: "Riccardo",
                lastname: "Riccardo",
                birthcountry: "X100",
                gender: 0,
                dateofbirth: new Date(1999, 0, 5)
            });
        
        expect(result).toBe("RCCRCR99A05X100A");
    });


});
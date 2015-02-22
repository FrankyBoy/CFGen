//var jasmine = require('jasmine');
var calcCF = require('../lib/calc.js');

describe('Country mapping', function () {
    var countries = {
        "Austria": "X100",
        "Belgium": "X101",
        "France": "X102"
    }

    it('should map an existing country', function () {
        var result = calcCF.calculateCF(
            {
                firstname: "Riccardo",
                lastname: "Riccardo",
                birthcountry: "Austria",
                gender: 0,
                dateofbirth: new Date(1999, 0, 5)
            }, {countries: countries});
        
        expect(result).toBe("RCCRCR99A05X100A");
    });
    
    it('should not map if country is already code', function () {
        var result = calcCF.calculateCF(
            {
                firstname: "Riccardo",
                lastname: "Riccardo",
                birthcountry: "X100",
                gender: 0,
                dateofbirth: new Date(1999, 0, 5)
            }, { countries: countries });
        
        expect(result).toBe("RCCRCR99A05X100A");
    });

    it('should throw if country not in map', function() {
        var calculate = function() {
            calcCF.calculateCF(
            {
                firstname: "Riccardo",
                lastname: "Riccardo",
                birthcountry: "INVALID",
                gender: 0,
                dateofbirth: new Date(1999, 0, 5)
            }, { countries: countries });
        }
        
        expect(calculate).toThrow("Could not map location data");
    });
    
    it('should throw if country no map supplied and map needed', function () {
        var calculate = function () {
            calcCF.calculateCF(
                {
                    firstname: "Riccardo",
                    lastname: "Riccardo",
                    birthcountry: "Austria",
                    gender: 0,
                    dateofbirth: new Date(1999, 0, 5)
                });
        }
        
        expect(calculate).toThrow("Location requires mapping and no map supplied");
    });
});
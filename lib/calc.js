var strings = require('./strings.js');

var assert = function (data, exceptionstring) {
    if (data === undefined || data === null || data === false) {
        throw exceptionstring;
    }
}

var genders = {
    male: 0,
    female: 40
};

var checkGender = function(gender) {
    var exists = false;
    for (var key in genders) {
        if (genders[key] === gender) {
            exists = true;
        }
    }
    return exists;
}

var mapLocation = function (location, map) {
    // check if location is already a code
    if (location.match(/[A-Z]\d{3}/)) {
        return location;
    }
    
    assert(map, "Location requires mapping and no map supplied");
    location = map[location];
    assert(location, "Could not map location data");
    return location;
}

var calculateCF = function (user, maps) {
    maps = maps || {};
    assert(user, "Missing user data");
    assert(user.firstname, "Missing firstname");
    assert(user.lastname, "Missing lastname");
    assert(user.birthcountry, "Missing birthcountry");
    assert(user.dateofbirth, "Missing dateofbirth");
    assert(checkGender(user.gender), "Missing or invalid gender");
    
    // if we are in IT, the birthcity is the location component of the codice,
    // if we are not in IT, it is the country
    var locationcomponent;
    if (user.birthcountry.toUpperCase() === "IT") {
        locationcomponent = mapLocation(user.birthcity, maps.cities);
    } else {
        locationcomponent = mapLocation(user.birthcountry, maps.countries);
    }

    var lastNameCode = getNameCode(user.lastname, false);
    var firstNameCode = getNameCode(user.firstname, true);
    var year = user.dateofbirth.getFullYear() % 100;
    var month = ["A", "B", "C", "D", "E", "H", "L", "M", "P", "R", "S", "T"][user.dateofbirth.getMonth()];
    var day = user.dateofbirth.getDate() + user.gender;

    var baseCF = lastNameCode + firstNameCode + strings.padLeft(year, "0", 2) + month + strings.padLeft(day, "0", 2) + locationcomponent;
    return baseCF + getCheckSum(baseCF);
}

var getNameCode = function(name, isFirstName) {
    name = strings.sanitize(name);
    var split = strings.separateConsonantsAndVowels(name);
    
    // "for firstname: If the name has more than three consonants, the 2nd is skipped"
    if (isFirstName && split.consonants.length > 3){
        split.consonants = split.consonants.slice(0, 1) + split.consonants.slice(2, name.length);
    }
    
    name = split.consonants + split.vowels;
    return (name + "XXX").slice(0, 3);
}

var getCheckSum = function(baseCF) {
    var oddCharCodes = [ 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23 ];
    var sum = 0;
    var asciiIndexA = 'A'.charCodeAt(0);

    for (var i = 0; i < baseCF.Length; i++) {
        var c = baseCF[i];
        var digit = parseInt(c);
        var lookupId = c.charCodeAt(0) - asciiIndexA;

        // odd/even is reversed to wikipedia because i is 0-based and they are 1-based
        switch (i % 2) {
        case 0:
            // for odd numbers -> lookup table
            sum += !isNaN(digit) ? oddCharCodes[digit] : oddCharCodes[lookupId];
            break;

        case 1:
            // for even numbers -> use directly
            sum += !isNaN(digit) ? digit : lookupId;
            break;
        }
    }

    return String.fromCharCode((sum % 26) + asciiIndexA);
};

module.exports.calculateCF = calculateCF;
module.exports.genders = genders;
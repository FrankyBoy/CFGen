var remove_diacritics = require('diacritics').remove;
var ld = require('lodash');

var transliterationMap = {
    "Ä": "AE",
    "Æ": "AE",
    "Ö": "OE",
    "Œ": "OE",
    "Ü": "UE",
    "ß": "SS"
};

module.exports.sanitize = function (input) {
    input = input.trim().toUpperCase().replace(' ', '');
    
    ld.forEach(transliterationMap, function (val, key) {
        input = input.replace(key, transliterationMap[key]);
    });

    return remove_diacritics(input);
};

module.exports.separateConsonantsAndVowels = function(input) {
    input = input.toUpperCase();
    var allVowels = ['A', 'E', 'I', 'O', 'U'];
    var result = { consonants: "", vowels: "" };

    ld.forEach(input, function(c) {
        if (ld.includes(allVowels, c)) {
            result.vowels = result.vowels + c;
        } else {
            result.consonants = result.consonants + c;
        }
    });
    return result;
}

module.exports.padLeft = function (string, padding, length) {
    var count = Math.ceil(length / padding.length);
    padding = ld.repeat(padding, count);

    return (padding + string.toString()).slice(-length);
};

module.exports.padRight = function (string, padding, length) {
    var count = Math.ceil(length / padding.length);
    padding = ld.repeat(padding, count);
    
    return (string.toString() + padding).slice(0, length);
};
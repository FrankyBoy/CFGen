var remove_diacritics = require('diacritics').remove;

var transliterationMap = {
    "Ä": "AE",
    "Æ": "AE",
    "Ö": "OE",
    "Œ": "OE",
    "Ü": "UE",
    "ß": "SS"
};

// basic idea from lodash
var repeat = function (string, n) {
    var result = '';
    
    do {
        if (n % 2) {
            result += string;
        }
        n = Math.floor(n / 2);
        string += string;
    } while (n);
    
    return result;
}

module.exports.sanitize = function (input) {
    input = input.trim().toUpperCase().replace(' ', '');
    
    for (var key in transliterationMap) {
        input = input.replace(key, transliterationMap[key]);
    }

    return remove_diacritics(input);
};

module.exports.separateConsonantsAndVowels = function(input) {
    input = input.toUpperCase();
    var allVowels = ['A', 'E', 'I', 'O', 'U'];
    var result = { consonants: "", vowels: "" };
    
    for(var i = 0; i < input.length; i++ ) {
        var c = input[i];
        if (allVowels.indexOf(c) > -1) {
            result.vowels = result.vowels + c;
        } else {
            result.consonants = result.consonants + c;
        }
    };
    return result;
}

module.exports.padLeft = function (string, padding, length) {
    var count = Math.ceil(length / padding.length);
    padding = repeat(padding, count);

    return (padding + string.toString()).slice(-length);
};

module.exports.padRight = function (string, padding, length) {
    var count = Math.ceil(length / padding.length);
    padding = repeat(padding, count);
    
    return (string.toString() + padding).slice(0, length);
};

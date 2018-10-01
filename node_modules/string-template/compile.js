var template = require("./index")

var whitespaceRegex = /["'\\\n\r\u2028\u2029]/g
var nargs = /\{[0-9a-zA-Z]+\}/g

var replaceTemplate =
"    var args\n" +
"    var result\n" +
"    if (arguments.length === 1 && typeof arguments[0] === \"object\") {\n" +
"        args = arguments[0]\n" +
"    } else {\n" +
"        args = arguments" +
"    }\n\n" +
"    if (!args || !(\"hasOwnProperty\" in args)) {\n" +
"       args = {}\n" +
"    }\n\n" +
"    return {0}"

var literalTemplate = "\"{0}\""
var argTemplate = "(result = args.hasOwnProperty(\"{0}\") ? " +
    "args[\"{0}\"] : null, \n        " +
    "(result === null || result === undefined) ? \"\" : result)"

module.exports = compile

function compile(string, inline) {
    var replacements = string.match(nargs)
    var interleave = string.split(nargs)
    var replace = []

    for (var i = 0; i < interleave.length; i++) {
        var current = interleave[i];
        var replacement = replacements[i];
        var escapeLeft = current.charAt(current.length - 1)
        var escapeRight = (interleave[i + 1] || "").charAt(0)

        if (replacement) {
            replacement = replacement.substring(1, replacement.length - 1)
        }

        if (escapeLeft === "{" && escapeRight === "}") {
            replace.push(current + replacement)
        } else {
            replace.push(current);
            if (replacement) {
                replace.push({ name: replacement })
            }
        }
    }

    var prev = [""]

    for (var j = 0; j < replace.length; j++) {
        var curr = replace[j]

        if (String(curr) === curr) {
            var top = prev[prev.length - 1]

            if (String(top) === top) {
                prev[prev.length - 1] = top + curr
            } else {
                prev.push(curr)
            }
        } else {
            prev.push(curr)
        }
    }

    replace = prev

    if (inline) {
        for (var k = 0; k < replace.length; k++) {
            var token = replace[k]

            if (String(token) === token) {
                replace[k] = template(literalTemplate, escape(token))
            } else {
                replace[k] = template(argTemplate, escape(token.name))
            }
        }

        var replaceCode = replace.join(" +\n    ")
        var compiledSource = template(replaceTemplate, replaceCode)
        return new Function(compiledSource)
    }

    return function template() {
        var args

        if (arguments.length === 1 && typeof arguments[0] === "object") {
            args = arguments[0]
        } else {
            args = arguments
        }

        if (!args || !("hasOwnProperty" in args)) {
            args = {}
        }

        var result = []

        for (var i = 0; i < replace.length; i++) {
            if (i % 2 === 0) {
                result.push(replace[i])
            } else {
                var argName = replace[i].name
                var arg = args.hasOwnProperty(argName) ? args[argName] : null
                if (arg !== null || arg !== undefined) {
                    result.push(arg)
                }
            }
        }

        return result.join("")
    }
}

function escape(string) {
    string = '' + string;

    return string.replace(whitespaceRegex, escapedWhitespace);
}

function escapedWhitespace(character) {
    // Escape all characters not included in SingleStringCharacters and
    // DoubleStringCharacters on
    // http://www.ecma-international.org/ecma-262/5.1/#sec-7.8.4
    switch (character) {
        case '"':
        case "'":
        case '\\':
            return '\\' + character
        // Four possible LineTerminator characters need to be escaped:
        case '\n':
            return '\\n'
        case '\r':
            return '\\r'
        case '\u2028':
            return '\\u2028'
        case '\u2029':
            return '\\u2029'
    }
}

module.exports = OptionError

function OptionError(message, options) {
    var result = new Error()

    Object.defineProperty(result, "type", {
        value: result.type,
        enumerable: true,
        writable: true,
        configurable: true
    })

    result.option = options || null
    result.message = message
    result.type = "OptionError"

    return result
}


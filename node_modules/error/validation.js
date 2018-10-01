module.exports = ValidationError

function ValidationError(errors) {
    var result = new Error()

    Object.defineProperty(result, "type", {
        value: result.type,
        enumerable: true,
        writable: true,
        configurable: true
    })

    result.errors = errors
    result.message = errors[0].message
    result.type = "ValidationError"

    return result
}


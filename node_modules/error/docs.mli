type OptionError<T> := {
    option: T | null,
    message: String,
    type: "OptionError"
}

type TypedError<T> := {
    message: String,
    type: T
}

type ValidationError := {
    errors: Array<Error>,
    message: String,
    type: "ValidationError"
}

error/option := (String, T) => OptionError<T>

error/typed := (args: {
    message: String,
    type: String,
    name?: String
}) => (opts: Object) => TypedError<String>

error/validation := (Array<Error>) => ValidationError

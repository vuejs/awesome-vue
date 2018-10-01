## Migration

## Version 7

The `message` parameter to `TypedError` is now
required. Previously `message` was optional
for `TypedError`.

## Version 6

The `WrappedError` class now exposes the error that
is being wrapped as a `cause` field instead of an
`original` field.

The following properties have been reserver on the
wrapped error class: `cause`, `fullType`, `causeMessage`

## Version 5

There were no breaking changes...

## Version 4

The `TypedError` function now has mandatory arguments.
The `type` and `message` arguments for `TypedError`
are required.

## Version 3

The `TypedError` class now uses `string-template` for
message formatting.

Previously:

```js
var FooError = TypedError({
  type: 'foo.x'
  message: 'Got an error %s'
});

FooError('Oops');
```

Currently:

```js
var FooError = TypedError({
  type: 'foo.x',
  message: 'Got an error {ctx}',
  ctx: null
});

FooError({ ctx: 'Oops' });
```

## Version 2

Original version

# History

## v1.3.4 2018 January 31
- Updated base files

## v1.3.3 2016 November 4
- Properly add node 0.8 support

## v1.3.2 2016 November 4
- Added node 0.8 support

## v1.3.1 2016 October 11
- Fixed failure to load editions that had the edition directory within the edition entry
  - Thanks to [Jordan Harband](https://github.com/ljharb) for [issue #20](https://github.com/bevry/editions/issues/20)

## v1.3.0 2016 October 11
- Added support for `EDITIONS_SYNTAX_BLACKLIST` environment variable
  - Thanks to [Damon Maria](https://github.com/damonmaria) for [issue #10](https://github.com/bevry/editions/issues/10)
- Dropped need for `DEBUG_BEVRY_EDITIONS` as failures will not output all the necessary debugging information

## v1.2.1 2016 October 10
- Change `esnext` skip from v8 engines < 4 to node engines < 0.12

## v1.2.0 2016 October 10
- Skip syntaxes that require preprocessors
- Skip `import` syntax, as the `module` field inside `package.json` skips the autoloader if supported
- Skip `esnext` syntax on v8 engines < 4

## v1.1.2 2016 June 16
- Parent errors are now displayed in a more sensible way

## v1.1.1 2016 March 20
- Errors and debug messages are now more useful
  - Closes https://github.com/bevry/editions/issues/5

## v1.1.0 2016 March 20
- Added support for custom entry point overrides
- Debugging goes to `console.error` (stderr) rather than `console.log` (stdout)
  - Closes https://github.com/bevry/editions/issues/2
- Added tests
  - Closes https://github.com/bevry/editions/issues/4

## v1.0.1 2016 March 9
- Initial release

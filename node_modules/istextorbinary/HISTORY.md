# History

## v2.2.1 2018 January 24
- Added missing development dependency

## v2.2.0 2018 January 24
- Fixed invalid `package.json` error
    - Thanks to [Sean](https://github.com/AlbinoDrought) for [pull request #8](https://github.com/bevry/istextorbinary/pull/8)
- Updated base files

## v2.1.0 2016 May 10
- Support v2 of [textextensions](https://github.com/bevry/textextensions) and [binaryextensions](https://github.com/bevry/binaryextensions)

## v2.0.0 2016 May 2
- Converted from CoffeeScript to JavaScript
- Fixed `getEncoding` and `isText` not handling errors correctly
- Right-most extension takes preference, instead of left-most
  - Thanks to [Ian Sibner](https://github.com/sibnerian) for [pull request #5](https://github.com/bevry/istextorbinary/pull/5)
  - **This has bumped the major** as it changes the output result, which could potentially break some apps, despite the API remaining exactly the same

## v1.0.2 2015 January 16
- Fixed build
- Added test for text files

## v1.0.1 2015 January 16
- Cleaned up thanks to [Shunnosuke Watanabe](https://github.com/shinnn) for [pull request #2](https://github.com/bevry/istextorbinary/pull/2)

## v1.0.0 2013 October 25
- Initial release extracted from [balupton/bal-util](https://github.com/balupton/bal-util/blob/6501d51bc0244fce3781fc0150136f7493099237/src/lib/paths.coffee#L100-L201)

var isStream = require('./isStream');

module.exports = function(stream) {
  if (!isStream(stream)) {
    return;
  }

  var streamType = stream.constructor.name;
  // Avoid StreamStream
  if (streamType === 'Stream') {
    streamType = '';
  }

  return '<' + streamType + 'Stream>';
};

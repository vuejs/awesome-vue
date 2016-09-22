'use strict';

var fs = require('fs'),
    https = require('https');

var readme = fs.readFileSync('README.md', {encoding: 'utf8'});

var regex = /\[\**([^\]]*)★[^\]]*\**\]\((https?:\/\/github.com\/([A-z0-9\-]+\/[A-z0-9\-]+))\)/g

var stars = {};
var promises = [];

var agent = new https.Agent({maxSockets: 1, keepAlive: true});
var requestOptions = {
  hostname: 'api.github.com',
  auth: process.env['GITHUB_USERNAME'] + ':' + process.env['GITHUB_TOKEN'],
  headers: {'User-Agent': process.env['GITHUB_USERNAME']},
  method: 'GET',
  agent: agent
};
var match;
while ((match = regex.exec(readme)) !== null) {
  var promise = new Promise(function(resolve, reject) {
    var repo = match[3].slice();
    var options = Object.assign({}, requestOptions);
    options.path = '/repos/' + repo;
    https.request(options, function(res) {
      if (res.statusCode != 200) {
        resolve();
        return;
      }

      var body = '';
      res.on('data', function(chunk) {
        body += chunk.toString('utf8');
      });
      res.on('end', function() {
        stars[repo] = JSON.parse(body).stargazers_count;
        console.log(repo + ' ' + stars[repo]);
        resolve();
      });
    }).on('error', function(err) {
      resolve();
    }).end();
  });
  promises.push(promise);
}

Promise.all(promises).then(function() {
  console.log('Writing README...');
  readme = readme.replace(regex, function(match, description, url, repo) {
    if (stars[repo] === undefined) { return match; }
  
    var text = '[';
  
    if (stars[repo] > 100) {
      text += '**';
    }
  
    text += description + "★" + stars[repo].toLocaleString();
  
    if (stars[repo] > 100) {
      text += '**';
    }
  
    text += '](' + url + ')';
  
    return text;
  });
  
  fs.writeFileSync('README.md', readme);
});

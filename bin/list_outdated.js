#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var gh = require('github-url-to-object')
var GitHubApi = require("github");

var githubUrlRegex = /https:\/\/github\.com\/[^ )]+/g

var github = initGithubApi('812ad10eda43f637dd3a098900870b36f6a94ddf');

var filePath = path.join(__dirname, '../README.md');

var lines = fs.readFileSync(
  filePath,
  {encoding: 'utf-8'}
).toString().split('\n');

var linesWithRepos = _.chain(lines)
  // store index along with lines
  .map(function(line, index, collection){
    return {
      content: line,
      index: index
    };
  })
  // only keep lines with github URLs
  .filter(function(line, index, collection) {
      var matches = line.content.match(githubUrlRegex);
      if (matches && matches.length) {
        line.matches = matches;
        return true;
      }
      return false;
  })
  // parse github URLs to objects and send API request
  .map(function(line){
    line.matches = _.chain(line.matches)
      .map(function (match) {
        return { match: match, info: gh(match) };
      })
      .filter(function(match){
        return match.info != null;
      })
      .map(function(match){
        var request = {
          owner: match.info.user,
          repo: match.info.repo,
          per_page: 1,page: 1
        };
        var range = new Date(new Date().setFullYear(new Date().getFullYear() - 2))
        github.repos.getCommits(request)
          .then(outdatedHandler(match.info, line.index, line.content, range))
          .catch(console.error);
        return match;
      }).value();
    return line;
  })
  .value();

function outdatedHandler(githubInfo, lineIndex, line, compareDate) {
  return function (response) {
    var lastCommitDate = new Date(response[0].commit.author.date);
    if(lastCommitDate < compareDate){
      console.log("The last commit of " + githubInfo.https_url + " was: " + lastCommitDate);
      console.log("line " + (lineIndex + 1) + ": " + line );
      console.log('\n');
    }
  };
}


function initGithubApi(token) {
  var github = new GitHubApi({
      debug: false,
      protocol: "https",
      host: "api.github.com",
      headers: {
          "user-agent": "awesome-vue-repo-checker"
      },
      timeout: 30000
  });

  // without auth token we can still query, but the rate limit is much lower
  if(token) {
    github.authenticate({
      type: "token",
      token: token
    })
  }

  return github;
}

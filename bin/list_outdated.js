#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const gh = require('github-url-to-object')
const GitHubApi = require("github");
const program = require('commander');

/**
 * Command line utility that can be used as an indicator to find repositories in README.md that are
 * not maintained anymore.
 *
 * The tool queries the Github API for the last commit date of the referenced repositories and
 * prints the date, line and line number of the ones older than some defined date.
 */
program
    .version('0.0.1')
    .usage('[options]')
    .option('--token [token]', 'Github token from https://github.com/settings/tokens')
    .option('--threshold [months]', 'The number of months to used as the threshold for outdated repositories. Defaults to 18.', parseInt)
    .parse(process.argv);

if(!program.token || program.token === true) {
  console.log("No Github token provided. To avoid hitting the rate limit, you need to generate a token at https://github.com/settings/tokens and provide it with the --token option.")
  console.log("Continuing without token.")
  program.token = null
}

let monthsAgo = 18;
if(program.threshold !== true && program.threshold){
  monthsAgo = program.threshold;
}
const thresholdDate = new Date(new Date().setMonth(new Date().getMonth() - monthsAgo))
console.log("Using " + thresholdDate + " as the threshold date.")

const githubUrlRegex = /https:\/\/github\.com\/[^ )]+/g
const filePath = path.join(__dirname, '../README.md');
const MONTHS_AGO = 18
const github = initGithubApi(program.token);

getLinesFromFile(filePath)
  .map(addIndexToLines)
  .filter(filterLinesForGithubUrls)
  .map(analyzeMatchesAndQueryApi);

function analyzeMatchesAndQueryApi(line){
  line.matches = line.matches
    .map(addGithubInfo)
    .filter(filterGithubInfoExists)
    .map(queryGithubApiForLastCommit(line));
  return line;
}

function queryGithubApiForLastCommit(line){
  return function(match){
    var request = {
      owner: match.info.user,
      repo: match.info.repo,
      per_page: 1,
      page: 1
    };
    github.repos.getCommits(request)
      .then(outdatedHandler(match.info, line.index, line.content, thresholdDate))
      .catch(handleApiError);
    return match;
  }
}

function handleApiError(error) {
  console.error('\n' + error);
  process.exit(1);
}

function addGithubInfo(match) {
  return { match: match, info: gh(match) };
}

function filterLinesForGithubUrls(line, index, collection) {
    var matches = line.content.match(githubUrlRegex);
    if (matches && matches.length) {
      line.matches = matches;
      return true;
    }
    return false;
}

function getLinesFromFile (filePath) {
  return fs.readFileSync(
    filePath,
    {encoding: 'utf-8'}
  ).toString().split('\n');
}

function outdatedHandler(githubInfo, lineIndex, line, thresholdDate) {
  return function (response) {
    const lastCommitDate = new Date(response[0].commit.author.date);
    if(lastCommitDate < thresholdDate){
      printOutdatedFind(githubInfo, lastCommitDate, lineIndex, line)
    }
  };
}

function initGithubApi(token) {
  const github = new GitHubApi({
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

function filterGithubInfoExists (match){
  return match.info != null;
}

function printOutdatedFind(githubInfo, lastCommitDate, lineIndex, line) {
  console.log("The last commit of " + githubInfo.https_url + " was: " + lastCommitDate);
  console.log("line " + (lineIndex + 1) + ": " + line );
  console.log('\n');
}

function addIndexToLines(line, index, collection){
  return {
    content: line,
    index: index
  };
}

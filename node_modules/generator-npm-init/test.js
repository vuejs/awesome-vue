'use strict'

const { execSync } = require('child_process')
const path = require('path')
const { readFileSync } = require('fs')
const assert = require('yeoman-assert')
const helpers = require('yeoman-test')

test('uses the right defaults on bare project', async () => {
  const dir = await runGenerator(null, null, null)

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: dir,
    version: '1.0.0',
    main: 'index.js',
    license: 'ISC',
    scripts: {
      test: 'echo \"Error: no test specified\" && exit 1'
    }
  })
})

test('uses prompt responses', async () => {
  await runGenerator(
    {
      name: 'foo',
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      keywords: 'foo bar baz qux',
      author: 'foobar',
      license: 'MIT',
      test: 'ava --verbose'
    })

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repository: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    scripts: {
      test: 'ava --verbose'
    }
  })
})

test('uses supplied defaults', async () => {
  await runGenerator(
    null,
    {
      name: 'foo',
      description: 'lorem ipsum dolor',
      version: '9.9.9',
      main: 'app.js',
      repo: 'foo/bar',
      keywords: [
        'foo',
        'bar',
        'baz',
        'qux'
      ],
      author: 'foobar',
      license: 'MIT',
      scripts: {
        start: 'do something'
      }
    })

  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repository: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
      start: 'do something'
    }
  })
})

test('respects skip-* options', async () => {
  await runGenerator(
    null,
    {
      'skip-name': true
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', { name: undefined, 'skip-name': undefined })
})

test('respects skip-test option', async () => {
  await runGenerator(
    null,
    {
      'skip-test': true
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', { scripts: { test: undefined } })
})

test('respects skip-test option but still includes script defaults', async () => {
  await runGenerator(
    null,
    {
      'skip-test': true,
      scripts: {
        start: 'webpack-dev-server'
      }
    })
  
  assert.file('package.json')

  assert.JSONFileContent('package.json', {
    scripts: {
      test: undefined,
      start: 'webpack-dev-server'
    }
  })
})

test('removes extraneous fields from package.json', async () => {
  await runGenerator(null, {
    name: 'foo',
    description: 'lorem ipsum dolor',
    version: '9.9.9',
    main: 'app.js',
    repo: 'foo/bar',
    keywords: [
      'foo',
      'bar',
      'baz',
      'qux'
    ],
    author: 'foobar',
    license: 'MIT',
    test: 'ava --verbose'
  })

  assert.file('package.json')

  const raw = readFileSync('package.json', 'utf8')
  const parsed = JSON.parse(raw)

  const junkFields = [
    'env',
    'resolved',
    'namespace',
    'argv',
    'repo',
    'test',
    '_'
  ]

  junkFields.forEach((field) => {
    assert.ok(!parsed.hasOwnProperty(field), `package.json contains ${field}`)
  })
})

test('infers repository field from git repo', async () => {
  await runGenerator(
    null,
    null,
    (dir) => {
      execSync('git init', { cwd: dir })
      execSync('git remote add origin https://example.com/foo.git', { cwd: dir })
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', {
    repository: {
      type: 'git',
      url: 'https://example.com/foo.git'
    }
  })
})

test('sets bugs and homepage for github repo', async () => {
  await runGenerator(
    null,
    null,
    (dir) => {
      execSync('git init', { cwd: dir })
      execSync('git remote add origin git+https://github.com/caseyWebb/generator-npm-init.git', { cwd: dir })
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', {
    repository: {
      type: 'git',
      url: 'git+https://github.com/caseyWebb/generator-npm-init.git'
    },
    bugs: {
      url: 'https://github.com/caseyWebb/generator-npm-init/issues'
    },
    homepage: 'https://github.com/caseyWebb/generator-npm-init#readme'
  })
})

test('git repository field inference doesn\'t break on no remote origin', async () => {
  await runGenerator(
    null,
    null,
    (dir) => {
      execSync('git init', { cwd: dir })
    })

  assert.file('package.json')
  assert.JSONFileContent('package.json', {
    repository: {
      type: 'git',
      url: ''
    }
  })
})

function runGenerator(prompts, opts, pre) {
  let basename

  return new Promise((resolve) => {
    helpers.run(path.join(__dirname, 'app'))
      .inTmpDir((dir) => {
        if (pre) {
          pre(dir)
        }
        basename = path.basename(dir)
      })
      .withOptions(opts || {})
      .withPrompts(prompts || {})
      .on('end', () =>
        resolve(basename))
  })
}

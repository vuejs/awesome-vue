import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import somebody from 'somebody'
import chalk from 'chalk'

const opts = {
  root: `${process.cwd()}/awesomeness`,
  output: `${process.cwd()}/app/site/dist/data.js`
}

const json = JSON.stringify(parseDir(opts.root).children)
fs.writeFile(opts.output, `window.data = ${json};`, {}, err => {
  if (err) {
    console.log(chalk.red(err))
    return
  }

  console.log(chalk.green(`Data generated at ${opts.output}.`))
})

function parseDir(filename) {
  if (filename[0] === '.') {
    return
  }

  const stats = fs.lstatSync(filename)
  const info = {
    name: path.basename(filename)
  }

  if (stats.isDirectory()) {
    info.type = 'group'
    info.children = fs.readdirSync(filename).map(child => {
      return parseDir(`${filename}/${child}`)
    })

    return info
  }

  if (stats.isFile() && path.extname(filename) === '.md') {
    info.type = 'item'
    info.content = yaml.safeLoad(fs.readFileSync(filename, 'utf8'))
    if (info.content.author) {
      info.content.author = somebody.parse(info.content.author)
    }
  }

  return info
}

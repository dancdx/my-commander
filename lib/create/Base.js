
const fs = require('fs')
const path = require('path')
const pathExists = require('path-exists')
const memFs = require('mem-fs')
const FileEditor = require('mem-fs-editor')

const wrench = require('../util/wrench')
const Util = require('../util')

class Base {
  constructor () {
    this.sharedFs = memFs.create()
    this.fs = FileEditor.create(this.sharedFs)
    this.sourceRoot(path.join(Util.getSimrPath()))
  }

  mkdir () {
    fs.mkdirSync.apply(fs, arguments)
  }

  // 资源根路径
  sourceRoot (rootPath) {
    if (typeof rootPath === 'string') {
      this._sourceRoot = path.resolve(rootPath)
    }
    if (!fs.existsSync(this._sourceRoot)) {
      this.mkdir(this._sourceRoot)
    }
    return this._sourceRoot
  }

  templatePath () {
    let filepath = path.join.apply(path, arguments)
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(this.sourceRoot(), '', filepath)
    }
    return filepath
  }

  destinationRoot (rootPath) {
    if (typeof rootPath === 'string') {
      this._destinationRoot = path.resolve(rootPath)
      if (!pathExists.sync(rootPath)) {
        this.mkdir(rootPath)
      }
      process.chdir(rootPath)
    }
    return this._destinationRoot || process.cwd()
  }

  destinationPath () {
    let filepath = path.join.apply(path, arguments)
    if (!path.isAbsolute(filepath)) {
      filepath = path.join(this.destinationRoot(), filepath)
    }
    return filepath
  }

  template (type, source, dest, data) {
    if (typeof dest !== 'string') {
      options = data
      data = dest
      dest = source
    }
    this.fs.copyTpl(
      this.templatePath('', type, source),
      this.destinationPath(dest),
      data || this
    )
    return this
  }

  copy (type='component', source, dest) {
    dest = dest || source
    this.template(type, source, dest)
    return this
  }

  getTemplate (name='component', cb) {
    const filepath = path.join(__dirname, `./templates/default/${name}`)
    const tmpPath = path.join(this._sourceRoot, name)
    if (!pathExists.sync(tmpPath)) {
      wrench.copyDirSyncRecursive(filepath, tmpPath)
    }
    cb()
  }
}

module.exports = Base

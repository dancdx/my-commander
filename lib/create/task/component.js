
const fs = require('fs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')

const Base = require('../Base')
const Util = require('../../util')

class Component extends Base {

  constructor (options) {
    super(...arguments)
    this.conf = Object.assign({
      description: '',
      componentName: null,
      sass: false,
      less: false,
      type: 'css'
    }, options)
    this.init()
  }

  init () {
    console.log(chalk.magenta(`开始创建组件～`))
  }

  talk (cb) {
    const prompts = []
    const conf = this.conf
    if (typeof conf.componentName !== 'string') {
      prompts.push({
        type: 'input',
        name: 'componentName',
        message: '输入组件名称',
        validate: (input) => {
          if (!input) return '组件名称不能为空，请再次输入'
          if (fs.existsSync(this.destinationPath(input))) {
            return '组件已存在，换个名字'
          }
          return true
        }
      })
    } else if (fs.existsSync(this.destinationPath(conf.componentName))) {
      prompts.push({
        type: 'input',
        name: 'componentName',
        message: '组件已存在，换个名字',
        validate: (input) => {
          if (!input) return '组件名称不能为空，请再次输入'
          if (fs.existsSync(this.destinationPath(input))) {
            return '组件已存在，换个名字'
          }
          return true
        }
      })
    }
    if (conf.sass === undefined && conf.less === undefined) {
      prompts.push({
        type: 'list',
        name: 'type',
        message: '选择css预处理器',
        choices: [{
          name: '不需要',
          value: 'css'
        }, {
          name: 'Sass/Compass',
          value: 'scss'
        }, {
          name: 'Less',
          value: 'less'
        }]
      })
    }

    inquirer.prompt(prompts).then((answers) => {
      if (conf.sass) answers.type = 'scss'
      if (conf.less) answers.type = 'less'
      Object.assign(this.conf, answers)
      this.write(cb)
    })
  }

  write (cb) {
    const conf = this.conf
    this.mkdir(conf.componentName)
    this.copy('component/index.js', '', this.destinationPath(conf.componentName) + '/index.js')
    if (conf.type === 'scss') {
      this.copy('component/index.scss', '', this.destinationPath(conf.componentName) + '/index.scss')
    } else if (conf.type === 'less') {
      this.copy('component/index.less', '', this.destinationPath(conf.componentName) + '/index.less')
    } else {
      this.copy('component/index.css', '', this.destinationPath(conf.componentName) + '/index.css')
    }
    this.fs.commit(() => {
      console.log(chalk.green('创建组件' + conf.componentName + '成功'))
    })
  }

  create (cb) {
    this.getTemplate('component', () => {
      this.talk(cb)
    })
  }
}

module.exports = Component

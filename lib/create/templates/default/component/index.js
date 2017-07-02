import React, { Component } from 'react'
import './index.<%= conf.type %>'

class <%= conf.componentName %> extends Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div><%= conf.componentName %></div>
    )
  }
}

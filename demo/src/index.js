import React from 'react'
import {render} from 'react-dom'

import Socket, { connect } from '../../src'

const SOCK2 = Symbol('2nd socket')

const DemoComponent = ({
  sendMessage = msg => console.info(msg),
  children = 'Send Message',
  color = 'black',
}) => (
  <button style={{
    color,
    display: 'block',
  }} onClick={function () { sendMessage('Message') }}>
    {children}
  </button>
)

const ConnectedDemo1 = connect({
  sendMessage: msg => (JSON.stringify({
    msg, mapType: 'object', componentName: 'ConnectedDemo1'
  }))
})(DemoComponent)

const ConnectedDemo2 = connect(
  send => ({
    sendMessage: msg => send(JSON.stringify({
      msg, mapType: 'function', componentName: 'ConnectedDemo2'
    }))
  }),
  {socketId: SOCK2}
)(DemoComponent)

let Demo = React.createClass({
  render() {
    return (
      <div>
        <h1>react-socket Demo</h1>
        <Socket url='ws://localhost:5074' protocol='echo-protocol'>
          <div>
            <DemoComponent sendMessage={msg => console.info('Local ' + msg)}>Local Message</DemoComponent>
            <ConnectedDemo1 color='green' onWsMessage={
              msg => console.info('dynamic message catching', msg)
            }>
              Object Message
            </ConnectedDemo1>
            <Socket url='ws://localhost:5075' protocol='echo-protocol' id={SOCK2}>
              <ConnectedDemo2 color='red'>Function Message</ConnectedDemo2>
            </Socket>
          </div>
        </Socket>
      </div>
    )
  }
})

render(<Demo/>, document.querySelector('#demo'))

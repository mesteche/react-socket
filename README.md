# react-socket

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

A react-redux inspired library to deal with websocket.
[Discord](https://discord.gg/bTujxkY)

## Installation
### Using npm
`npm i --save @mesteche/react-socket`
### Using yarn
`yarn add @mesteche/react-socket`

## API

### `<Socket [socket] [url] [protocol] [onopen] [onerror] [onmessage]>`
Makes the socket available to the children, anywhere below in the tree.  
An open `<Socket>` is required for being able to use `connect()` on sub-components.

#### Props

- `children` the component down the tree. Must be an only child, if you need to have siblings, wrap them in a single component.

If you want to instanciate the connection outside of the `<Socket>` component, you should pass the `WebSocket` instance as a prop:
- `socket` An instance of WebSocket

Else the `<Socket>` component can create it with the following parameters as props:
- `url` The url to connect to
- `protocol` The protocol to use
- `onopen` A function to call when the connection is established
- `onerror` A function to call if an errors occurs
- `onmessage` A function to call when a message is recieved (the message will be passed as an argument)

See [WebSocket documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)

#### Example
```jsx
// main.js
import React from 'react'
import {render} from 'react-dom'
import Socket from 'react-socket'

/* See connect() documentation below */
import Demo from './Demo.js'

render(
  <Socket url='ws://localhost:8080'>
    <Demo onWsMessage={msg => console.info('message recieved', msg)}>
      Send Message
    </Demo>
  </Socket>,
  document.querySelector('#app')
)
```

### `connect(mapSendToProps, [onWsMessage])`
Connects a React component to a `WebSocket`.
Similarly to react-redux's `connect()`, it doesn't modify the component passed to it but returns a new component connected to the `WebSocket` instead.

In addition to connect the component's props to the socket's `send()` method, the new component will expose a `onWsMessage` prop, for you to register a callback when a message is recieved from the server.
For instance, if you already use react-redux, you can use use react-redux's `connect()` on this new component to dispatch an action when a message arrives.

#### Arguments

- `mapSendToProps`(Object or Function):
  - If an object is passed, each key is assumed to be a prop of the component, and the correspondign values are assumed to be functions that returns the data to be sent to the server. Each function will be wrapped into a `send()` call to the server.
  - If a function is passed, it will be given the `send()` function of the socket.
  It is expected that it returns an object containning the props.
  It's up to you to use `send()` in these props.
- `[onWsMessage]`(Function): This function will be called when a message is recieved from the server, with the message as parameter.

#### Examples
##### `mapSendToProps` as an object
In this example, 'Message' will be sent to the server when the button is clicked.

```jsx
// Demo.js
import React from 'react'
import { connect } from 'react-socket'

// Basic React component
export const Demo = ({sendMessage, children}) => (
  <button onClick={function () {sendMessage('Message')}}>
    {children}
  </button>
)

const mapSendToProps = {
  sendMessage: msg => msg,
}

export default connect(mapSendToProps)(Demo)
```

##### `mapSendToProps` as a function
This Example is similar to the previous one but `mapSendToProps` is used as a function.

```jsx
// Demo.js
import React from 'react'
import { connect } from 'react-socket'

// Basic React component
export const Demo = ({sendMessage, children}) => (
  <button onClick={function () {sendMessage('Message')}}>
    {children}
  </button>
)

const mapSendToProps = send => ({
  sendMessage: msg => send(msg),
})

export default connect(mapSendToProps)(Demo)
```

##### usage with react-redux's `connect`
In this example, we use the `onWsMessage` prop of the connected component to listen to the server.
We also use react-redux to respond to such event by dispatching an action (see redux and react-redux documentation).

```jsx
// Demo.js
import React from 'react'
import { connect as wsConnect } from 'react-socket'
import { connect as RRConnect } from 'react-redux'

// Basic React component
export const Demo = ({sendMessage, children}) => (
  <button onClick={function () {sendMessage('Message')}}>
    {children}
  </button>
)

const mapSendToProps = {
  sendMessage: msg => msg,
}

const mapDispatchToProps = {
  onWsMessage: msg => ({
    type: 'SERVER_MESSAGE',
    payload: msg.data,
  })
}

export default RRConnect(null, mapDispatchToProps)(
  wsConnect(mapSendToProps)(Demo)
)
```

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

import React, { Component, Children, PropTypes as t } from 'react'

export const SOCK = Symbol('default socket id')

export class Socket extends Component {
  static socketPool = {
    [SOCK]: null,
  }
  static childContextTypes = {
    socketPool: t.object,
  }
  static propTypes = {
    id: t.any,
    children: t.node,
    socket: t.instanceOf(WebSocket),
    url: t.string,
    protocol: t.string,
    onmessage: t.func,
    onopen: t.func,
    onerror: t.func,
  }
  static defaultProps = {
    id: SOCK,
    children: null,
    socket: null,
    url: `ws://${location.host}`,
    protocol: '',
    onmessage: msg => console.info('message recieved:', msg),
    onopen: _ => console.info('socket opened'),
    onerror: _ => console.info('socket error'),
  }

  constructor (props) {
    super(props)
    this._id = props.id
    Socket.socketPool[this._id] = Socket.socketPool[this._id] || props.socket
  }

  get socket () {
    return Socket.socketPool[this._id]
  }
  set socket (sock) {
    Socket.socketPool[this._id] = sock
  }

  render () {
    return (
      this.socket && this.socket.readyState === WebSocket.OPEN
      ? Children.only(this.props.children) : null
    )
  }
  
  componentDidMount () {
    if (!this.socket) {
      try {
        this.socket = new WebSocket(this.props.url, this.props.protocol)
      } catch (e) {
        console.error(e)
        return
      }
    }
    const onOpen = this.socket.onopen || this.props.onopen || function () {}
    this.socket.onopen = (...args) => {
      onOpen(...args)
      this.forceUpdate()
    }
    this.socket.onerror = this.socket.onerror || this.props.onerror
    this.socket.onmessage = this.socket.onmessage || this.props.onmessage
  }
  
  componentWillUnmount () {
    try {
      this.socket.close()
    } catch (e) {
      console.error(e)
    }
  }
  
  getChildContext () {
    return { socketPool: Socket.socketPool }
  }
}

export default Socket

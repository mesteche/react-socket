import React, {Component, Children, PropTypes as t} from 'react'

export class Socket extends Component {
  static childContextTypes = {
    socket: t.object,
  }
  static propTypes = {
    children: t.node,
    socket: t.instanceOf(WebSocket),
    url: t.string,
    protocol: t.string,
    onmessage: t.func,
    onopen: t.func,
    onerror: t.func,
  }
  static defaultProps = {
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
    this.socket = props.socket
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
    return { socket: this.socket }
  }
}

export default Socket

// const usage = () => (
//   <Socket url='ws://localhost:8080' protocol='echo-protocol'>
//   </Socket>
// )
import React, {PropTypes as t} from 'react'
import { SOCK } from './Provider.js'

export const connectBase = (
  mapSendToProps,
  {socketId = SOCK, onWsMessage = null} = {}
) => Component => class Consumer extends React.Component {
  static contextTypes = { socketPool: t.object }
  
  constructor (props, context) {
    super(props, context)

    const socket = context.socketPool[socketId]
    if (!socket || !(socket instanceof WebSocket))
      throw new Error('invalid WebSocket:', socket)

    this.serverCalls = {}
    if (typeof mapSendToProps === 'object') {
      for (let key in mapSendToProps) {
        this.serverCalls[key] = (...args) => socket.send(mapSendToProps[key](...args))
      }
    } else if (typeof mapSendToProps === 'function') {
      this.serverCalls = mapSendToProps(data => socket.send(data))
    } else {
      console.error('mapSendToProps should be an object or a function')
    }
  }
  
  render () {
    return <Component {...this.serverCalls} {...this.props} />
  }
  
  componentDidMount () {
    const socket = this.context.socketPool[socketId]
    if (onWsMessage) {
      if (socket && (socket instanceof WebSocket))
        socket.addEventListener('message', onWsMessage)
      else
        console.error(`Can't add listener, invalid WebSocket`, socket)
        // throw new Error('invalid WebSocket:', socket)
    }
  }
  
  componentWillUnmount () {
    const socket = this.context.socketPool[socketId]
    if (onWsMessage) {
      if (onWsMessage && socket && (socket instanceof WebSocket))
        socket.removeEventListener('message', onWsMessage)
      else
        console.error(`Can't remove listener invalid WebSocket`, socket)
    }
  }
}

export const connect = mapSendToProps => Component => (
  class Connected extends React.Component {
    static propTypes = {
      onWsMessage: t.func,
      socketId: t.any,
    }
    
    constructor (props) {
      super(props)
      const {onWsMessage, socketId} = props
      this._base = connectBase(mapSendToProps, {socketId, onWsMessage})(Component)
    }

    render () {
      const { onWsMessage, socketId, ...props } = this.props
      const Base = this._base
      return <Base {...this.serverCalls} {...props} />
    }
  }
)

export default connect


import React, {PropTypes as t} from 'react'
import { SOCK } from './Provider.js'

const connect = (mapSendToProps, {socketId = SOCK, onWsMessage = null} = {}) => (
  Component => (
    class Consumer extends React.Component {
      static contextTypes = { socketPool: t.object }
      static propTypes = { onWsMessage: t.func }
      static defaultProps = { onWsMessage: null }
      
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
        const { onWsMessage = null, ...props } = this.props
        return <Component {...this.serverCalls} {...props} />
      }
      
      componentDidMount () {
        const socket = this.context.socketPool[socketId]
        if (!socket || !(socket instanceof WebSocket))
          throw new Error('invalid WebSocket:', socket)
        if (onWsMessage) socket.addEventListener('message', onWsMessage)
        if (this.props.onWsMessage) socket.addEventListener('message', this.props.onWsMessage)
      }
      
      componentWillUnmount () {
        const socket = this.context.socketPool[socketId]
        if (!socket || !(socket instanceof WebSocket))
          throw new Error('invalid WebSocket:', socket)
        if (onWsMessage) socket.removeEventListener('message', onWsMessage)
        if (this.props.onWsMessage) socket.removeEventListener('message', this.props.onWsMessage)
      }
    }
  )
)

export default connect


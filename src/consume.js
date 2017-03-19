import React, {PropTypes as t} from 'react'

const connect = (mapSendToProps, onWsMessage = null) => Component => {
  /*The context is passed as props.
    This way the component is completely decoupled from the context API.
  */
  return class Consumer extends React.Component {
    static contextTypes = { socket: t.object }
    static propTypes = { onWsMessage: t.func }
    static defaultProps = { onWsMessage: null }

    constructor (props, context) {
      super(props, context)
      const { socket } = context
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
      if (onWsMessage)
        this.context.socket.addEventListener('message', onWsMessage)
      if (this.props.onWsMessage)
        this.context.socket.addEventListener('message', this.props.onWsMessage)
    }

    componentWillUnmount () {
      if (onWsMessage)
        this.context.socket.removeEventListener('message', onWsMessage)
      if (this.props.onWsMessage)
        this.context.socket.removeEventListener('message', this.props.onWsMessage)
    }
  }
}

export default connect

// {
//   sendMessage: 'Message'
// }
// 
// {
//   type: 'sendMessage'
//   data: 'Message'
// }
// 
// const usage = () => {
//   const Demo = ({
//     sendMessage = msg => console.info(msg)
//   }) => (
//     <button onClick={function () { sendMessage('Message') }}>
//       Send Message
//     </button>
//   )
// 
//   const ConnectedDemo1 = connect({
//     sendMessage: msg => JSON.stringify({
//       type: 'sendMessage',
//       data: msg,
//     })
//   })(Demo)
//   const ConnectedDemo2 = connect(send => ({
//     sendMessage: msg => send(JSON.stringify({
//       type: 'sendMessage',
//       data: msg,
//     }))
//   }))(Demo)
// 
// const Wrapper = () => (
//   <div>
//     {/* ... */}
//     <ConnectedDemo1 onWsMessage={function (msg) { console.info(msg) }} />
//     <ConnectedDemo2 onMessage={{
//       chatReply: function (msg) { console.info(msg) },
//     }} />
//     {/* ... */}
//   </div>
// )
// 
// }
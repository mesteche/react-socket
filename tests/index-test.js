import { expect } from 'chai'
import React from 'react'
import sinon from 'sinon'
import { WebSocket, Server } from 'mock-socket'
import {render, unmountComponentAtNode} from 'react-dom'

import Socket, { connect } from 'src/'

describe('Chat Unit Test', () => {
  let node
  
  beforeEach(() => {
    node = document.createElement('div')
  })

  afterEach(() => {
    unmountComponentAtNode(node)
  })

  it('should connect', (done) => {
    const mockServer = new Server('ws://localhost:5074')
    mockServer.on('connection', server => {
      expect(server).to.exist
    })

    // Now when Provider tries to do new WebSocket() it
    // will create a MockWebSocket object
    const onOpen = _ => {
      expect(true).to.be.true
      done()
    }

    render((
      <Socket
        url='ws://localhost:5074'
        onopen={onOpen}
        >
        <div>Connected</div>
      </Socket>), node
    )

    // setTimeout(() => {
    //   const messageLen = chatApp.messages.length;
    //   assert.equal(messageLen, 2, '2 messages where sent from the s server');
    // 
    //   mockServer.stop(done);
    // }, 100);
  })
})
// describe('Component', () => {
//   let node
// 
//   beforeEach(() => {
//     node = document.createElement('div')
//   })
// 
//   afterEach(() => {
//     unmountComponentAtNode(node)
//   })
// 
//   it('displays a welcome message', () => {
//     render(<Component/>, node, () => {
//       expect(node.innerHTML).toContain('Welcome to React components')
//     })
//   })
// })

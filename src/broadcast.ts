import registry from '@node-red/registry'
import { NodeAPI } from 'node-red'
import { messagingApi } from '@line/bot-sdk'

import {
  BroadcastNodeDef,
  Credentials
} from './types'


module.exports = function (RED: NodeAPI) {
  function BroadcastNode(config: BroadcastNodeDef) {
    RED.nodes.createNode(this, config)
    this.config = config.config
    const node = this as registry.Node
    const credentials = RED.nodes.getCredentials(this.config) as Credentials
    const lineConfig = {
      channelSecret: credentials.channelSecret,
      channelAccessToken: credentials.channelAccessToken
    }
    const {MessagingApiClient} = messagingApi;
    const client = new MessagingApiClient(lineConfig);

    node.on('input', async function (msg: any,send,done) {
      let res:Object | null = null;
      try {
        if (!msg.payload) {
          res = await client.broadcast({
            messages: [{ type: 'text', text: config.message }]
          });
        } else if(typeof msg.payload === 'object'){
          res = await client.broadcast({
            messages: msg.payload
          });
        } else {
          res = await client.broadcast({
            messages: [{ type: 'text', text: config.message || String(msg.payload)}]
          });
        }

        msg.payload = res;
        send(msg);
        done();
      } catch (error) {
          done(error);
      }
    })
  }
  RED.nodes.registerType('broadcast', BroadcastNode);
}
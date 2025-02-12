import registry from '@node-red/registry'
import { NodeAPI } from 'node-red'
import { messagingApi } from '@line/bot-sdk'

import {
  PushNodeDef,
  Credentials
} from './types'


module.exports = function (RED: NodeAPI) {
  function PushNode(config: PushNodeDef) {
    RED.nodes.createNode(this, config)
    this.config = config.config
    const node = this as registry.Node & { credentials: {targetId:string} }
    const credentials = RED.nodes.getCredentials(this.config) as Credentials
    const lineConfig = {
      channelSecret: credentials.channelSecret,
      channelAccessToken: credentials.channelAccessToken
    }
    const {MessagingApiClient} = messagingApi;
    const client = new MessagingApiClient(lineConfig);

    node.on('input', async function (msg: any,send,done) {
      let res:messagingApi.PushMessageResponse | null = null;
      const userId = msg.targetId || node.credentials.targetId;
      try {
        if (!userId) throw new Error('プッシュ先のユーザーIDもしくはグループIDが指定されてません');
        else {
          if (!msg.payload) {
            res = await client.pushMessage({
              to: userId,
              messages: [{ type: 'text', text: config.message }]
            });
          } else if(typeof msg.payload === 'object'){
            res = await client.pushMessage({
              to: userId,
              messages: msg.payload
            });
          } else {
            res = await client.pushMessage({
              to: userId,
              messages: [{ type: 'text', text: config.message || String(msg.payload)}]
            });
          }

          msg.payload = res;
          send(msg);
          done();
        }
      } catch (error) {
          done(error);
      }
    })
  }
  RED.nodes.registerType('push', PushNode, {
    credentials: {
        targetId: {type:"password"},
    },
});
}
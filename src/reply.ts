import registry from '@node-red/registry'
import { NodeAPI } from 'node-red'
import { messagingApi } from '@line/bot-sdk'

import {
  ReplyNodeDef,
  Credentials
} from './types'


module.exports = function (RED: NodeAPI) {
  function ReplyNode(config: ReplyNodeDef) {
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
      let res:messagingApi.ReplyMessageResponse | null = null;
      try {
        if (!msg.line || !msg.line.events || !msg.line.events[0].replyToken) throw new Error('リプライトークンがありません');
        else {
          if (!msg.payload) {
            res = await client.replyMessage({
              replyToken: msg.line.events[0].replyToken,
              messages: [{ type: 'text', text: config.message }]
            });
          } else if(typeof msg.payload === 'object'){
            res = await client.replyMessage({
              replyToken: msg.line.events[0].replyToken,
              messages: msg.payload
            });
          } else {
            res = await client.replyMessage({
              replyToken: msg.line.events[0].replyToken,
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
  RED.nodes.registerType('reply', ReplyNode)
}
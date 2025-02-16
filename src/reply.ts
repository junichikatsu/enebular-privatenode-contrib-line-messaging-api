import registry from '@node-red/registry'
import { NodeAPI } from 'node-red'
import { messagingApi } from '@line/bot-sdk'

import {
  ConfigNodeProperty,
  ReplyNodeDef,
} from './types'


module.exports = function (RED: NodeAPI) {
  function ReplyNode(config: ReplyNodeDef) {
    RED.nodes.createNode(this, config);
    this.config = config.config;
    const node = this as registry.Node;

    node.on('input', async function (msg: any,send,done) {
      // configノードを取得
      const ConfigNode = RED.nodes.getNode(
        this.config
      ) as ConfigNodeProperty;
      let channelSecret = ConfigNode.channelSecret;
      let channelAccessToken = ConfigNode.channelAccessToken;
      if (ConfigNode.channelSecretConstValue && ConfigNode.channelSecretType) {
        channelSecret = RED.util.evaluateNodeProperty(
          ConfigNode.channelSecretConstValue,
          ConfigNode.channelSecretType,
          node,
          msg
        )
      }
      if (ConfigNode.channelAccessTokenConstValue && ConfigNode.channelAccessTokenType) {
        channelAccessToken = RED.util.evaluateNodeProperty(
          ConfigNode.channelAccessTokenConstValue,
          ConfigNode.channelAccessTokenType,
          node,
          msg
        )
      }

      const lineConfig = {
        channelSecret,
        channelAccessToken
      }
      const {MessagingApiClient} = messagingApi;
      const client = new MessagingApiClient(lineConfig);
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
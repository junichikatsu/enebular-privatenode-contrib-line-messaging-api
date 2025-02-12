import registry from '@node-red/registry'
import { NodeAPI } from 'node-red'
import { messagingApi } from "@line/bot-sdk";

import {
  LoadingNodeDef,
  Credentials
} from './types'


module.exports = function (RED: NodeAPI) {
  function LoadingNode(config: LoadingNodeDef) {
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
      const loadingSeconds = config.loadingSeconds;
      const chatId = msg.line.events[0].source.userId;            
      try {
          const res = await client.showLoadingAnimation({
              chatId: chatId,
              loadingSeconds: loadingSeconds,
          });

          if (res && Object.keys(res).length === 0) {
            send(msg);
          } else {
            throw new Error(JSON.stringify(res));
          }
      } catch (error) {
          done(error);
      }
    })

  }
  RED.nodes.registerType('loading', LoadingNode)
}
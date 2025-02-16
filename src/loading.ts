import registry from '@node-red/registry'
import { NodeAPI } from 'node-red'
import { messagingApi } from "@line/bot-sdk";

import {
  ConfigNodeProperty,
  LoadingNodeDef,
} from './types'


module.exports = function (RED: NodeAPI) {
  function LoadingNode(config: LoadingNodeDef) {
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
import { NodeAPI } from 'node-red'

import {
  ConfigNodeProperty,
  ConfigNodeDef
} from './types'

module.exports = function(RED: NodeAPI) {
  function main(config: ConfigNodeDef) {
      RED.nodes.createNode(this, config);
      const node: ConfigNodeProperty = this
      node.channelSecret = node.credentials.channelSecret
      node.channelSecretConstValue = config.channelSecretConstValue
      node.channelSecretType = config.channelSecretType
      node.channelAccessToken = node.credentials.channelAccessToken
      node.channelAccessTokenConstValue = config.channelAccessTokenConstValue
      node.channelAccessTokenType = config.channelAccessTokenType
  }

  RED.nodes.registerType("config", main, {
      credentials: {
        channelSecret: { type: 'password' },
        channelAccessToken: { type: 'password' }
      }
  });
}

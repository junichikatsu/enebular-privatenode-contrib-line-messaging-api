import { NodeAPI } from 'node-red'

import {
  ConfigNodeDef
} from './types'

module.exports = function(RED: NodeAPI) {
  function main(config: ConfigNodeDef) {
      RED.nodes.createNode(this, config);
      // コンフィグノードの初期化
  }

  RED.nodes.registerType("config", main, {
      credentials: {
        channelSecret: { type: 'password' },
        channelAccessToken: { type: 'password' }
      }
  });
}

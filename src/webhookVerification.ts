import crypto from 'crypto'
import registry from '@node-red/registry'

import { NodeAPI } from 'node-red'


import {
  ConfigNodeProperty,
  WebhookVerificationNodeDef,
} from './types'

module.exports = function (RED: NodeAPI) {
  function WebhookVerificationNode(config: WebhookVerificationNodeDef) {
    RED.nodes.createNode(this, config);
    this.config = config.config;
    const node = this as registry.Node;
    node.on('input', function (msg: any,send,done) {
      // configノードを取得
      const ConfigNode = RED.nodes.getNode(
        this.config
      ) as ConfigNodeProperty;
      let channelSecret = ConfigNode.channelSecret;
      if (ConfigNode.channelSecretConstValue && ConfigNode.channelSecretType) {
        channelSecret = RED.util.evaluateNodeProperty(
          ConfigNode.channelSecretConstValue,
          ConfigNode.channelSecretType,
          node,
          msg
        )
      }

      const body = msg.payload;
      const signature = msg.req.headers['x-line-signature']; // 送信された署名
      
      // HMAC-SHA256で署名を計算
      const hmac = crypto.createHmac('sha256', channelSecret);
      hmac.update(JSON.stringify(body));
      const calculatedSignature = hmac.digest('base64');
      
      // 署名を比較
      if (calculatedSignature === signature) {
          msg.line = msg.payload;
          msg.payload = { status: "success", message: "Signature Verified" };
          send([msg, null]);
          done();
      } else {
          msg.payload = { status: "error", message: "Invalid Signature" };
          msg.statusCode = 403;
          send([null, msg]);
          done();
      }
    })
  }
  RED.nodes.registerType('webhook-verification', WebhookVerificationNode)
}
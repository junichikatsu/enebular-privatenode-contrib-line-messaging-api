import crypto from 'crypto'
import registry from '@node-red/registry'

import { NodeAPI } from 'node-red'


import {
  WebhookVerificationNodeDef,
  Credentials
} from './types'

module.exports = function (RED: NodeAPI) {
  function WebhookVerificationNode(config: WebhookVerificationNodeDef) {
    RED.nodes.createNode(this, config)
    this.config = config.config
    const node = this as registry.Node
    const credentials = RED.nodes.getCredentials(this.config) as Credentials
    node.on('input', function (msg: any,send,done) {
      const channelSecret = credentials.channelSecret;

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
          done(msg);
      }
    })
  }
  RED.nodes.registerType('webhook-verification', WebhookVerificationNode)
}
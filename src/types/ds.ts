import { NodeDef } from '@node-red/registry'
import * as registry from '@node-red/registry'

export interface Credentials {
  channelSecret: string
  channelAccessToken: string
}

export interface ConfigNodeProperty extends registry.Node {
  channelSecret: string
  channelSecretType: string
  channelSecretConstValue: string
  channelAccessToken: string
  channelAccessTokenType: string
  channelAccessTokenConstValue: string
  name: string
  credentials: {
    channelSecret: string
    channelAccessToken: string
  }
}

export interface ConfigNodeDef extends NodeDef {
  channelSecretType: string
  channelSecretConstValue: string
  channelAccessTokenType: string
  channelAccessTokenConstValue: string
  name: string
}

export interface WebhookVerificationNodeDef extends NodeDef {
  config: string
}

export interface LoadingNodeDef extends NodeDef {
  config: string
  loadingSeconds: number
}

export interface ReplyNodeDef extends NodeDef {
  config: string
  message: string
}

export interface PushNodeDef extends NodeDef {
  config: string
  message: string
}

export interface BroadcastNodeDef extends NodeDef {
  config: string
  message: string
}

export interface TestNodeDef extends NodeDef {
  rules: any
}
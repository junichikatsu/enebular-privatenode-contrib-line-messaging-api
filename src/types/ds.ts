import { NodeDef } from '@node-red/registry'

export interface Credentials {
  channelSecret: string
  channelAccessToken: string
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
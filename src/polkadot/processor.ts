import { assertNotNull } from '@subsquid/util-internal'
import {
  BlockHeader,
  Call as _Call,
  DataHandlerContext,
  Event as _Event,
  Extrinsic as _Extrinsic,
  SubstrateBatchProcessor,
  SubstrateBatchProcessorFields,
} from '@subsquid/substrate-processor'

import { events } from '../types/polkadot'
import { fieldSelection } from '../utils/types'
import { IdentityCall, IdentityEvent } from '../processable'

const ARCHIVE_URL = `https://v2.archive.subsquid.io/network/polkadot`
const NODE_URL = `wss://rpc.ibp.network/polkadot`
const STARTING_BLOCK = 188868 // 189369jud
const ENDING_BLOCK = 21553900

console.log(Object.keys(events.identity))
// const allEvents = Object.keys(events.identity).map(
//   (name: any) => events.identity[name].name
// )

export const processor = new SubstrateBatchProcessor()
  .setBlockRange({ from: STARTING_BLOCK, to: ENDING_BLOCK })
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  .setGateway(ARCHIVE_URL)
  // Chain RPC endpoint is required on Substrate for metadata and real-time updates
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    url: assertNotNull(NODE_URL, 'No RPC endpoint supplied'),
    // capacity: 20,
    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    rateLimit: 10,
  })
  .addCall({
    name: [IdentityCall.setIdentity],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.clearIdentity],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.killIdentity],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.provideJudgement],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.addSub],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.setSubs],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.renameSub],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.addUsernameAuthority],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.removeUsernameAuthority],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.setFee],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.setFields],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.setAccountId],
    extrinsic: true,
  })
  .addEvent({
    name: [IdentityEvent.setIdentity],
    extrinsic: true,
    call: true,
  })
  .addCall({
    name: [IdentityCall.requestJudgement],
    extrinsic: true,
  })
  // TODO: UNIMPLEMENTED
  .addCall({
    name: [IdentityCall.cancelRequest],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.removeSub],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.quitSub],
    extrinsic: true,
  })
  .addEvent({
    name: [IdentityEvent.addSubIdentity],
    extrinsic: true,
    call: true,
  })
  .addCall({
    name: [IdentityCall.setUsernameFor],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.acceptUsername],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.setPrimaryUsername],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.removeExpiredApproval],
    extrinsic: true,
  })
  .addCall({
    name: [IdentityCall.removeDanglingUsername],
    extrinsic: true,
  })
  .addEvent({
    name: [IdentityEvent.clearIdentity],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.killIdentity],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.requestJudgement], // DOABLE?
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.unrequestJudgement], // DOABLE?
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.giveJudgement],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.removeSubIdentity],
    extrinsic: true,
    call: true,
  })
  // OUTSIDE OF SCOPE
  // .addEvent({
  //   name: [IdentityEvent.renameSubIdentity],
  //   extrinsic: true,
  //   call: true,
  // })
  .addEvent({
    name: [IdentityEvent.revokeSubIdentity],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.setUsername],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.queueUsername],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.expirePreapproval],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.setPrimaryUsername],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.removeDanglingUsername], // DOABLE?
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.unbindUsername], // DOABLE?
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.removeUsername],
    extrinsic: true,
    call: true,
  })
  .addEvent({
    name: [IdentityEvent.killUsername],
    extrinsic: true,
    call: true,
  })
  .setFields(fieldSelection)
// .setFields({
//   event: {
//     args: true,
//   },
//   extrinsic: {
//     hash: true,
//     fee: true,
//   },
//   block: {
//     timestamp: true,
//   },
// })
// Uncomment to disable RPC ingestion and drastically reduce no of RPC calls
processor.setRpcDataIngestionSettings({ disabled: false })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>

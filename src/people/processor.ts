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

import { events } from '../types/people'
import { calls } from '../types/people'
import { IdentityCall, IdentityEvent } from '../processable'
import { fieldSelection } from '../utils/types'

const ARCHIVE_URL = `https://v2.archive.subsquid.io/network/people-chain`
const NODE_URL = `wss://sys.ibp.network/people-polkadot`
const STARTING_BLOCK = 76280

console.log(Object.keys(IdentityEvent))

export const processor = new SubstrateBatchProcessor()
  .setBlockRange({ from: STARTING_BLOCK - 8e3 })
  // Lookup archive by the network name in Subsquid registry
  // See https://docs.subsquid.io/substrate-indexing/supported-networks/
  .setGateway(ARCHIVE_URL)
  // Chain RPC endpoint is required on Substrate for metadata and real-time updates
  .setRpcEndpoint({
    // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
    // https://docs.subsquid.io/deploy-squid/env-variables/
    url: assertNotNull(NODE_URL, 'No RPC endpoint supplied'),
    // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
    rateLimit: 10,
  })
  .addCall({
    name: [IdentityCall.setIdentity],
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
  .addEvent({
    name: [IdentityEvent.removeSubIdentity],
    extrinsic: true,
    call: true,
  })
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
// Uncomment to disable RPC ingestion and drastically reduce no of RPC calls
processor.setRpcDataIngestionSettings({ disabled: false })

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>

// TODO
// .addCall({
//     name: [IdentityCall.clearIdentity.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.killIdentity.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.addRegistrar.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.setFee.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.setFields.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.setAccountId.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.requestJudgement.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.cancelRequest.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.removeSub.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.quitSub.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.setUsernameFor.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.acceptUsername.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.setPrimaryUsername.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.removeExpiredApproval.name],
//     extrinsic: true,
// })
// .addCall({
//     name: [IdentityCall.removeDanglingUsername.name],
//     extrinsic: true,
// })

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

const ARCHIVE_URL = `https://v2.archive.subsquid.io/network/polkadot`
const NODE_URL = `wss://rpc.ibp.network/polkadot`
const STARTING_BLOCK = 188868

console.log(Object.keys(events.identity))

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
  .addEvent({
    name: [events.identity.identitySet.name],
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

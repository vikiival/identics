import {assertNotNull} from '@subsquid/util-internal'
import {
    BlockHeader,
    DataHandlerContext,
    SubstrateBatchProcessor,
    SubstrateBatchProcessorFields,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'

import {events} from './types/polkadot'

const ARCHIVE_URL = `https://v2.archive.subsquid.io/network/polkadot`
// const NODE_URL = `wss://${CHAIN}-asset-hub-rpc.polkadot.io`

export const processor = new SubstrateBatchProcessor()
    // Lookup archive by the network name in Subsquid registry
    // See https://docs.subsquid.io/substrate-indexing/supported-networks/
    .setGateway('https://v2.archive.subsquid.io/network/polkadot')
    // Chain RPC endpoint is required on Substrate for metadata and real-time updates
    .setRpcEndpoint({
        // Set via .env for local runs or via secrets when deploying to Subsquid Cloud
        // https://docs.subsquid.io/deploy-squid/env-variables/
        url: assertNotNull(process.env.NODE_URL, 'No RPC endpoint supplied'),
        // More RPC connection options at https://docs.subsquid.io/substrate-indexing/setup/general/#set-data-source
        rateLimit: 10
    })
    .addEvent({
        name: [events.identity.identitySet.name],
        extrinsic: true
    })
    .setFields({
        event: {
            args: true
        },
        extrinsic: {
            hash: true,
            fee: true
        },
        block: {
            timestamp: true
        }
    })
    // Uncomment to disable RPC ingestion and drastically reduce no of RPC calls
    .useArchiveOnly()

export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>

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

import {events} from './types/people'
import {calls} from './types/people'

const ARCHIVE_URL = `https://v2.archive.subsquid.io/network/people-chain`
const NODE_URL = `wss://sys.ibp.network/people-polkadot`
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
        rateLimit: 10
    })
    .addCall({
        name: [calls.identity.setIdentity.name],
        extrinsic: true,
    })
    .addCall({
        name: [calls.identity.provideJudgement.name],
        extrinsic: true,
    })
    .addCall({
        name: [calls.identity.addSub.name],
        extrinsic: true,
    })
    .addCall({
        name: [calls.identity.setSubs.name],
        extrinsic: true,
    })
    .addCall({
        name: [calls.identity.renameSub.name],
        extrinsic: true,
    })
    .addCall({
        name: [calls.identity.addUsernameAuthority.name],
        extrinsic: true,
    })
    .addCall({
        name: [calls.identity.removeUsernameAuthority.name],
        extrinsic: true,
    })
    // .addEvent({
    //     name: [events.identity.identitySet.name],
    //     extrinsic: true
    // })
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
    });
    // Uncomment to disable RPC ingestion and drastically reduce no of RPC calls
    processor.setRpcDataIngestionSettings({ disabled: true })


export type Fields = SubstrateBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>

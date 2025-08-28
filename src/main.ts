import { TypeormDatabase as Database } from '@subsquid/typeorm-store'

import { mainFrame } from './mapping'
import { processor as people } from './people/processor'
import { processor as polkadot } from './polkadot/processor'

const CHAIN = process.env.CHAIN || ''

if (!['people', 'polkadot'].includes(CHAIN)) {
  throw new Error('Please set CHAIN env variable to "people" or "polkadot"')
}

const stateSchema =
  CHAIN === 'polkadot' ? 'squid_processor' : `${CHAIN}_processor`

const database = new Database({
  supportHotBlocks: false,
  stateSchema,
})

if (process.env.CHAIN === 'people') {
  people.run(database, mainFrame)
} else {
  polkadot.run(database, mainFrame)
}

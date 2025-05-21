import { Store, TypeormDatabase as Database } from '@subsquid/typeorm-store'
import { In } from 'typeorm'
import * as ss58 from '@subsquid/ss58'
import assert from 'assert'

import { processor, ProcessorContext } from './processor'
import { Identity, Username } from '../model'
import { events } from '../types/polkadot'
import { mainFrame } from '../mapping'

type Context = ProcessorContext<Store>
const database = new Database({ supportHotBlocks: false })

processor.run(database, mainFrame)

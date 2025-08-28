import { TypeormDatabase as Database, Store } from '@subsquid/typeorm-store'

import { mainFrame } from '../mapping'
import { processor, ProcessorContext } from './processor'

type Context = ProcessorContext<Store>
const database = new Database({
  supportHotBlocks: false,
  stateSchema: 'people_processor',
})

processor.run(database, mainFrame)

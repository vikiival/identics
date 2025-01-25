import { Store } from "@subsquid/typeorm-store"
import { ProcessorContext} from '../processor'

/**
 * mainFrame is the main entry point for processing a batch of blocks
**/
export async function mainFrame(ctx: ProcessorContext<Store>): Promise<void> {}
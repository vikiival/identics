import { serializer } from '@kodadot1/metasquid'

import { fixtureSummary } from './sampleData'

export function snapshotFixtures() {
  return JSON.parse(JSON.stringify(fixtureSummary, serializer))
}

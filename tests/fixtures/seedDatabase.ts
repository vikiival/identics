import { DataSource } from 'typeorm'
import { createOrmConfig } from '@subsquid/typeorm-config'
import { serializer } from '@kodadot1/metasquid'
import { Authority } from '../../lib/model/generated/authority.model'
import { Event } from '../../lib/model/generated/event.model'
import { Identity } from '../../lib/model/generated/identity.model'
import { Registrar } from '../../lib/model/generated/registrar.model'
import { Sub } from '../../lib/model/generated/sub.model'
import { Username } from '../../lib/model/generated/username.model'

import { fixtureSummary } from './sampleData'

let seedPromise: Promise<void> | null = null

export async function ensureFixtureData(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seed()
  }

  await seedPromise
}

async function seed(): Promise<void> {
  const cfg = createOrmConfig({ projectDir: process.cwd() })
  const dataSource = new DataSource(cfg)
  await dataSource.initialize()

  try {
    const manager = dataSource.manager

    const identityEntity = manager.create(Identity, fixtureSummary.identity)
    await manager.save(identityEntity)

    const registrarEntity = manager.create(Registrar, fixtureSummary.registrar)
    await manager.save(registrarEntity)

    const subEntity = manager.create(Sub, {
      ...fixtureSummary.sub,
      identity: identityEntity,
    })
    await manager.save(subEntity)

    for (const username of fixtureSummary.usernames) {
      const usernameEntity = manager.create(Username, {
        ...username,
        identity: identityEntity,
      })
      await manager.save(usernameEntity)
    }

    for (const authority of fixtureSummary.authorities) {
      const authorityEntity = manager.create(Authority, authority)
      await manager.save(authorityEntity)
    }

    for (const event of fixtureSummary.events) {
      const eventEntity = manager.create(Event, {
        ...event,
        identity: identityEntity,
      })
      await manager.save(eventEntity)
    }
  } finally {
    await dataSource.destroy().catch((error) => {
      console.error('Failed to close fixture DataSource', error)
    })
  }
}

export function snapshotFixtures() {
  return JSON.parse(JSON.stringify(fixtureSummary, serializer))
}

import { DataSource } from 'typeorm'
import { Authority, Event, Identity, Registrar, Sub, Username } from '../model'
import { fixtureSummary, positiveFixtureSummary } from './sampleData'

async function upsertIdentity(dataSource: DataSource) {
  const manager = dataSource.manager
  const existing = await manager.findOne(Identity, {
    where: { id: fixtureSummary.identity.id },
  })

  if (!existing) {
    const created = manager.create(Identity, fixtureSummary.identity)
    return manager.save(created)
  }

  manager.merge(Identity, existing, fixtureSummary.identity)
  return manager.save(existing)
}

async function upsertFeePaidIdentity(dataSource: DataSource) {
  const manager = dataSource.manager
  const existing = await manager.findOne(Identity, {
    where: { id: positiveFixtureSummary.identity.id },
  })

  if (!existing) {
    const created = manager.create(Identity, positiveFixtureSummary.identity)
    return manager.save(created)
  }

  manager.merge(Identity, existing, positiveFixtureSummary.identity)
  return manager.save(existing)
}

async function upsertRegistrar(dataSource: DataSource) {
  const manager = dataSource.manager
  const existing = await manager.findOne(Registrar, {
    where: { id: fixtureSummary.registrar.id },
  })

  if (!existing) {
    const created = manager.create(Registrar, fixtureSummary.registrar)
    return manager.save(created)
  }

  manager.merge(Registrar, existing, fixtureSummary.registrar)
  return manager.save(existing)
}

async function upsertSub(dataSource: DataSource, identity: Identity) {
  const manager = dataSource.manager
  const payload = { ...fixtureSummary.sub, identity }
  const existing = await manager.findOne(Sub, {
    where: { id: fixtureSummary.sub.id },
  })

  if (!existing) {
    const created = manager.create(Sub, payload)
    return manager.save(created)
  }

  manager.merge(Sub, existing, payload)
  return manager.save(existing)
}

async function upsertUsernames(dataSource: DataSource, identity: Identity) {
  const manager = dataSource.manager

  for (const username of fixtureSummary.usernames) {
    const payload = { ...username, identity }
    const existing = await manager.findOne(Username, {
      where: { id: username.id },
    })

    if (!existing) {
      await manager.save(manager.create(Username, payload))
      continue
    }

    manager.merge(Username, existing, payload)
    await manager.save(existing)
  }
}

async function upsertPendingUsernames(
  dataSource: DataSource,
  identity: Identity
) {
  const manager = dataSource.manager

  for (const username of positiveFixtureSummary.usernames) {
    const payload = { ...username, identity }
    const existing = await manager.findOne(Username, {
      where: { id: username.id },
    })

    if (!existing) {
      await manager.save(manager.create(Username, payload))
      continue
    }

    manager.merge(Username, existing, payload)
    await manager.save(existing)
  }
}

async function upsertAuthorities(dataSource: DataSource) {
  const manager = dataSource.manager

  for (const authority of fixtureSummary.authorities) {
    const existing = await manager.findOne(Authority, {
      where: { id: authority.id },
    })

    if (!existing) {
      await manager.save(manager.create(Authority, authority))
      continue
    }

    manager.merge(Authority, existing, authority)
    await manager.save(existing)
  }
}

async function upsertEvents(dataSource: DataSource, identity: Identity) {
  const manager = dataSource.manager

  for (const event of fixtureSummary.events) {
    const payload = { ...event, identity }
    const existing = await manager.findOne(Event, {
      where: { id: event.id },
    })

    if (!existing) {
      await manager.save(manager.create(Event, payload))
      continue
    }

    manager.merge(Event, existing, payload)
    await manager.save(existing)
  }
}

export async function ensurePositiveFixtureData(
  dataSource: DataSource
): Promise<void> {
  const identity = await upsertFeePaidIdentity(dataSource)
  await Promise.all([upsertPendingUsernames(dataSource, identity)])
}

export async function ensureFixtureSeedData(
  dataSource: DataSource
): Promise<void> {
  const identity = await upsertIdentity(dataSource)
  await Promise.all([
    upsertRegistrar(dataSource),
    upsertSub(dataSource, identity),
    upsertUsernames(dataSource, identity),
    upsertAuthorities(dataSource),
    upsertEvents(dataSource, identity),
  ])
}

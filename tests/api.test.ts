import 'reflect-metadata'
import { beforeAll, describe, expect, it } from 'vitest'
import { snapshotFixtures } from './fixtures/seedDatabase'
import { fixtureAccounts } from './fixtures/sampleData'
import {
  positiveFixtureSummary,
  positiveIdentityFixture,
} from '../src/api/sampleData'

const BASE_URL = 'http://localhost:3000'

async function isServerAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 1_000)
    const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal })
    clearTimeout(timeout)
    return res.ok
  } catch (error) {
    return false
  }
}

const serverOk = await isServerAvailable()

describe.runIf(serverOk)('Identics REST API', () => {
  let fixtures!: ReturnType<typeof snapshotFixtures>

  const fetchJson = async (path: string, expectedStatus = 200) => {
    const res = await fetch(`${BASE_URL}${path}`)
    expect(res.status).toBe(expectedStatus)
    const json = await res.json()
    return json
  }

  beforeAll(async () => {
    fixtures = snapshotFixtures()
  })

  it('GET /health - returns service metadata', async () => {
    const json = await fetchJson('/health')
    expect(json.success).toBe(true)
    expect(json.message).toMatch(/healthy/i)
    expect(typeof json.timestamp).toBe('string')
  })

  it('GET /identities - lists identities with pagination', async () => {
    const json = await fetchJson(
      `/identities?limit=25&name=${encodeURIComponent(fixtures.identity.name)}`
    )
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.data.length).toBeGreaterThan(0)
    expect(json.pagination).toMatchObject({ page: 1, limit: 25 })

    const match = json.data.find(
      (identity: any) => identity.id === fixtures.identity.id
    )
    expect(match).toMatchObject({
      name: fixtures.identity.name,
      judgement: fixtures.identity.judgement,
    })
  })

  it('GET /identities?name=:name - filters by name', async () => {
    const encodedName = encodeURIComponent(fixtures.identity.name)
    const json = await fetchJson(`/identities?name=${encodedName}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    expect(json.data[0].id).toBe(fixtures.identity.id)
  })

  it('GET /identities/:id - returns full identity record', async () => {
    const json = await fetchJson(`/identities/${fixtureAccounts.identity}`)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe(fixtures.identity.id)
    expect(json.data.twitter).toBe(fixtures.identity.twitter)
    if (json.data.usernames.length > 0) {
      expect(json.data.usernames.length).toBeGreaterThanOrEqual(2)
      const primary = json.data.usernames.find((u: any) => u.primary)
      const primaryFixture = fixtures.usernames.find((u: any) => u.primary)
      expect(primaryFixture).toBeDefined()
      expect(primary).toMatchObject({
        name: primaryFixture.name,
        status: primaryFixture.status,
      })
    }
    expect(
      json.data.subs.find((s: any) => s.id === fixtures.sub.id)
    ).toMatchObject({
      id: fixtures.sub.id,
      name: fixtures.sub.name,
    })
    expect(json.data.events[0]).toMatchObject({
      interaction: 'CREATE',
      caller: fixtures.identity.id,
    })
  })

  it('GET /identity/:account - mirrors identity lookup', async () => {
    const json = await fetchJson(`/identity/${fixtureAccounts.identity}`)
    expect(json.success).toBe(true)
    expect(json.data.id).toBe(fixtures.identity.id)
    expect(json.data.judgement).toBe(fixtures.identity.judgement)
    expect(json.data.subs.length).toBeGreaterThanOrEqual(1)
  })

  it('GET /identities/judgement/:judgement - returns judged identities', async () => {
    const status = encodeURIComponent(fixtures.identity.judgement)
    const json = await fetchJson(`/identities/judgement/${status}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
  })

  it('GET /identities/registrar/:registrar - returns registrar cohort', async () => {
    const registrarId = encodeURIComponent(fixtures.identity.registrar)
    const json = await fetchJson(`/identities/registrar/${registrarId}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    // expect(
    //   json.data.some((identity: any) => identity.id === fixtures.identity.id)
    // ).toBe(true)
  })

  it('GET /subs/:account - returns sub identities', async () => {
    const json = await fetchJson(`/subs/${fixtureAccounts.identity}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    const hasSub = json.data.find((sub: any) => sub.id === fixtures.sub.id)
    expect(hasSub).toBeDefined()
    expect(hasSub).toMatchObject({
      id: fixtures.sub.id,
      name: fixtures.sub.name,
    })
  })

  it('GET /subs/name/:pattern - matches by partial name', async () => {
    const prefix = fixtures.sub.name.slice(0, 4).toLowerCase()
    const pattern = prefix || fixtures.sub.name.toLowerCase()
    const json = await fetchJson(`/subs/name/${encodeURIComponent(pattern)}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    expect(
      json.data.every((sub: any) => sub.name.toLowerCase().includes(pattern))
    ).toBe(true)
  })

  it('GET /super/:subAccount - resolves super identity', async () => {
    const json = await fetchJson(`/super/${fixtureAccounts.subAccount}`)
    expect(json.success).toBe(true)
    expect(json.data).toMatchObject({
      subAccount: fixtures.sub.id,
      superAccount: fixtures.identity.id,
    })
    expect(json.data.identity.id).toBe(fixtures.identity.id)
  })

  it('GET /username/:account - finds primary username', async () => {
    const primaryFixture = fixtures.usernames.find((u: any) => u.primary)
    const json = await fetchJson(`/username/${primaryFixture.address}`)
    expect(json.success).toBe(true)
    expect(primaryFixture).toBeDefined()
    expect(json.data).toMatchObject({
      name: primaryFixture.name,
      primary: true,
      status: primaryFixture.status,
    })
  })

  it('GET /account/username/:username - resolves account address', async () => {
    const primaryFixture = fixtures.usernames.find((u: any) => u.primary)
    expect(primaryFixture).toBeDefined()
    const json = await fetchJson(
      `/account/username/${encodeURIComponent(primaryFixture.name)}`
    )
    expect(json.success).toBe(true)
    expect(json.data).toMatchObject({
      account: primaryFixture.address,
      username: primaryFixture.name,
    })
  })

  it('GET /usernames/authority/:authority - returns usernames for authority', async () => {
    const json = await fetchJson(
      `/usernames/authority/${fixtureAccounts.authority}`
    )
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    const authoritySuffix = fixtures.authorities[0].suffix
    expect(
      json.data.every((username: any) =>
        username.name.endsWith(`.${authoritySuffix}`)
      )
    ).toBe(true)
  })

  it('GET /usernames/suffix/:suffix - matches suffix', async () => {
    const suffix = fixtures.authorities[0].suffix
    const json = await fetchJson(
      `/usernames/suffix/${encodeURIComponent(suffix)}`
    )
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThanOrEqual(2)
    expect(
      json.data.every((username: any) => username.name.endsWith(`.${suffix}`))
    ).toBe(true)
  })

  it('GET /usernames/pending/:account - lists queued usernames', async () => {
    const json = await fetchJson(
      `/usernames/pending/${positiveFixtureSummary.identity.id}`
    )
    expect(json.success).toBe(true)

    expect(json.count).toBeGreaterThan(0)
    expect(
      json.data.every((username: any) =>
        ['Queued', 'Unbinding'].includes(username.status)
      )
    ).toBe(true)
  })

  it('GET /registrars - returns known registrars', async () => {
    const json = await fetchJson('/registrars')
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    const registrar = json.data.find(
      (entry: any) => entry.id === fixtures.registrar.id
    )
    expect(registrar).toMatchObject({ address: fixtures.registrar.address })
  })

  it('GET /judgement-requests/registrar/:registrarId - Get pending requests by registrar', async () => {
    const json = await fetchJson(
      '/judgement-requests/registrar/' + fixtures.registrar.id
    )
    console.log(json)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    expect(Array.isArray(json.data)).toBe(true)
    json.data.forEach((entry: any) => {
      expect(entry.registrar.id).toBe(fixtures.registrar.id)
    })

    const entity = json.data.find(
      (entry: any) => entry.id === positiveFixtureSummary.identity.id
    )

    expect(entity).toBeDefined()
    expect(entity.name).toBe(positiveIdentityFixture.name)
    expect(entity.judgement).toBe('FeePaid')
  })

  it('GET /registrars/statistics - returns aggregate counts', async () => {
    const json = await fetchJson('/registrars/statistics')
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
    const stats = json.data.find(
      (entry: any) => entry.registrar.id === fixtures.registrar.id
    )
    expect(stats.statistics.totalIdentities).toBeGreaterThan(0)
    expect(stats.statistics.verifiedIdentities).toBeGreaterThanOrEqual(1)
  })

  it('GET /events/:account - lists events for identity', async () => {
    const json = await fetchJson(`/events/${fixtureAccounts.identity}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    expect(json.data[0]).toMatchObject({
      interaction: 'CREATE',
      identity: { id: fixtures.identity.id },
    })
  })

  it('GET /history/:account - mirrors event history', async () => {
    const json = await fetchJson(`/history/${fixtureAccounts.identity}`)
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    expect(json.data[0].identity.id).toBe(fixtures.identity.id)
  })

  it('GET /authorities/allocation - filters by minimum allocation', async () => {
    const json = await fetchJson(
      '/authorities/allocation?minAllocation=5&limit=10'
    )
    expect(json.success).toBe(true)
    expect(json.count).toBeGreaterThan(0)
    expect(json.data.every((authority: any) => authority.allocation >= 5)).toBe(
      true
    )
  })

  it('GET /authorities/allocation - validates minAllocation input', async () => {
    const json = await fetchJson(
      '/authorities/allocation?minAllocation=-1',
      400
    )
    expect(json.success).toBe(false)
    expect(json.error).toMatch(/minAllocation/i)
  })
})

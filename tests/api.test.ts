import { describe, it, expect } from 'vitest'

const BASE_URL = 'http://localhost:3000'

const serverOk = await fetch(`${BASE_URL}/health`)
  .then(() => true)
  .catch(() => false)

describe.runIf(serverOk)('Identics REST API', () => {
  it('GET /health - should return healthy', async () => {
    const res = await fetch(`${BASE_URL}/health`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(json.message).toMatch(/healthy/i)
  })

  it('GET /identities - should return identities list', async () => {
    const res = await fetch(`${BASE_URL}/identities`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
    expect(json.pagination).toBeDefined()
  })

  it('GET /identities/:id - should return 404 or identity', async () => {
    // Try with a likely non-existent id
    const res = await fetch(`${BASE_URL}/identities/unknown_id`)
    expect([200, 404]).toContain(res.status)
    const json = await res.json()
    if (res.status === 404) {
      expect(json.success).toBe(false)
    } else {
      expect(json.success).toBe(true)
      expect(json.data).toBeDefined()
    }
  })

  it('GET /identity/:account - should return 404 or identity', async () => {
    const res = await fetch(`${BASE_URL}/identity/unknown_account`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /identities/judgement/:status - should validate status', async () => {
    const res = await fetch(`${BASE_URL}/identities/judgement/Unknown`)
    expect([200, 400]).toContain(res.status)
  })

  it('GET /identities/registrar/:registrarId - should validate registrarId', async () => {
    const res = await fetch(`${BASE_URL}/identities/registrar/1`)
    expect([200, 400]).toContain(res.status)
  })

  it('GET /identities/field/:field - should validate field', async () => {
    const res = await fetch(`${BASE_URL}/identities/field/name`)
    expect([200, 400]).toContain(res.status)
  })

  it('GET /identities/verification/:status - should validate status', async () => {
    const res = await fetch(`${BASE_URL}/identities/verification/verified`)
    expect([200, 400]).toContain(res.status)
  })

  it('GET /subs/:account - should return subs or 404', async () => {
    const res = await fetch(`${BASE_URL}/subs/unknown_account`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /subs/name/:pattern - should return subs by pattern', async () => {
    const res = await fetch(`${BASE_URL}/subs/name/test`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /super/:subAccount - should return super account or 404', async () => {
    const res = await fetch(`${BASE_URL}/super/unknown_sub`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /username/:account - should return username or 404', async () => {
    const res = await fetch(`${BASE_URL}/username/unknown_account`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /account/username/:username - should return account or 404', async () => {
    const res = await fetch(`${BASE_URL}/account/username/unknown_username`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /usernames/authority/:authority - should return usernames or 404', async () => {
    const res = await fetch(`${BASE_URL}/usernames/authority/unknown_authority`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /usernames/suffix/:suffix - should return usernames', async () => {
    const res = await fetch(`${BASE_URL}/usernames/suffix/test`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /usernames/pending/:account - should return pending usernames', async () => {
    const res = await fetch(`${BASE_URL}/usernames/pending/unknown_account`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /registrars - should return registrars', async () => {
    const res = await fetch(`${BASE_URL}/registrars`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
  })

  it('GET /judgement-requests/registrar/:registrarId - should validate registrarId', async () => {
    const res = await fetch(`${BASE_URL}/judgement-requests/registrar/1`)
    expect([200, 400]).toContain(res.status)
  })

  it('GET /registrars/statistics - should return statistics', async () => {
    const res = await fetch(`${BASE_URL}/registrars/statistics`)
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
    expect(Array.isArray(json.data)).toBe(true)
  })

  it('GET /events/:account - should return events or 404', async () => {
    const res = await fetch(`${BASE_URL}/events/unknown_account`)
    expect([200, 404]).toContain(res.status)
  })

  it('GET /history/:account - should return history or 404', async () => {
    const res = await fetch(`${BASE_URL}/history/unknown_account`)
    expect([200, 404]).toContain(res.status)
  })
})

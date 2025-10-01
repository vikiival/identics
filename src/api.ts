import { serve } from '@hono/node-server'
import { createOrmConfig } from '@subsquid/typeorm-config'
import { Hono } from 'hono'
import { serializer } from '@kodadot1/metasquid'
import { DataSource } from 'typeorm'
import { ensurePositiveFixtureData } from './api/seedFixtures'
import {
  Identity,
  Sub,
  Username,
  Registrar,
  Authority,
  Event,
  Judgement,
  UsernameStatus,
} from './model'

const app = new Hono()
const cfg = createOrmConfig({ projectDir: process.cwd() })
const dataSource = new DataSource(cfg)

// GET /identities - Get all identities with optional filtering and pagination
app.get('/identities', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '50')
    const name = c.req.query('name')
    const twitter = c.req.query('twitter')
    const origin = c.req.query('origin')

    const store = dataSource.manager

    // Build query with optional filters
    const queryBuilder = store.createQueryBuilder(Identity, 'identity')

    // Add filters based on query parameters
    if (name) {
      queryBuilder.andWhere('identity.name ILIKE :name', { name: `%${name}%` })
    }

    if (twitter) {
      queryBuilder.andWhere('identity.twitter ILIKE :twitter', {
        twitter: `%${twitter}%`,
      })
    }

    if (origin) {
      queryBuilder.andWhere('identity.origin = :origin', { origin })
    }

    // Add pagination and ordering
    queryBuilder
      .orderBy('identity.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [identities, total] = await queryBuilder.getManyAndCount()

    const result = {
      identities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(result.identities, serializer)),
      count: result.identities.length,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error fetching identities:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identities',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// GET /identities/:id - Get a specific identity by ID
app.get('/identities/:id', async (c) => {
  const id = c.req.param('id')

  try {
    const store = dataSource.manager

    const identity = await store.findOne(Identity, {
      where: { id },
      relations: ['usernames', 'subs', 'events'],
    })

    if (!identity) {
      return c.json(
        {
          success: false,
          error: 'Identity not found',
        },
        404
      )
    }

    // Use the serializer to handle BigInt and other special types
    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identity, serializer)),
    })
  } catch (error) {
    console.error('Error fetching identity:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identity',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// Health check endpoint
app.get('/health', (c) => {
  return c.json({
    success: true,
    message: 'Identics API is healthy',
    timestamp: new Date().toISOString(),
  })
})

// 6a. API Implementation: identityByAccount
app.get('/identity/:account', async (c) => {
  const account = c.req.param('account')

  try {
    const store = dataSource.manager

    const identity = await store.findOne(Identity, {
      where: { id: account },
      relations: ['usernames', 'subs', 'events'],
    })

    if (!identity) {
      return c.json(
        {
          success: false,
          error: 'Identity not found',
        },
        404
      )
    }

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identity, serializer)),
    })
  } catch (error) {
    console.error('Error fetching identity by account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identity',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6b. API Implementation: identityListByJudgement
app.get('/identities/judgement/:status', async (c) => {
  const status = c.req.param('status') as Judgement
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    // Validate judgement status
    if (!Object.values(Judgement).includes(status)) {
      return c.json(
        {
          success: false,
          error: 'Invalid judgement status',
          validStatuses: Object.values(Judgement),
        },
        400
      )
    }

    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Identity, 'identity')
      .where('identity.judgement = :status', { status })
      .orderBy('identity.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [identities, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identities, serializer)),
      count: identities.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching identities by judgement:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identities by judgement',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6c. API Implementation: identityListByRegistrar
app.get('/identities/registrar/:registrarId', async (c) => {
  const registrarId = parseInt(c.req.param('registrarId'))
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    if (isNaN(registrarId)) {
      return c.json(
        {
          success: false,
          error: 'Invalid registrar ID',
        },
        400
      )
    }

    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Identity, 'identity')
      .where('identity.registrar = :registrarId', { registrarId })
      .orderBy('identity.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [identities, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identities, serializer)),
      count: identities.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching identities by registrar:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identities by registrar',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6d. API Implementation: subsByAccount
app.get('/subs/:account', async (c) => {
  const account = c.req.param('account')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Sub, 'sub')
      .leftJoinAndSelect('sub.identity', 'identity')
      .where('identity.id = :account', { account })
      .orderBy('sub.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [subs, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(subs, serializer)),
      count: subs.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching subs by account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch subs by account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6e. API Implementation: subsListByName
app.get('/subs/name/:pattern', async (c) => {
  const pattern = c.req.param('pattern')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Sub, 'sub')
      .leftJoinAndSelect('sub.identity', 'identity')
      .where('sub.name ILIKE :pattern', { pattern: `%${pattern}%` })
      .orderBy('sub.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [subs, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(subs, serializer)),
      count: subs.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching subs by name pattern:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch subs by name pattern',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6g. API Implementation: registrarList
app.get('/registrars', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Registrar, 'registrar')
      .orderBy('registrar.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [registrars, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(registrars, serializer)),
      count: registrars.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching registrars:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch registrars',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6h. API Implementation: usernameByAccount
app.get('/username/:account', async (c) => {
  const account = c.req.param('account')

  try {
    const store = dataSource.manager
    const username = await store.findOne(Username, {
      where: {
        address: account,
        primary: true,
      },
      relations: ['identity'],
    })

    if (!username) {
      return c.json(
        {
          success: false,
          error: 'Primary username not found for this account',
        },
        404
      )
    }

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(username, serializer)),
    })
  } catch (error) {
    console.error('Error fetching username by account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch username by account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6i. API Implementation: accountByUsername
app.get('/account/username/:username', async (c) => {
  const username = c.req.param('username')

  try {
    const store = dataSource.manager
    const usernameRecord = await store.findOne(Username, {
      where: { name: username },
      relations: ['identity'],
    })

    if (!usernameRecord) {
      return c.json(
        {
          success: false,
          error: 'Account not found for this username',
        },
        404
      )
    }

    return c.json({
      success: true,
      data: {
        account: usernameRecord.identity?.id || usernameRecord.address,
        username: usernameRecord.name,
        primary: usernameRecord.primary,
        status: usernameRecord.status,
      },
    })
  } catch (error) {
    console.error('Error fetching account by username:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch account by username',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6j. API Implementation: usernameListByAuthority
app.get('/usernames/authority/:authority', async (c) => {
  const authority = c.req.param('authority')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    // First check if authority exists
    const store = dataSource.manager
    const authorityRecord = await store.findOne(Authority, {
      where: { address: authority },
    })

    if (!authorityRecord) {
      return c.json(
        {
          success: false,
          error: 'Authority not found',
        },
        404
      )
    }

    // Find usernames with the authority's suffix
    const queryBuilder = store
      .createQueryBuilder(Username, 'username')
      .leftJoinAndSelect('username.identity', 'identity')
      .where('username.name LIKE :suffix', {
        suffix: `%.${authorityRecord.suffix}`,
      })
      .orderBy('username.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [usernames, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(usernames, serializer)),
      count: usernames.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching usernames by authority:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch usernames by authority',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6k. API Implementation: usernameListBySuffix
app.get('/usernames/suffix/:suffix', async (c) => {
  const suffix = c.req.param('suffix')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Username, 'username')
      .leftJoinAndSelect('username.identity', 'identity')
      .where('username.name LIKE :suffix', { suffix: `%.${suffix}` })
      .orderBy('username.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [usernames, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(usernames, serializer)),
      count: usernames.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching usernames by suffix:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch usernames by suffix',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6l. API Implementation: pendingUsernamesByAccount
app.get('/usernames/pending/:account', async (c) => {
  const account = c.req.param('account')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Username, 'username')
      .leftJoinAndSelect('username.identity', 'identity')
      .where('identity.id = :account', { account })
      .andWhere('username.status IN (:...pendingStatuses)', {
        pendingStatuses: [UsernameStatus.Queued, UsernameStatus.Unbinding],
      })
      .orderBy('username.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [usernames, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(usernames, serializer)),
      count: usernames.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching pending usernames by account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch pending usernames by account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6m. API Implementation: identityListByField
app.get('/identities/field/:field', async (c) => {
  const field = c.req.param('field').toLowerCase()
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const validFields = [
      'name',
      'legal',
      'web',
      'matrix',
      'email',
      'image',
      'twitter',
      'github',
      'discord',
    ]

    if (!validFields.includes(field)) {
      return c.json(
        {
          success: false,
          error: 'Invalid field name',
          validFields,
        },
        400
      )
    }

    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Identity, 'identity')
      .where(`identity.${field} IS NOT NULL`)
      .andWhere(`identity.${field} != ''`)
      .orderBy('identity.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [identities, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identities, serializer)),
      count: identities.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching identities by field:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identities by field',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6n. API Implementation: superAccountBySubAccount
app.get('/super/:subAccount', async (c) => {
  const subAccount = c.req.param('subAccount')

  try {
    const store = dataSource.manager
    const sub = await store.findOne(Sub, {
      where: { id: subAccount },
      relations: ['identity'],
    })

    if (!sub || !sub.identity) {
      return c.json(
        {
          success: false,
          error: 'Main identity account not found for this sub-account',
        },
        404
      )
    }

    return c.json({
      success: true,
      data: {
        subAccount: sub.id,
        superAccount: sub.identity.id,
        subName: sub.name,
        identity: JSON.parse(JSON.stringify(sub.identity, serializer)),
      },
    })
  } catch (error) {
    console.error('Error fetching super account by sub account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch super account by sub account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6o. API Implementation: identityEventsByAccount
app.get('/events/:account', async (c) => {
  const account = c.req.param('account')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const interaction = c.req.query('interaction')

  try {
    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Event, 'event')
      .leftJoinAndSelect('event.identity', 'identity')
      .where('identity.id = :account', { account })

    if (interaction) {
      queryBuilder.andWhere('event.interaction = :interaction', { interaction })
    }

    queryBuilder
      .orderBy('event.timestamp', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [events, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(events, serializer)),
      count: events.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching identity events by account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identity events by account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6p. API Implementation: judgementRequestsByRegistrar
app.get('/judgement-requests/registrar/:registrarId', async (c) => {
  const registrarId = parseInt(c.req.param('registrarId'))
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    if (isNaN(registrarId)) {
      return c.json(
        {
          success: false,
          error: 'Invalid registrar ID',
        },
        400
      )
    }

    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Identity, 'identity')
      .where('identity.registrar = :registrarId', { registrarId })
      .andWhere('identity.judgement = :status', { status: Judgement.FeePaid })
      .orderBy('identity.updatedAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [identities, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identities, serializer)),
      count: identities.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching judgement requests by registrar:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch judgement requests by registrar',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6q. API Implementation: authorityListByAllocation
app.get('/authorities/allocation', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')
  const minAllocation = parseInt(c.req.query('minAllocation') || '0')

  try {
    if (isNaN(page) || page < 1) {
      return c.json(
        {
          success: false,
          error: 'Invalid page parameter',
        },
        400
      )
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return c.json(
        {
          success: false,
          error: 'Invalid limit parameter',
          constraints: {
            min: 1,
            max: 100,
          },
        },
        400
      )
    }

    if (isNaN(minAllocation) || minAllocation < 0) {
      return c.json(
        {
          success: false,
          error: 'Invalid minAllocation parameter',
          constraints: {
            min: 0,
          },
        },
        400
      )
    }

    const store = dataSource.manager
    const queryBuilder = store
      .createQueryBuilder(Authority, 'authority')
      .where('authority.allocation IS NOT NULL')
      .andWhere('authority.allocation >= :minAllocation', { minAllocation })
      .orderBy('authority.allocation', 'DESC')
      .addOrderBy('authority.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [authorities, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(authorities, serializer)),
      count: authorities.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching authorities by allocation:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch authorities by allocation',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6r. API Implementation: identityListByVerificationStatus
app.get('/identities/verification/:status', async (c) => {
  const status = c.req.param('status').toLowerCase()
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager
    let queryBuilder = store.createQueryBuilder(Identity, 'identity')

    switch (status) {
      case 'verified':
        queryBuilder = queryBuilder.where(
          'identity.judgement IN (:...verifiedStatuses)',
          {
            verifiedStatuses: [Judgement.KnownGood, Judgement.Reasonable],
          }
        )
        break
      case 'unverified':
        queryBuilder = queryBuilder.where(
          'identity.judgement IS NULL OR identity.judgement = :unknown',
          {
            unknown: Judgement.Unknown,
          }
        )
        break
      case 'rejected':
        queryBuilder = queryBuilder.where(
          'identity.judgement IN (:...rejectedStatuses)',
          {
            rejectedStatuses: [
              Judgement.Erroneous,
              Judgement.LowQuality,
              Judgement.OutOfDate,
            ],
          }
        )
        break
      case 'pending':
        queryBuilder = queryBuilder.where('identity.judgement = :feePaid', {
          feePaid: Judgement.FeePaid,
        })
        break
      default:
        return c.json(
          {
            success: false,
            error: 'Invalid verification status',
            validStatuses: ['verified', 'unverified', 'rejected', 'pending'],
          },
          400
        )
    }

    queryBuilder
      .orderBy('identity.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)

    const [identities, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(identities, serializer)),
      count: identities.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching identities by verification status:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identities by verification status',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6s. API Implementation: identityHistoryByAccount
app.get('/history/:account', async (c) => {
  const account = c.req.param('account')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '50')

  try {
    const store = dataSource.manager

    // Get all events for the account sorted by timestamp
    const queryBuilder = store
      .createQueryBuilder(Event, 'event')
      .leftJoinAndSelect('event.identity', 'identity')
      .where('identity.id = :account', { account })
      .orderBy('event.timestamp', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [events, total] = await queryBuilder.getManyAndCount()

    return c.json({
      success: true,
      data: JSON.parse(JSON.stringify(events, serializer)),
      count: events.length,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching identity history by account:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch identity history by account',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

// 6t. API Implementation: registrarStatistics
app.get('/registrars/statistics', async (c) => {
  try {
    const store = dataSource.manager

    // Get all registrars
    const registrars = await store.find(Registrar)
    console.log(Array.isArray(registrars))

    // Get statistics for each registrar
    const statistics = await Promise.all(
      registrars.map(async (registrar) => {
        const totalIdentities = await store
          .createQueryBuilder(Identity, 'identity')
          .select('COUNT(*)', 'count')
          .where('identity.registrar = :registrarId', {
            registrarId: parseInt(registrar.id),
          })
          .getRawOne()

        const verifiedIdentities = await store
          .createQueryBuilder(Identity, 'identity')
          .select('COUNT(*)', 'count')
          .where('identity.registrar = :registrarId', {
            registrarId: parseInt(registrar.id),
          })
          .andWhere('identity.judgement IN (:...verifiedStatuses)', {
            verifiedStatuses: [Judgement.KnownGood, Judgement.Reasonable],
          })
          .getRawOne()

        const pendingIdentities = await store
          .createQueryBuilder(Identity, 'identity')
          .select('COUNT(*)', 'count')
          .where('identity.registrar = :registrarId', {
            registrarId: parseInt(registrar.id),
          })
          .andWhere('identity.judgement = :feePaid', {
            feePaid: Judgement.FeePaid,
          })
          .getRawOne()

        return {
          registrar: JSON.parse(JSON.stringify(registrar, serializer)),
          statistics: {
            totalIdentities: parseInt(totalIdentities?.count || '0'),
            verifiedIdentities: parseInt(verifiedIdentities?.count || '0'),
            pendingIdentities: parseInt(pendingIdentities?.count || '0'),
          },
        }
      })
    )

    return c.json({
      success: true,
      data: statistics,
      count: statistics.length,
    })
  } catch (error) {
    console.error('Error fetching registrar statistics:', error)
    return c.json(
      {
        success: false,
        error: 'Failed to fetch registrar statistics',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
})

async function bootstrap() {
  try {
    await dataSource.initialize()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Error during DataSource initialization:', error)
    throw error
  }

  try {
    // await ensureFixtureSeedData(dataSource)
    await ensurePositiveFixtureData(dataSource)
    console.log('🌱 Fixture data is ready')
  } catch (error) {
    console.error('❌ Failed to seed fixture data:', error)
    throw error
  }

  const port = parseInt(process.env.PORT || '3000')

  console.log(`🚀 Starting Identics API server on port ${port}`)

  return serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      console.log(`✅ Server is running on http://localhost:${info.port}`)
      console.log(`📊 Available endpoints:`)
      console.log(``)
      console.log(`🔍 General:`)
      console.log(`  GET /health - Health check`)
      console.log(
        `  GET /identities - Get all identities (with optional filters)`
      )
      console.log(`  GET /identities/:id - Get specific identity by ID`)
      console.log(``)
      console.log(`👤 Identity APIs:`)
      console.log(
        `  GET /identity/:account - Get complete identity by account address`
      )
      console.log(
        `  GET /identities/judgement/:status - Get identities by judgement status`
      )
      console.log(
        `  GET /identities/registrar/:registrarId - Get identities by registrar`
      )
      console.log(
        `  GET /identities/field/:field - Get identities with specific field verified`
      )
      console.log(
        `  GET /identities/verification/:status - Get identities by verification status`
      )
      console.log(``)
      console.log(`👥 Sub-account APIs:`)
      console.log(`  GET /subs/:account - Get sub-accounts for main identity`)
      console.log(
        `  GET /subs/name/:pattern - Get sub-accounts by name pattern`
      )
      console.log(
        `  GET /super/:subAccount - Get main identity for sub-account`
      )
      console.log(``)
      console.log(`🏷️ Username APIs:`)
      console.log(`  GET /username/:account - Get primary username for account`)
      console.log(`  GET /account/username/:username - Get account by username`)
      console.log(
        `  GET /usernames/authority/:authority - Get usernames by authority`
      )
      console.log(`  GET /usernames/suffix/:suffix - Get usernames by suffix`)
      console.log(
        `  GET /usernames/pending/:account - Get pending usernames for account`
      )
      console.log(``)
      console.log(`🏛️ Registrar APIs:`)
      console.log(`  GET /registrars - Get all registrars`)
      console.log(
        `  GET /judgement-requests/registrar/:registrarId - Get pending requests by registrar`
      )
      console.log(`  GET /registrars/statistics - Get registrar statistics`)
      console.log(``)
      console.log(`📈 Analytics & History:`)
      console.log(`  GET /events/:account - Get identity events by account`)
      console.log(`  GET /history/:account - Get identity history by account`)
      console.log(
        `  GET /authorities/allocation - Get authorities filtered by allocation`
      )
      console.log(``)
      console.log(`Query parameters:`)
      console.log(
        `  ?page=1&limit=50 - Pagination (available on list endpoints)`
      )
      console.log(`  ?interaction=SET - Filter events by interaction type`)
      console.log(
        `  ?name=alice - Filter identities by name (case insensitive)`
      )
      console.log(`  ?twitter=handle - Filter identities by Twitter handle`)
      console.log(`  ?origin=PEOPLE - Filter by chain origin (PEOPLE or RELAY)`)
      console.log(``)
      console.log(
        `Valid judgement statuses: ${Object.values(Judgement).join(', ')}`
      )
      console.log(
        `Valid verification statuses: verified, unverified, rejected, pending`
      )
      console.log(
        `Valid identity fields: name, legal, web, matrix, email, image, twitter, github, discord`
      )
    }
  )
}

bootstrap().catch((error) => {
  console.error('❌ Failed to start Identics API server', error)
  process.exit(1)
})
// export default app

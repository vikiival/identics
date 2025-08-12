import { serve } from '@hono/node-server'
import { createOrmConfig } from '@subsquid/typeorm-config'
import { Hono } from 'hono'
import { serializer } from '@kodadot1/metasquid'
import { Identity } from './model'

const app = new Hono()

import { DataSource } from 'typeorm'
const cfg = createOrmConfig({ projectDir: process.cwd() })
const dataSource = new DataSource(cfg)

// Initialize the data source
dataSource
  .initialize()
  .then(() => {
    console.log('✅ Database connected successfully')
  })
  .catch((error) => {
    console.error('❌ Error during DataSource initialization:', error)
  })

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

const port = parseInt(process.env.PORT || '3000')

console.log(`🚀 Starting Identics API server on port ${port}`)

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`✅ Server is running on http://localhost:${info.port}`)
    console.log(`📊 Available endpoints:`)
    console.log(`  GET /health - Health check`)
    console.log(
      `  GET /identities - Get all identities (with optional filters)`
    )
    console.log(`  GET /identities/:id - Get specific identity by ID`)
    console.log(``)
    console.log(`Query parameters for /identities:`)
    console.log(`  ?page=1&limit=50 - Pagination`)
    console.log(`  ?name=alice - Filter by name (case insensitive)`)
    console.log(`  ?twitter=handle - Filter by Twitter handle`)
    console.log(`  ?origin=PEOPLE - Filter by chain origin (PEOPLE or RELAY)`)
  }
)
// export default app

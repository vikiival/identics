import { serve } from '@hono/node-server'
import { createOrmConfig } from '@subsquid/typeorm-config'
import { Hono } from 'hono'
import { Identity } from './model'

const app = new Hono()

import { DataSource } from 'typeorm'
const cfg = createOrmConfig({ projectDir: process.cwd() })
const dataSource = new DataSource(cfg)

// Initialize the data source
dataSource
  .initialize()
  .then(() => {
    console.log('DataSource initialized:', dataSource.options)
  })
  .catch((error) => {
    console.error('Error during DataSource initialization:', error)
  })

console.log('DataSource initialized:', dataSource.options)

// GET /identities - Get all identities with optional filtering and pagination
app.get('/identities', async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '50')
    const name = c.req.query('name')
    const twitter = c.req.query('twitter')
    const origin = c.req.query('origin')

    const store = dataSource.manager

    console.log(store)

    // For now, let's use a simple find without complex query builder
    // since we need to understand the Subsquid store API better
    const identities = await store.find(Identity, {
      order: { createdAt: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    })

    // Get total count - this might need adjustment based on Subsquid store API
    const total = await store.count(Identity)

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
      data: result.identities,
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
// app.get('/identities/:id', async (c) => {
//   const id = c.req.param('id')

//   try {
//     const result = await withDatabase(async (store) => {
//       const identity = await store.findOne(Identity, {
//         where: { id },
//         relations: ['usernames', 'subs', 'events'],
//       })

//       return identity
//     })

//     if (!result) {
//       return c.json(
//         {
//           success: false,
//           error: 'Identity not found',
//         },
//         404
//       )
//     }

//     return c.json({
//       success: true,
//       data: result,
//     })
//   } catch (error) {
//     console.error('Error fetching identity:', error)
//     return c.json(
//       {
//         success: false,
//         error: 'Failed to fetch identity',
//         message: error instanceof Error ? error.message : 'Unknown error',
//       },
//       500
//     )
//   }
// })

app.get('/db', (c) => {
  return c.json({
    success: true,
    message: 'Identics API is healthy',
    timestamp: new Date().toISOString(),
  })
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

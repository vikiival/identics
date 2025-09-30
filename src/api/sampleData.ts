import md5 from 'md5'

export enum Judgement {
  Erroneous = 'Erroneous',
  FeePaid = 'FeePaid',
  KnownGood = 'KnownGood',
  LowQuality = 'LowQuality',
  OutOfDate = 'OutOfDate',
  Reasonable = 'Reasonable',
  Unknown = 'Unknown',
}

export enum ChainOrigin {
  RELAY = 'RELAY',
  PEOPLE = 'PEOPLE',
}

export enum AddressType {
  Ethereum = 'Ethereum',
  Substrate = 'Substrate',
}

export enum UsernameStatus {
  Active = 'Active',
  Unbinding = 'Unbinding',
  Queued = 'Queued',
  Removed = 'Removed',
}

export enum Interaction {
  CREATE = 'CREATE',
  CLEAR = 'CLEAR',
  DESTROY = 'DESTROY',
  CHANGE = 'CHANGE',
}

export const fixtureAccounts = {
  identity: '1C42oGF3s8ztCsc22MA4LKd8BogMJNdVmCgtTXGfxqwjrSb',
  subAccount: '14fvrw92d9X4JcJ2a65i9KMkgHgN4y4yjVjHHRGPSxnUgnSY',
  authority: '152Rg99tAkt8BM3H9VcV88dxWys2WpZQ8r3LuVyAUozmzcv7',
}

const baseTimestamp = new Date('2024-02-01T12:00:00.000Z')

export const identityFixture = {
  id: '1C42oGF3s8ztCsc22MA4LKd8BogMJNdVmCgtTXGfxqwjrSb',
  name: 'SubWallet',
  legal: 'GIONG NETWORK PTE. LTD.',
  web: 'https://www.subwallet.app/',
  matrix: '@hieudao:matrix.org',
  email: 'agent@subwallet.app',
  image: null,
  twitter: '@subwalletapp',
  github: 'https://github.com/Koniverse',
  discord: 'https://discord.gg/rz2CyFSqWE',
  judgement: Judgement.Reasonable,
  registrar: 3,
  hash: '0x90e1de45222a2ea5526073b60fa967c0145f778e1304474700daa5f393d22d49',
  blockNumber: BigInt(769522),
  updatedAt: new Date('2024-11-07T08:40:12.000Z'),
  createdAt: new Date('2024-11-06T16:02:06.000Z'),
  origin: ChainOrigin.PEOPLE,
  burned: false,
  type: AddressType.Substrate,
  deposit: BigInt(0),
}

export const registrarFixture = {
  id: '3',
  address: '13SceNt2ELz3ti4rnQbY1snpYH4XE4fLFsW8ph9rpwJd6HFC',
  blockNumber: BigInt(3026699),
  updatedAt: new Date('2025-09-28T20:03:18.000Z'),
  createdAt: new Date('2025-09-28T20:03:18.000Z'),
  origin: ChainOrigin.PEOPLE,
  fee: BigInt(5000000000),
  field: BigInt(0),
}

export const subFixture = {
  id: '14fvrw92d9X4JcJ2a65i9KMkgHgN4y4yjVjHHRGPSxnUgnSY',
  name: 'OpenGov',
  blockNumber: BigInt(2898198),
  updatedAt: new Date('2025-09-07T14:30:30.000Z'),
  createdAt: new Date('2025-09-07T14:30:30.000Z'),
  origin: ChainOrigin.PEOPLE,
  type: AddressType.Substrate,
  deposit: BigInt(500000000),
}

export const usernamesFixtures = [
  {
    id: 'mikeandroid1.dot',
    primary: true,
    name: 'mikeandroid1.dot',
    address: '1Kn8cMm9HjNpsgtqm1FusA2xpcvyFMKVzgyVYcnWfT5JWb7',
    blockNumber: BigInt(1651313),
    createdAt: new Date('2025-03-10T14:23:42.000Z'),
    gracePeriod: BigInt(0),
    status: UsernameStatus.Active,
  },
  {
    id: 'mikeandroid2.dot',
    primary: false,
    name: 'mikeandroid2.dot',
    address: '1Kn8cMm9HjNpsgtqm1FusA2xpcvyFMKVzgyVYcnWfT5JWb7',
    blockNumber: BigInt(0),
    createdAt: new Date('2025-03-10T14:23:42.000Z'),
    gracePeriod: BigInt(0),
    status: UsernameStatus.Queued,
  },
]

export const authorityFixtures = [
  {
    id: fixtureAccounts.authority,
    address: fixtureAccounts.authority,
    suffix: 'dot',
    blockNumber: BigInt(12345670),
    updatedAt: baseTimestamp,
    createdAt: baseTimestamp,
    origin: ChainOrigin.PEOPLE,
    allocation: 999658,
  },
]

export const eventFixtures = [
  {
    id: md5(fixtureAccounts.identity + baseTimestamp.toISOString()),
    blockNumber: BigInt(12345682),
    timestamp: new Date('2024-02-01T12:05:00.000Z'),
    caller: fixtureAccounts.identity,
    currentOwner: fixtureAccounts.identity,
    interaction: Interaction.CREATE,
    meta: 'Fixture identity created',
  },
]

export const fixtureSummary = {
  identity: identityFixture,
  registrar: registrarFixture,
  sub: subFixture,
  usernames: usernamesFixtures,
  authorities: authorityFixtures,
  events: eventFixtures,
}

export type FixtureSummary = typeof fixtureSummary

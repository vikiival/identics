import {
  ArchiveCallWithOptionalValue,
  Optional,
  Store,
} from '@kodadot1/metasquid/types'
import * as ss58 from '@subsquid/ss58'
import { decodeHex } from '@subsquid/substrate-processor'
import { AddressType } from '../model'
import md5 from 'md5'

const codec = 'polkadot'

/**
 * Check if an object is empty
 * @param obj - the object to check
 */
export function isEmpty(obj: Record<string, unknown>): boolean {
  // eslint-disable-next-line guard-for-in, @typescript-eslint/naming-convention, no-unreachable-loop
  for (const _ in obj) {
    return false
  }
  return true
}

/**
 * Export the value from the archive object { __kind, value }
 * @param call - the call to extract the value from
 */
export function onlyValue(call: ArchiveCallWithOptionalValue): string {
  return call?.value
}

/**
 * Check if a value is a hex string
 * @param value - the value to check
 */
export function isHex(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length % 2 === 0 &&
    /^0x[\da-f]*$/i.test(value)
  )
}

/**
 * Decode an ss58 address from the value
 * @param address - the address to decode
 */
export function addressOf(address: Uint8Array | string): string {
  const value = isHex(address) ? decodeHex(address) : address
  if (!value) {
    return ''
  }
  return ss58.codec(codec).encode(value)
}

/**
 * Decodes address type
 * @param address - the address to decode
 */
export function addressTypeOf(address: string): AddressType | undefined {
  if (!address) {
    return undefined
  }

  if (address.startsWith('0x')) {
    return AddressType.Ethereum
  }

  return isAddress(address) ? AddressType.Substrate : undefined
}

export function subNameOf(address: string, sub: string): string {
  if (!address || !sub) {
    throw new Error(`Invalid addr::${address} or sub::${address}`)
  }
  return `${address}/${md5(sub)}`
}

export function isAddress(value: Optional<string>): value is string {
  if (!value) {
    return false
  }

  try {
    ss58.decode(value)
    return true
  } catch {
    return false
  }
}

/**
 * Decode a hex value
 * @param value - the value to decode
 */
export function unHex<T>(value: T): T | string {
  return isHex(value) ? decodeHex(value).toString() : value
}

/**
 * create a token uri from the base uri and the token id
 * @param baseUri - base uri from the collection
 * @param tokenId - the token id
 */
export function tokenUri(
  baseUri: Optional<string>,
  tokenId: Optional<string>
): string {
  if (!baseUri || !tokenId) {
    return ''
  }

  const uri = baseUri.endsWith('/') ? baseUri : `${baseUri}/`
  return `${uri}${tokenId}`
}

export function str<T extends object | number>(value: Optional<T>): string {
  return value?.toString() || ''
}

/**
 * Prefix the value with the prefix
 * @param value - id
 * @param prefix - prefix
 */
export function idOf<T extends object | number>(
  value: Optional<T>,
  prefix: string = ''
): string {
  const val = str(value)
  return prefix && val ? `${prefix}-${val}` : val
}

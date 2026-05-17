import { test } from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeApiKey } from './sanitizeApiKey.ts'

test('passes through clean valid key unchanged', () => {
  const key = 'sk-ant-api03-' + 'a'.repeat(60)
  const r = sanitizeApiKey(key)
  assert.equal(r.clean, key)
  assert.equal(r.warning, null)
  assert.equal(r.valid, true)
})

test('strips em-dash silently (converts to ASCII -)', () => {
  // U+2014 EM DASH
  const dirty = 'sk-ant-api03-abc—def' + 'g'.repeat(50)
  const r = sanitizeApiKey(dirty)
  assert.ok(!/[—]/.test(r.clean))
  assert.ok(r.clean.includes('-'))
})

test('converts smart quotes and en-dash to ASCII', () => {
  const dirty = '“sk-ant”–api03-' + 'x'.repeat(60)
  const r = sanitizeApiKey(dirty)
  assert.ok(!/[“”–—―]/.test(r.clean))
})

test('strips invisible Unicode and reports count', () => {
  // U+200B ZERO WIDTH SPACE injected mid-key
  const dirty = 'sk-ant-api03-abc​def' + 'g'.repeat(50)
  const r = sanitizeApiKey(dirty)
  assert.equal(r.warning, 'Removed 1 invalid character(s) from pasted key.')
  assert.ok(!/​/.test(r.clean))
})

test('trims leading and trailing whitespace including NBSP', () => {
  const dirty = '    sk-ant-api03-' + 'a'.repeat(60) + '   '
  const r = sanitizeApiKey(dirty)
  assert.equal(r.clean.startsWith('sk-ant'), true)
  assert.equal(r.clean.endsWith('a'), true)
})

test('strips all whitespace inside key', () => {
  const dirty = 'sk-ant-\n api03-\t' + 'a'.repeat(60)
  const r = sanitizeApiKey(dirty)
  assert.ok(!/\s/.test(r.clean))
})

test('reports invalid when key does not start with sk-ant-', () => {
  const r = sanitizeApiKey('sk-proj-totallyfine' + 'x'.repeat(40))
  assert.equal(r.valid, false)
})

test('reports invalid when key is too short', () => {
  const r = sanitizeApiKey('sk-ant-tooshort')
  assert.equal(r.valid, false)
})

test('returns empty clean for empty input', () => {
  const r = sanitizeApiKey('')
  assert.equal(r.clean, '')
  assert.equal(r.valid, false)
})

const noop = require('noop2')
const test = require('tape')
const fsm = require('./')

noop()

test('should validate input states', function (t) {
  t.plan(2)

  const state1 = {
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  }

  const state2 = {
    UP: {down: 'DOWN'},
    DOWN: {up: 'END'}
  }

  t.doesNotThrow(fsm.bind(null, state1))
  t.throws(fsm.bind(null, state2), /state/)
})

test('m.on() should attach events', function (t) {
  t.plan(1)

  const m = fsm({
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m.on('UP', noop)
  t.equal(typeof m._emitter._events.UP, 'function')
})

test('m.emit() should catch invalid state transitions', function (t) {
  t.plan(2)

  const m = fsm({
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m('UP')
  t.equal(m._state, 'UP')
  t.throws(m.bind(null, 'END'))
})

test('m.emit() should set the state', function (t) {
  t.plan(3)

  const m = fsm({
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m.on('UP', function () {
    t.pass('cb called')
  })

  t.equal(m._state, null)
  m('UP')
  t.equal(m._state, 'UP')
})

test('m.emit() should emit enter events', function (t) {
  t.plan(2)

  const m = fsm({
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m.on('UP:enter', function (cb) {
    t.pass('enter')
    cb()
  })

  m.on('UP', function () {
    t.pass('UP')
  })

  m.emit('UP')
  m.emit('DOWN')
})

test('m.emit() should emit events in sequence', function (t) {
  t.plan(5)

  var i = 0
  const m = fsm({
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m.on('UP:enter', function (cb) {
    t.equal(++i, 1)
    cb()
  })

  m.on('UP', function () {
    t.equal(++i, 2)
  })

  m.on('UP:leave', function (cb) {
    t.equal(++i, 3)
    cb()
  })

  m.on('DOWN:enter', function (cb) {
    t.equal(++i, 4)
    cb()
  })

  m.on('DOWN', function () {
    t.equal(++i, 5)
  })

  m.emit('UP')
  m.emit('DOWN')
})

const test = require('tape')
const fsm = require('./')

test('should validate input values', function (t) {
  t.plan(4)

  t.throws(fsm.bind(null, 123, 123), /string/)
  t.throws(fsm.bind(null, 'UP', 123), /object/)

  const state1 = {
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  }

  t.doesNotThrow(fsm.bind(null, 'UP', state1))

  const state2 = {
    UP: {down: 'DOWN'},
    DOWN: {up: 'END'}
  }

  t.throws(fsm.bind(null, 'UP', state2), /state/)
})

test('m.on() should attach events', function (t) {
  t.plan(2)

  const m = fsm('UP', {
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m.on('DOWN', function () {
    t.pass('cb called')
  })

  t.equal(typeof m._emitter._events['DOWN'], 'function')
  m('down')
})

test('m.emit() should catch invalid state transitions', function (t) {
  t.plan(3)

  const m = fsm('UP', {
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  t.equal(m._state, 'UP')
  m('down')
  t.equal(m._state, 'DOWN')
  m.on('error', function (err) {
    t.equal(err, 'invalid transition: DOWN -> END')
  })
  m('END')
})

test('m.emit() should set the state', function (t) {
  t.plan(3)

  const m = fsm('UP', {
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })

  m.on('DOWN', function () {
    t.pass('cb called')
  })

  t.equal(m._state, 'UP')
  m('down')
  t.equal(m._state, 'DOWN')
})

test('m.emit() should emit enter events', function (t) {
  t.plan(2)

  const m = fsm('UP', {
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

  m.emit('down')
  m.emit('up')
})

test('m.emit() should emit events in sequence', function (t) {
  t.plan(5)

  var i = 0
  const m = fsm('DOWN', {
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

  m.emit('up')
  m.emit('down')
})

test('should emit an end event when done', function (t) {
  t.plan(1)
  const m = fsm('DOWN', {
    UP: {down: 'DOWN'},
    DOWN: {up: 'UP'}
  })
  m.on('done', function () {
    t.pass('called')
  })
  m.emit('up')
})

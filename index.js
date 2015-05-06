const EventEmitter = require('events').EventEmitter
const assert = require('assert')
const fsm = require('fsm')

module.exports = fsmEvent

// create an fsmEvent instance
// obj -> fn
function fsmEvent (events) {
  assert.equal(typeof events, 'object')
  assert.ok(fsm.validate(events))

  const emitter = new EventEmitter()
  emit.on = on
  emit.emit = emit
  emit._state = null
  emit._events = events
  emit._emitter = emitter
  emit._reachable = fsm.reachable(events)

  return emit

  // set a state listener
  // str, fn -> null
  function on (event, cb) {
    emitter.on(event, cb)
  }

  // change the state
  // str -> null
  function emit (str) {
    assert.ok(direct(emit._state, str, emit._reachable))

    const leaveEv = emit._state + ':leave'
    const enterEv = str + ':enter'

    if (!emit._state) return enter()
    return leave()

    function leave () {
      if (!emitter._events[leaveEv]) enter()
      else emitter.emit(leaveEv, enter)
    }

    function enter () {
      if (!emitter._events[enterEv]) done()
      else emitter.emit(enterEv, done)
    }

    function done () {
      emit._state = str
      emitter.emit(str)
    }
  }
}

// check if state can reach in reach
// str, str, obj -> bool
function direct (curr, next, reach) {
  if (!curr) return true

  const here = reach[curr]
  if (!here[next]) return false
  return here[next].length === 1
}

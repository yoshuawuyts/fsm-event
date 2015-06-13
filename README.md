# fsm-event
[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Downloads][downloads-image]][downloads-url]
[![js-standard-style][standard-image]][standard-url]

Stateful finite state machine wrapper around
[`fsm`](https://github.com/dominictarr/fsm). Emits events when transitioning
states.

## Installation
```bash
$ npm install fsm-event
```

## Usage
```js
const fsm = require('fsm-event')

const m = fsm({
  START: {
    data: 'START',
    pause: 'PAUSED',
    end: 'END',
    error: 'ERROR'
  },
  PAUSED: {
    pause: 'PAUSED',
    resume: 'START',
    error: 'ERROR'
  },
  ERROR: {},
  END: {}
})

m.on('START:leave', cb => console.log('leaving start!'); cb())
m.on('PAUSED', () => console.log('paused state!'))

m('START')
m('PAUSED')
// 'leaving start'
// 'paused state!'
```

## API
### m = fsm(events)
Create a state machine.

### m.on(event, cb)
Attach a listener to the state machine.

### m(event)
Transition states in the state machine. Must be a valid state defined on init.
Will throw if an invalid transition is triggered. Alias: `m.emit(event)`.

## Events
Each state transition triggers 3 events. __important:__ When listening to
`:enter` or `:leave` events, the callback must be called so that the state
machine can proceed to the next state.
```txt
<state>         main state function 
<state>:enter   called when transitioning into state
<state>:leave   called when transitioning away from state
```

## Why?
Most state machines have overly complicated interfaces for managing state. The
fsm state machine is simple but doesn't manage state for you, so I wrote a
wrapper around it that manages state in an event-driven way. The initial use
case was to manage complex, stateful UI elements but it can be used anywhere.

## See Also
- [fsm](https://github.com/dominictarr/fsm)
- [javascript-state-machine](https://github.com/jakesgordon/javascript-state-machine)
- [statement](https://github.com/timoxley/statement)
- [stream-fsm](https://www.npmjs.com/package/stream-fsm)

## License
[MIT](https://tldrlegal.com/license/mit-license)

[npm-image]: https://img.shields.io/npm/v/fsm-event.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fsm-event
[travis-image]: https://img.shields.io/travis/yoshuawuyts/fsm-event.svg?style=flat-square
[travis-url]: https://travis-ci.org/yoshuawuyts/fsm-event
[coveralls-image]: https://img.shields.io/coveralls/yoshuawuyts/fsm-event.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/yoshuawuyts/fsm-event?branch=master
[downloads-image]: http://img.shields.io/npm/dm/fsm-event.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/fsm-event
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard

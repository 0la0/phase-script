### Cycle-Patcher
A web based environment for real-time sound synthesis and pattern generation.

### Development
Install dependencies: `npm i`  
Start local server: `npm start`  
Navigate to `localhost:3001`

### Build
`npm run build`

### Browser Requirements
This project has a hard dependency on
* [Web Components V1](https://caniuse.com/#feat=custom-elementsv1)

And feature level dependencies on
* [Web Midi API](https://caniuse.com/#feat=midi) to interface with external synths and controllers
* [Broadcast Channel](https://caniuse.com/#feat=broadcastchannel) to interface with a graphics window

### TODO
* feature detection => incompatible browser warning
* remove all old and unused components
* necessity of multiple `onRemove`s
* linter progress
* separate core / audio / graphics bundles, dynamic imports
* replace component wrapper with a static name property
* replace instances of `setTimeout` with `TaskScheduler` (also batch all `connectedCallback` dom update timeouts.
* remove all instances of new Array()
* improve rendering efficiency of patch-space draggables
* Patcher components to create:
  - markov events
  - message macros
  - noise modulators
  - arpeggiator
* Input components:
  - MIDI
  - Keypress
  - particle velocity event (lemur like)

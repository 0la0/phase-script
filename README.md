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
* organize patcher components
* better styling consistency across chrome / ff / safari
* remove all old and unused components
* create second event network that is not based on threshold events
* necessity of multiple `onRemove`s
* linter
* velocity event triggers
* metronome scheduler class

### Cycle-Patcher
A web based environment for real-time sound synthesis and pattern generation.

### Build
Install dependencies: `npm i`  
Start local server: `npm start`  
Navigate to `localhost:3001`

### Browser Requirements
This project uses
* [Web Components V1.](https://caniuse.com/#feat=custom-elementsv1)
* [Web Midi API](https://caniuse.com/#feat=midi)
* [Broadcast Channel](https://caniuse.com/#feat=broadcastchannel) (to run a graphics window)

### TODO
* inlets for parameters
* organize patcher components
* safari support / FF 63 when it comes out
* remove all old and unused components
* create second event network that is not based on threshold events
* convert DOM maps to sets
* necessity of multiple `onRemove`s

### PhaseScript (In development)
A web based environment for real-time sound synthesis and pattern generation.  
The initial intent of this project was to create non-linear pattern generators for midi devices using native web components. It has since transformed into a live coding environment for sound, midi, and (hopefully) graphics.

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
* Web audio worklets

### TODO
* linter progress
* separate core / audio / graphics bundles, & use dynamic imports
* replace common component wrapper with a static name property
* feature detection => incompatible browser warnings
* remove all old and unused components
* document previous versions
* documentation and examples

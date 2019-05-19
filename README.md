### PhaseScript (In development)
[phasescripter.com](https://phasescripter.com)  
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
* [Web Audio Worklets](https://developer.mozilla.org/en-US/docs/Web/API/Worklet) for a few unit generators
* [Broadcast Channel](https://caniuse.com/#feat=broadcastchannel) to interface with a graphics window

### TODO
  * cancel overlapping audio events after cycle change
  * unit generators:
    - message duplicator
    - message delay (random params)
    - message repeater
    - mic in
    - compressor
    - arpeggiator
    - shelf filter
  * improve standard sample library
  * key shortcuts
    - comment lines
    - generate node ID
  * feature detection, incompatible browser warnings
  * in-line patterns
  * document previous versions
  * patterns
    - rename `.speed` to `.fast` and `.slow`
    - `waitFor`
    - `stopAfter`
  * remove services/midi/mappings directory (document mappings somewhere else)
  * documentation
    - function descriptions
    - parameter descriptions
    - improve getting started guide
    - key shortcuts
  * deploy with a CI tool
  * editor
    - customizable font / background color
    - strip styles on paste
  * save / open project

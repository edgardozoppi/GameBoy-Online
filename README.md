# JavaScript GameBoy Color Emulator

Fork of the JavaScript GameBoy Color Emulator made to improve the user experience in mobile devices.

This version makes the following changes:

- Allow to load and play local ROMs
- Support both portrait and landscape layouts
- Screen fills the entire window on desktop/tablet while keeping aspect ratio
- Use css `image-rendering: pixelated` rather than bilinear filtering
- Support for keyboard, mouse and touch controls
- Touch dpad controls using touch move with a deadzone
- Allow to pause and resume the game
- Auto save/load game state to resume previously played games
- Keyboard fix for iPad keyboard case that doesn't report keyup event keycode
- Keep screen awake while playing

## Usage

- Just visit https://edgardozoppi.github.io/GameBoy-Online/.
- Optionally you may want to install the WebApp in your device so you can use it as a standalone App. Please visit https://web.dev/learn/pwa/installation/ for more information.

## Keyboard Controls

Up - Up Arrow / W
Down - Down Arrow / S
Left - Left Arrow / A
Right - Right Arrow / D
A - Alt / X / K
B - Ctrl / Z / J
Start - Enter
Select - Shift
Pause - Space

Edit by changing `bindKeyboard` in `js/other/controls.js`.

## License

**Copyright (C) 2010 - 2016 Grant Galitz**

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# Sound Effects Guide

The application includes basic sound effects for an authentic retro gaming experience.

## Default Sound Effects

- `select.mp3`: Plays when navigating through menu items

## How to Add Custom Sound Effects

1. Create or find a short sound effect file in MP3 format.
2. Place the sound file in the `public` folder.
3. To replace the default menu selection sound, name your file `select.mp3`.

## Creating Your Own Sound Effects

To maintain the authentic retro game feel, consider these tips:

1. Keep sound effects short (0.1-0.5 seconds)
2. Use 8-bit style sounds for authenticity 
3. Simple waveforms (square, triangle, sine) work best
4. Low bit-rate (8-16kHz) can enhance the retro feel

## Free Resources

Here are some websites where you can find free retro game sound effects:

- [Freesound.org](https://freesound.org/search/?q=8bit)
- [OpenGameArt.org](https://opengameart.org/art-search-advanced?keys=retro+sound)
- [PixelProspector](https://pixelprospector.com/sound-effects)

## Disabling Sounds

To disable sounds, modify the `playSelectSound` function in the code or simply don't add any sound files to the public folder. 
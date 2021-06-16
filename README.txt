How To Use:

- Replace avatar.png with your own avatar image. I typically use avatars not much bigger than 500x500 pixels.
- Open avatar.html in a browser (Firefox works best since it keeps rendering even when the window is obscured)
- Add a window capture to OBS
    - Make sure to set "Window Match Priority" to "Windows Title Must Match"
      so that OBS always captures the correct window
    - Add a Crop/Pad filter to remove the browser border
    - Add a Chrome Key filter. The following settings work for my avatar (YMMV):
        - Similarity: 305
        - Smoothness: 145
        - Key Color Spill Reduction: 1


Tunable options:
- avatar.js
    - microphone sensitivity (activation_volume)
    - avatar movement (maxmargintop)
    - avatar dimming amount (minbrightness)
    - Animation speed (lerpspeed)
- avatar.css
    - background-color (the color you want to chroma key out)
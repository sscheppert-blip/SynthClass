# SynthClass

Learn how a synthesizer works by reading and twisting knobs at the same time.

SynthClass is a two-part, browser-based course with a playable teaching synth next to the text. Every chapter has try-it buttons that load a matching sound, play it and mark the controls that matter.

- **Part 1 · Basics** with the FUNKE 1: waveforms, pulse width and PWM, filter types, amp and envelopes, filter envelope, LFO, FM.
- **Part 2 · Advanced** with the FUNKE 2: hands-on additive overtones, two oscillators, detune, unison, hard sync, filter slopes, self-oscillation, keytracking, drive, mod slots, glide and legato.

Available in English and German (`/de`).

## Use it

Open `index.html` in a browser, or visit the GitHub Pages site. No build step, no dependencies besides Google Fonts.

Play with the mouse, the computer keyboard (keys shown on the piano) or a MIDI keyboard. MIDI needs a browser with Web MIDI support.

## How the sound is made

Everything runs in the browser with the Web Audio API. Part 1 uses Web Audio nodes plus a custom state-variable filter in an AudioWorklet; part 2 runs the complete voice (oscillators, unison, sync, filter, envelopes, LFOs, mod slots) in an AudioWorklet, so modulation is sample-accurate.

---

# SynthClass (Deutsch)

Ein zweiteiliger Synthesizer-Kurs im Browser, mit spielbarem Lernsynth direkt neben dem Text. Die deutsche Version liegt unter `/de`.

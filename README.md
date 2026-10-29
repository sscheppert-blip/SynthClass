# SynthClass

Learn how a synthesizer works by reading and twisting knobs at the same time.

SynthClass is a six-part, browser-based course with a playable teaching synth next to the text. Sound examples load a matching sound, play it and mark the controls that matter.

- **Part 1 · Basics** (`index.html`): basic waveforms, manual pulse width, filters, amp ADSR and filter ADSR. No PWM, LFO or FM controls or lessons.
- **Part 2 · Movement** (`advanced.html`): two oscillators, detune, unison and LFO including pulse width modulation (PWM), with a simple destination and depth control.
- **Part 3 · Modulation** (`modulation.html`): sources, destinations, positive and negative amounts, and a three-row modulation matrix with guided exercises.
- **Part 4 · Sequencer & arpeggiator** (`sequencer.html`): eight editable steps with rests, BPM, note division and gate; held-note arpeggiation with up, down and up/down directions and one or two octaves.
- **Part 5 · Drums & percussion** (`drums.html`): recipes and editable presets for an 808-style kick, closed and open hi-hat, snare, tom and woodstick. Builds each sound with oscillators, noise, filters and amplitude/pitch envelopes.
- **Part 6 · Synths & sounds** (`sounds.html`): how to build a key, stab, pad, lead and bass, with the focus on setting the amp and filter envelopes. Includes an envelope-only comparison, a cheat sheet and a POLY switch (up to eight voices) for chord sounds.

Available in English and German (`/de`).

## Use it

Open `index.html` in a browser, or visit the GitHub Pages site. No build step, no dependencies besides Google Fonts.

Play with a mouse, touch or your computer keyboard (keys shown on the piano). You only need a browser; no additional music equipment is required.

Every page starts with the synth expanded in a floating window beside the lesson on desktop. Its default size fits in the right half of the screen; controls wrap and the window scrolls independently. It can be moved, resized or docked. On narrow screens it sits above the text. Saved floating or collapsed window state is ignored.

Lesson examples end automatically within eight seconds plus envelope release and never enable note latching. Selecting a preset only loads its sound. Press **TEST (LOOP)** to audition it repeatedly (including the Acid line); the prominent **STOP** button ends playback. The manual note-latch control is labelled **LATCH NOTE** / **TON HALTEN**.

## How the sound is made

Everything runs in the browser with the Web Audio API. Part 1 uses Web Audio nodes plus a custom state-variable filter in an AudioWorklet; parts 2–6 run the complete voice in an AudioWorklet, so modulation is sample-accurate. Part 6 adds polyphony: with POLY on, up to eight voices share the same patch; with POLY off the synth behaves like parts 2–4 (mono, legato, glide). Part 5 adds noise as an oscillator waveform and resets oscillator/envelope phases on drum triggers. The teaching sequencer uses a browser timer; it is intended for learning rather than DAW synchronization. It stops when the page is hidden. The arpeggiator accepts notes from mouse/touch and the computer keyboard, or a latched C-major example chord.

Serve locally with `python -m http.server 8765` and open `http://localhost:8765/de/` for German. The German movement page is `de/fortgeschritten.html`; the other filenames match English. Shared teaching controls and layout live in `course.js` and `course.css`.

---

# SynthClass (Deutsch)

Ein sechsteiliger Synthesizer-Kurs im Browser: Grundlagen, Klangbewegung, Modulationsmatrix, achtstufiger Sequencer mit Arpeggiator, Drums und Percussion sowie Synths und Sounds (Key, Stab, Pad, Lead und Bass mit Schwerpunkt auf den Hüllkurven). Mit spielbarem Lernsynth direkt neben dem Text. Die deutsche Version liegt unter `/de`.

## License

Released into the public domain under the [Unlicense](LICENSE). Use it in class, at university, in your own projects, anywhere.

Fonts are loaded from Google Fonts and keep their own licenses (SIL Open Font License). Product names mentioned in the comparison table belong to their respective owners.

<sub>Before pushing: `tools/check-sensitive-data.sh` (needs ripgrep) scans the tracked files for credentials and local paths; `.githooks/pre-push` runs it before every push once enabled with `git config core.hooksPath .githooks`.</sub>

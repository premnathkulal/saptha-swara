import { useState, useCallback, useRef, useEffect } from "react";
import * as Tone from "tone";
import "./RagaKeyboard.scss";

interface Props {
  aarohana: string;
  avarohana: string;
}

type KeyId = string;

type SynthType = "harmonium" | "piano";

const WHITE_KEYS: { id: KeyId; label: string }[] = [
  "S",
  "R\u2082",
  "G\u2083",
  "M\u2081",
  "P",
  "D\u2082",
  "N\u2083",
  "\u1E60",
].map((id) => ({ id, label: id }));

const BLACK_KEYS: { id: KeyId; label: string; position: number }[] = [
  { id: "R\u2081", label: "R\u2081", position: 0 },
  { id: "R\u2083/G\u2082", label: "R\u2083/G\u2082", position: 1 },
  { id: "M\u2082", label: "M\u2082", position: 2 },
  { id: "D\u2081", label: "D\u2081", position: 3 },
  { id: "D\u2083/N\u2082", label: "D\u2083/N\u2082", position: 4 },
];

function noteToKeyIds(note: string): KeyId[] {
  const map: Record<string, KeyId[]> = {};
  const set = (k: string, v: KeyId[]) => { map[k] = v; };
  set("S", ["S"]);
  set("R\u2081", ["R\u2081"]); set("R1", ["R\u2081"]);
  set("R\u2082", ["R\u2082"]); set("R2", ["R\u2082"]);
  set("R\u2083", ["R\u2083/G\u2082"]); set("R3", ["R\u2083/G\u2082"]);
  set("G\u2081", ["R\u2081"]); set("G1", ["R\u2081"]);
  set("G\u2082", ["R\u2083/G\u2082"]); set("G2", ["R\u2083/G\u2082"]);
  set("G\u2083", ["G\u2083"]); set("G3", ["G\u2083"]);
  set("M", ["M\u2081"]);
  set("M\u2081", ["M\u2081"]); set("M1", ["M\u2081"]);
  set("M\u2082", ["M\u2082"]); set("M2", ["M\u2082"]);
  set("P", ["P"]);
  set("D\u2081", ["D\u2081"]); set("D1", ["D\u2081"]);
  set("D\u2082", ["D\u2082"]); set("D2", ["D\u2082"]);
  set("D\u2083", ["D\u2083/N\u2082"]); set("D3", ["D\u2083/N\u2082"]);
  set("N\u2081", ["D\u2083/N\u2082"]); set("N1", ["D\u2083/N\u2082"]);
  set("N\u2082", ["D\u2083/N\u2082"]); set("N2", ["D\u2083/N\u2082"]);
  set("N\u2083", ["N\u2083"]); set("N3", ["N\u2083"]);
  set("\u1E60", ["\u1E60"]);
  return map[note] ?? [];
}

function parseScale(scale: string): Set<KeyId> {
  const active = new Set<KeyId>();
  const tokens = scale.split(/\s+/);
  for (const token of tokens) {
    if (!token) continue;
    const ids = noteToKeyIds(token);
    ids.forEach((id) => active.add(id));
  }
  return active;
}

function getKeyClass(
  id: KeyId,
  aro: Set<KeyId>,
  avaro: Set<KeyId>,
): string {
  const inAro = aro.has(id);
  const inAvaro = avaro.has(id);

  if (inAro && inAvaro) return " active both";
  if (inAro) return " active aro";
  if (inAvaro) return " active avaro";
  return "";
}

const PITCHES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

function buildNoteMap(saIndex: number): Record<string, string> {
  const getPitch = (semitoneOffset: number) => {
    const idx = (saIndex + semitoneOffset) % 12;
    const octave = 4 + Math.floor((saIndex + semitoneOffset) / 12);
    return `${PITCHES[idx]}${octave}`;
  };
  return {
    S: getPitch(0),
    "R\u2081": getPitch(1),
    "R\u2082": getPitch(2),
    "R\u2083/G\u2082": getPitch(3),
    "G\u2083": getPitch(4),
    "M\u2081": getPitch(5),
    "M\u2082": getPitch(6),
    P: getPitch(7),
    "D\u2081": getPitch(8),
    "D\u2082": getPitch(9),
    "D\u2083/N\u2082": getPitch(10),
    "N\u2083": getPitch(11),
    "\u1E60": getPitch(12),
  };
}

function scaleToNotes(scale: string, map: Record<string, string>): string[] {
  const tokens = scale.split(/\s+/);
  const notes: string[] = [];
  for (const token of tokens) {
    const ids = noteToKeyIds(token);
    for (const id of ids) {
      const note = map[id];
      if (note && !notes.includes(note)) notes.push(note);
    }
  }
  return notes;
}

function createSynth(type: SynthType) {
  if (type === "harmonium") {
    return new Tone.Synth({
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.08, decay: 0.15, sustain: 0.4, release: 0.6 },
    }).chain(
      new Tone.Chorus(0.5, 2.5, 0.5).start(),
      Tone.Destination,
    );
  }
  return new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 0.7 },
  }).toDestination();
}

const RagaKeyboard = ({ aarohana, avarohana }: Props) => {
  const [saIndex, setSaIndex] = useState(0);
  const [synthType, setSynthType] = useState<SynthType>("harmonium");
  const [playing, setPlaying] = useState(false);
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const synthRef = useRef<Tone.Synth | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const aroNotes = parseScale(aarohana);
  const avaroNotes = parseScale(avarohana);
  const noteMap = buildNoteMap(saIndex);

  const startedRef = useRef(false);

  const startAudio = useCallback(async (type: SynthType) => {
    if (startedRef.current) {
      synthRef.current?.dispose();
    } else {
      await Tone.start();
      startedRef.current = true;
    }
    synthRef.current = createSynth(type);
  }, []);

  useEffect(() => {
    if (startedRef.current) {
      synthRef.current?.dispose();
      synthRef.current = createSynth(synthType);
    }
  }, [synthType]);

  const playNote = useCallback(
    async (note: string) => {
      await startAudio(synthType);
      const synth = synthRef.current;
      if (!synth) return;
      setPressedKey(note);
      synth.triggerAttackRelease(note, "8n");
      setTimeout(() => setPressedKey(null), 200);
    },
    [startAudio, synthType],
  );

  const playScale = useCallback(
    async (scale: string): Promise<void> => {
      await startAudio(synthType);
      setPlaying(true);
      setActiveNote(null);
      const notes = scaleToNotes(scale, noteMap);
      const synth = synthRef.current;
      if (!synth) return;

      clearInterval(timerRef.current);

      return new Promise((resolve) => {
        let idx = 0;

        const playNext = () => {
          if (idx >= notes.length) {
            setPlaying(false);
            setActiveNote(null);
            clearInterval(timerRef.current);
            resolve();
            return;
          }
          setActiveNote(notes[idx]);
          synth.triggerAttackRelease(notes[idx], "8n");
          idx++;
        };

        playNext();
        timerRef.current = setInterval(playNext, 280);
      });
    },
    [startAudio, noteMap, synthType],
  );

  return (
    <div className="raga-keyboard">
      <div className="sa-selector">
        <span className="sa-label">Sā =</span>
        <div className="sa-options">
          {PITCHES.map((p, i) => (
            <button
              key={p}
              className={`sa-btn${i === saIndex ? " active" : ""}${p.includes("#") ? " sharp" : ""}`}
              onClick={() => setSaIndex(i)}
            >
              <span className="sa-btn-text">{p}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="synth-toggle">
        <button
          className={`synth-btn${synthType === "harmonium" ? " active" : ""}`}
          onClick={() => setSynthType("harmonium")}
        >
          Harmonium
        </button>
        <button
          className={`synth-btn${synthType === "piano" ? " active" : ""}`}
          onClick={() => setSynthType("piano")}
        >
          Piano
        </button>
      </div>

      <div className="keyboard-keys">
        <div className="white-keys">
          {WHITE_KEYS.map((key) => {
            const note = noteMap[key.id];
            return (
              <div
                key={key.id}
                className={`white-key${getKeyClass(key.id, aroNotes, avaroNotes)}${pressedKey === note ? " pressed" : ""}${activeNote === note ? " ringing" : ""}`}
                onClick={() => playNote(note)}
              >
                <span className="key-label">{key.label}</span>
              </div>
            );
          })}
        </div>

        <div className="black-keys">
          {BLACK_KEYS.map((key) => {
            const note = noteMap[key.id];
            return (
              <div
                key={key.id}
                className={`black-key${getKeyClass(key.id, aroNotes, avaroNotes)}${pressedKey === note ? " pressed" : ""}${activeNote === note ? " ringing" : ""}`}
                style={{ left: `${key.position * 44 + 30}px` }}
                onClick={() => playNote(note)}
              >
                <span className="key-label">{key.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="keyboard-actions">
        <button
          className="play-scale-btn"
          disabled={playing}
          onClick={() => playScale(aarohana)}
        >
          Play Aarohana
        </button>
        <button
          className="play-scale-btn"
          disabled={playing}
          onClick={() => playScale(avarohana)}
        >
          Play Avarohana
        </button>
        <button
          className="play-scale-btn both"
          disabled={playing}
          onClick={async () => {
            await playScale(aarohana);
            await playScale(avarohana);
          }}
        >
          Play Both
        </button>
      </div>


    </div>
  );
};

export default RagaKeyboard;

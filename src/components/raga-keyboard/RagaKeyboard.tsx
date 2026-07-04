import { useState, useCallback, useRef } from "react";
import * as Tone from "tone";
import "./RagaKeyboard.scss";

interface Props {
  aarohana: string;
  avarohana: string;
}

type KeyId = string;

type Filter = "all" | "aro" | "avaro";

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
  filter: Filter,
): string {
  const inAro = aro.has(id);
  const inAvaro = avaro.has(id);

  if (filter === "aro") return inAro ? " active aro" : "";
  if (filter === "avaro") return inAvaro ? " active avaro" : "";

  if (inAro && inAvaro) return " active both";
  if (inAro) return " active aro";
  if (inAvaro) return " active avaro";
  return "";
}

interface LegendItem {
  key: Filter;
  label: string;
  cls: string;
}

const NOTE_MAP: Record<string, string> = {
  S: "C4",
  "R\u2081": "C#4",
  "R\u2082": "D4",
  "R\u2083/G\u2082": "D#4",
  "G\u2083": "E4",
  "M\u2081": "F4",
  "M\u2082": "F#4",
  P: "G4",
  "D\u2081": "G#4",
  "D\u2082": "A4",
  "D\u2083/N\u2082": "A#4",
  "N\u2083": "B4",
  "\u1E60": "C5",
};

function scaleToNotes(scale: string): string[] {
  const tokens = scale.split(/\s+/);
  const notes: string[] = [];
  for (const token of tokens) {
    const ids = noteToKeyIds(token);
    for (const id of ids) {
      const note = NOTE_MAP[id];
      if (note && !notes.includes(note)) notes.push(note);
    }
  }
  return notes;
}

const LEGEND: LegendItem[] = [
  { key: "all", label: "Both", cls: "both" },
  { key: "aro", label: "Aarohana", cls: "aro" },
  { key: "avaro", label: "Avarohana", cls: "avaro" },
];

const RagaKeyboard = ({ aarohana, avarohana }: Props) => {
  const [filter, setFilter] = useState<Filter>("all");
  const [playing, setPlaying] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);
  const aroNotes = parseScale(aarohana);
  const avaroNotes = parseScale(avarohana);

  const startedRef = useRef(false);

  const startAudio = useCallback(async () => {
    if (startedRef.current) return;
    await Tone.start();
    synthRef.current = new Tone.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.1, sustain: 0.3, release: 0.8 },
    }).toDestination();
    startedRef.current = true;
  }, []);

  const playNote = useCallback(
    async (note: string) => {
      await startAudio();
      const synth = synthRef.current;
      if (!synth) return;
      synth.triggerAttackRelease(note, "8n");
    },
    [startAudio],
  );

  const playScale = useCallback(
    async (scale: string) => {
      await startAudio();
      setPlaying(true);
      const notes = scaleToNotes(scale);
      const synth = synthRef.current;
      if (!synth) return;

      const now = Tone.now();
      notes.forEach((note, i) => {
        synth.triggerAttackRelease(note, "8n", now + i * 0.18);
      });

      setTimeout(() => setPlaying(false), notes.length * 180 + 200);
    },
    [startAudio],
  );

  return (
    <div className="raga-keyboard">
      <div className="keyboard-keys">
        <div className="white-keys">
          {WHITE_KEYS.map((key) => (
            <div
              key={key.id}
              className={`white-key${getKeyClass(key.id, aroNotes, avaroNotes, filter)}`}
              onClick={() => playNote(NOTE_MAP[key.id])}
            >
              <span className="key-label">{key.label}</span>
            </div>
          ))}
        </div>

        <div className="black-keys">
          {BLACK_KEYS.map((key) => (
            <div
              key={key.id}
              className={`black-key${getKeyClass(key.id, aroNotes, avaroNotes, filter)}`}
              style={{ left: `${key.position * 44 + 30}px` }}
              onClick={() => playNote(NOTE_MAP[key.id])}
            >
              <span className="key-label">{key.label}</span>
            </div>
          ))}
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
      </div>

      <div className="keyboard-legend">
        {LEGEND.map((item) => (
          <button
            key={item.key}
            className={`legend-btn${filter === item.key ? " active" : ""}`}
            onClick={() => setFilter(item.key)}
          >
            <span className={`legend-swatch ${item.cls}`} />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RagaKeyboard;

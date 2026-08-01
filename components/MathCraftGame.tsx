import React, { useEffect, useMemo, useRef, useState } from "react";

// Math‑Craft: Level 1 — single‑file React mini‑app
// Goal: run a gamified 3rd‑grade math lesson (online‑friendly) with XP, combo, powerups, timer, and built‑in tasks.
// How to use:
// 1) Press ▶ Run (in ChatGPT canvas) or drop this file into a React/Vite project as App.jsx and start dev server.
// 2) Pick a gamer name + skin, then play through Quests. Teacher can run it screen‑shared and type answers with the student.
// 3) Use Powerups (Hint / Freeze / Respawn). Award XP automatically on correct answers. Boss Fight at the end.

// ---------- Utility helpers ----------
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ---------- Core task model ----------
// Each task has: id, title, prompt, type, validator(answer)=>{ok, feedback, canonical}, hint
// type: "input", "multi", "sequence"

interface Task {
    id: string;
    quest: string;
    title: string;
    prompt: string;
    type: string;
    placeholder?: string;
    hint: string;
    validator: (answer: string) => { ok: boolean; feedback: string; canonical: string };
}

const TASKS: Task[] = [
    // Quest 0 – Calibration (quick diagnostic)
    {
        id: "q0_1",
        quest: "Quest 0 — Calibration Run",
        title: "Helyiérték (67)",
        prompt: "Írd le helyiérték szerint: 67 = __ tízes + __ egyes",
        type: "input",
        placeholder: "pl. 6 t + 7 e",
        hint: "A tizesek száma a tízesek helyén álló számjegy.",
        validator: (s: string) => {
            const norm = (s || "").toLowerCase().replaceAll(" ", "");
            const ok = /(6t\+7e|6tizes\+7egyes|6\*10\+7)/.test(norm);
            return { ok, feedback: ok ? "Szuper!" : "Próbáld: 6 tízes + 7 egyes.", canonical: "6 t + 7 e" };
        },
    },
    {
        id: "q0_2",
        quest: "Quest 0 — Calibration Run",
        title: "Számszomszédok (45)",
        prompt: "Mi a 45 kisebb és nagyobb számszomszédja?",
        type: "input",
        placeholder: "pl. 44 és 46",
        hint: "Egyel kisebb, egyel nagyobb.",
        validator: (s: string) => {
            const digits = (s || "").match(/\d+/g) || [];
            const a = parseInt(digits[0]);
            const b = parseInt(digits[1]);
            const ok = a === 44 && b === 46;
            return { ok, feedback: ok ? "Megvan!" : "Tipp: 44 és 46.", canonical: "44 és 46" };
        },
    },
    {
        id: "q0_3",
        quest: "Quest 0 — Calibration Run",
        title: "Pótlás 100‑ra (60, 85)",
        prompt: "Egészítsd ki 100‑ra: 60 + __ = 100;  85 + __ = 100",
        type: "input",
        placeholder: "pl. 40 és 15",
        hint: "Gondolkodj tízesekben: 60→100, 85→100",
        validator: (s: string) => {
            const ds = (s || "").match(/\d+/g) || [];
            if (ds.length < 2) return { ok: false, feedback: "Két szám kell.", canonical: "40 és 15" };
            const a = parseInt(ds[0]);
            const b = parseInt(ds[1]);
            const ok = a === 40 && b === 15;
            return { ok, feedback: ok ? "Pontos!" : "60‑hoz 40, 85‑höz 15 hiányzik.", canonical: "40 és 15" };
        },
    },

    // Quest 1 – Inventory Stacks (place value)
    {
        id: "q1_1",
        quest: "Quest 1 — Inventory Stacks",
        title: "Helyiérték (34)",
        prompt: "34 = __ tízes + __ egyes",
        type: "input",
        hint: "Hány teljes tízes fér ki?",
        placeholder: "pl. 3 t + 4 e",
        validator: (s: string) => {
            const norm = (s || "").toLowerCase().replaceAll(" ", "");
            const ok = /(3t\+4e|3tizes\+4egyes|3\*10\+4)/.test(norm);
            return { ok, feedback: ok ? "GG!" : "3 tízes + 4 egyes a jó megoldás.", canonical: "3 t + 4 e" };
        },
    },
    {
        id: "q1_2",
        quest: "Quest 1 — Inventory Stacks",
        title: "Helyiérték (79)",
        prompt: "79 = __ tízes + __ egyes",
        type: "input",
        hint: "A tízesek számjegye az első.",
        placeholder: "pl. 7 t + 9 e",
        validator: (s: string) => {
            const norm = (s || "").toLowerCase().replaceAll(" ", "");
            const ok = /(7t\+9e|7tizes\+9egyes|7\*10\+9)/.test(norm);
            return { ok, feedback: ok ? "Nice!" : "7 tízes + 9 egyes.", canonical: "7 t + 9 e" };
        },
    },

    // Quest 2 – Craft 100 Gold (make to 100)
    {
        id: "q2_1",
        quest: "Quest 2 — Craft 100 Gold",
        title: "70 → 100",
        prompt: "Mennyi hiányzik 70‑ről 100‑ra? Írj két érme‑kombót!",
        type: "input",
        hint: "30 hiányzik. Kombók: (20+10), (10+10+10)…",
        placeholder: "pl. 30 = 20+10 és 10+10+10",
        validator: (s: string) => {
            const ok = /30/.test(s || "");
            return { ok, feedback: ok ? "Kész a craft!" : "30 a hiányzó összeg. Adj két bontást is.", canonical: "30 = 20+10; 10+10+10" };
        },
    },
    {
        id: "q2_2",
        quest: "Quest 2 — Craft 100 Gold",
        title: "85 → 100",
        prompt: "Egészítsd ki 100‑ra: 85 + __ = 100",
        type: "input",
        hint: "80→100 az 20, így 85→100 az 15.",
        placeholder: "pl. 15",
        validator: (s: string) => {
            const n = parseInt((s || "").match(/\d+/)?.[0] || "NaN");
            const ok = n === 15;
            return { ok, feedback: ok ? "Pont jó!" : "A válasz 15.", canonical: "15" };
        },
    },

    // Quest 3 – Map & Waypoints (number line)
    {
        id: "q3_1",
        quest: "Quest 3 — Map & Waypoints",
        title: "Waypoints (57)",
        prompt: "Melyik két tízes közé esik 57?",
        type: "input",
        hint: "50 és 60 között.",
        placeholder: "pl. 50 és 60",
        validator: (s: string) => {
            const ds = (s || "").match(/\d+/g) || [];
            const a = parseInt(ds[0]);
            const b = parseInt(ds[1]);
            const ok = a === 50 && b === 60;
            return { ok, feedback: ok ? "Waypoint locked!" : "50 és 60 között.", canonical: "50 és 60" };
        },
    },
    {
        id: "q3_2",
        quest: "Quest 3 — Map & Waypoints",
        title: "Lépegetés +4",
        prompt: "Folytasd a mintát: 6, 10, 14, __, __, __",
        type: "input",
        hint: "+4 lépés: 18, 22, 26",
        placeholder: "pl. 18, 22, 26",
        validator: (s: string) => {
            const ds = (s || "").match(/\d+/g) || [];
            const ok = ds.length >= 3 && parseInt(ds[0]) === 18 && parseInt(ds[1]) === 22 && parseInt(ds[2]) === 26;
            return { ok, feedback: ok ? "Ritmus oké!" : "18, 22, 26 a helyes folytatás.", canonical: "18, 22, 26" };
        },
    },

    // Mini‑Raid – Grouping to multiplication
    {
        id: "raid_1",
        quest: "Mini‑Raid — Party Groups",
        title: "Csoportosítás",
        prompt: "3 tányér × 4 korong = ? Írd le összeadásként és szorzásként is.",
        type: "input",
        hint: "4+4+4 = 12, ezért 3×4 = 12.",
        placeholder: "pl. 4+4+4 = 12 és 3×4 = 12",
        validator: (s: string) => {
            const norm = (s || "").replaceAll(" ", "").toLowerCase();
            const ok = /(4\+4\+4=12.*3x4=12|3x4=12.*4\+4\+4=12|3\*4=12)/.test(norm);
            return { ok, feedback: ok ? "Raid clear!" : "Tipp: 4+4+4=12 és 3×4=12.", canonical: "4+4+4 = 12; 3×4 = 12" };
        },
    },

    // Boss Fight – Exit Ticket
    {
        id: "boss_1",
        quest: "Boss Fight — Exit Ticket",
        title: "Helyiérték (58)",
        prompt: "58 = __ tízes + __ egyes",
        type: "input",
        hint: "5 tízes + 8 egyes.",
        placeholder: "pl. 5 t + 8 e",
        validator: (s: string) => {
            const norm = (s || "").replaceAll(" ", "").toLowerCase();
            const ok = /(5t\+8e|5tizes\+8egyes|5\*10\+8)/.test(norm);
            return { ok, feedback: ok ? "✔" : "5 t + 8 e a megoldás.", canonical: "5 t + 8 e" };
        },
    },
    {
        id: "boss_2",
        quest: "Boss Fight — Exit Ticket",
        title: "73 szomszédai",
        prompt: "73 kisebb és nagyobb számszomszédja?",
        type: "input",
        hint: "72 és 74.",
        placeholder: "pl. 72 és 74",
        validator: (s: string) => {
            const ds = (s || "").match(/\d+/g) || [];
            const a = parseInt(ds[0]);
            const b = parseInt(ds[1]);
            const ok = a === 72 && b === 74;
            return { ok, feedback: ok ? "✔" : "72 és 74 a jó megoldás.", canonical: "72 és 74" };
        },
    },
    {
        id: "boss_3",
        quest: "Boss Fight — Exit Ticket",
        title: "100 bontása",
        prompt: "Töltsd ki: 100 = 60 + __",
        type: "input",
        hint: "40.",
        placeholder: "pl. 40",
        validator: (s: string) => {
            const n = parseInt((s || "").match(/\d+/)?.[0] || "NaN");
            const ok = n === 40;
            return { ok, feedback: ok ? "✔" : "40 a hiányzó rész.", canonical: "40" };
        },
    },
    {
        id: "boss_4",
        quest: "Boss Fight — Exit Ticket",
        title: "Ötösével 0‑tól 25‑ig",
        prompt: "Írd le: 0‑tól 25‑ig ötösével",
        type: "sequence",
        hint: "0, 5, 10, 15, 20, 25",
        placeholder: "pl. 0,5,10,15,20,25",
        validator: (s: string) => {
            const ds = (s || "").match(/\d+/g) || [];
            const seq = ds.map((d) => parseInt(d));
            const target = [0, 5, 10, 15, 20, 25];
            const ok = target.length === seq.length && target.every((v, i) => v === seq[i]);
            return { ok, feedback: ok ? "Boss down!" : "Várt sor: 0,5,10,15,20,25.", canonical: "0, 5, 10, 15, 20, 25" };
        },
    },
];

const QUEST_ORDER = [
    { id: "spawn", label: "Spawn" },
    { id: "q0", label: "Quest 0" },
    { id: "q1", label: "Quest 1" },
    { id: "q2", label: "Quest 2" },
    { id: "q3", label: "Quest 3" },
    { id: "raid", label: "Mini‑Raid" },
    { id: "boss", label: "Boss Fight" },
    { id: "loot", label: "Loot" },
];

const QUEST_FILTERS: Record<string, (task: Task) => boolean> = {
    q0: (t) => t.id.startsWith("q0_"),
    q1: (t) => t.id.startsWith("q1_"),
    q2: (t) => t.id.startsWith("q2_"),
    q3: (t) => t.id.startsWith("q3_"),
    raid: (t) => t.id.startsWith("raid_"),
    boss: (t) => t.id.startsWith("boss_"),
};

// ---------- Components ----------
function Badge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-slate-800/60 border border-slate-700">
            {children}
        </span>
    );
}

function Progress({ value }: { value: number }) {
    return (
        <div className="w-full h-3 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
            <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${clamp(value, 0, 100)}%` }}
            />
        </div>
    );
}

interface HUDProps {
    name: string;
    skin: string;
    xp: number;
    combo: number;
    powerups: Record<string, number>;
    onPowerup: (powerup: string) => void;
    timer: number;
}

function HUD({ name, skin, xp, combo, powerups, onPowerup, timer }: HUDProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="text-sm text-slate-300">Player</div>
                <div className="text-lg font-semibold">{name || "Player"} <span className="ml-1">{skin}</span></div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-300">XP</div>
                    <Badge>{Math.floor(xp)} XP</Badge>
                </div>
                <Progress value={(xp % 50) * 2} />
                <div className="mt-1 text-xs text-slate-400">{50 - (xp % 50)} XP a következő skinig</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="text-sm text-slate-300">Combo</div>
                <div className="text-xl font-semibold">×{combo}</div>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="text-sm text-slate-300">Timer</div>
                <div className="text-xl font-bold tabular-nums">{timer}s</div>
            </div>

            <div className="col-span-2 md:col-span-4 p-3 rounded-2xl bg-slate-900/70 border border-slate-800">
                <div className="text-sm text-slate-300 mb-2">Powerupok</div>
                <div className="flex flex-wrap gap-2">
                    {(["Hint", "Freeze", "Respawn"]).map((p) => (
                        <button
                            key={p}
                            onClick={() => onPowerup(p)}
                            disabled={powerups[p] <= 0}
                            className={`px-3 py-1.5 rounded-xl border ${powerups[p] > 0 ? "border-emerald-500/50 hover:bg-emerald-500/10" : "border-slate-700 opacity-50 cursor-not-allowed"}`}
                        >
                            {p} <Badge>{powerups[p]}</Badge>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function Card({ children }: { children: React.ReactNode }) {
    return (
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-lg">
            {children}
        </div>
    );
}

interface QuestionProps {
    task: Task;
    onResult: (ok: boolean, canonical: string) => void;
    frozen: boolean;
}

function Question({ task, onResult, frozen }: QuestionProps) {
    const [value, setValue] = useState("");
    const [state, setState] = useState<"idle" | "ok" | "err">("idle");
    const [feedback, setFeedback] = useState("");

    const submit = () => {
        if (frozen) return;
        const res = task.validator(value);
        setFeedback(res.feedback);
        setState(res.ok ? "ok" : "err");
        onResult(res.ok, res.canonical);
    };

    return (
        <Card>
            <div className="text-xs uppercase tracking-wide text-slate-400">{task.quest}</div>
            <div className="text-lg font-semibold mb-1">{task.title}</div>
            <div className="text-slate-300 mb-3">{task.prompt}</div>
            <input
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                placeholder={task.placeholder || "Válasz..."}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                disabled={frozen}
            />
            <div className="mt-3 flex gap-2">
                <button onClick={submit} disabled={frozen} className="px-3 py-1.5 rounded-xl border border-emerald-500/50 hover:bg-emerald-500/10">Beküldés</button>
                <button onClick={() => { if (!frozen) { setValue(""); setState("idle"); setFeedback(""); } }} className="px-3 py-1.5 rounded-xl border border-slate-700 hover:bg-slate-800">Törlés</button>
                <button onClick={() => { if (!frozen) { setFeedback("Hint: " + (task.hint || "Nincs.")); setState("idle"); } }} className="px-3 py-1.5 rounded-xl border border-amber-500/50 hover:bg-amber-500/10">Hint</button>
            </div>
            {feedback && (
                <div className={`mt-3 text-sm ${state === "ok" ? "text-emerald-400" : state === "err" ? "text-rose-400" : "text-amber-300"}`}>
                    {feedback}
                </div>
            )}
        </Card>
    );
}

interface SectionHeaderProps {
    title: string;
    subtitle: string;
}

function SectionHeader({ title, subtitle }: SectionHeaderProps) {
    return (
        <div className="mb-2">
            <div className="text-xs uppercase tracking-wide text-slate-400">{subtitle}</div>
            <h2 className="text-2xl font-bold">{title}</h2>
        </div>
    );
}

export default function MathCraftGame() {
    const [name, setName] = useState("");
    const [skin, setSkin] = useState("🎮");
    const [xp, setXp] = useState(0);
    const [combo, setCombo] = useState(1);
    const [timer, setTimer] = useState(0);
    const [frozen, setFrozen] = useState(false);
    const [stage, setStage] = useState("spawn");
    const [powerups, setPowerups] = useState({ Hint: 3, Freeze: 3, Respawn: 3 });

    const pool = useMemo(() => TASKS, []);
    const stageTasks = useMemo(() => {
        if (stage in QUEST_FILTERS) return pool.filter(QUEST_FILTERS[stage]);
        if (stage === "spawn") return [];
        if (stage === "loot") return [];
        return [];
    }, [pool, stage]);

    const [index, setIndex] = useState(0);
    const current = stageTasks[index];

    // Simple stage timer (counts down from 300s by default when a stage starts)
    useEffect(() => {
        let active = true;
        setTimer(300);
        const tick = () => {
            setTimeout(() => {
                if (!active) return;
                setTimer((t) => {
                    if (t <= 0) return 0;
                    return t - 1;
                });
                tick();
            }, 1000);
        };
        tick();
        return () => { active = false; };
    }, [stage]);

    const doPowerup = (p: string) => {
        setPowerups((prev) => {
            if (prev[p] <= 0) return prev;
            const next = { ...prev, [p]: prev[p] - 1 };
            if (p === "Freeze") {
                setFrozen(true);
                setTimeout(() => setFrozen(false), 20000);
            } else if (p === "Hint") {
                // handled per‑question via button too; here give a global toast
                alert("Globális Hint: gondolkodj tízesekben / waypointok között!");
            } else if (p === "Respawn") {
                // redo current question without penalty
                setCombo(1);
            }
            return next;
        });
    };

    const handleResult = (ok: boolean, canonical: string) => {
        if (ok) {
            const gained = 10 * combo + 5; // base 10 + speed bonus (simplified)
            setXp((x) => x + gained);
            setCombo((c) => clamp(c + 1, 1, 5));
            // next question or next stage
            if (index < stageTasks.length - 1) {
                setIndex(index + 1);
            } else {
                // stage complete -> advance
                const pos = QUEST_ORDER.findIndex((q) => q.id === stage);
                if (pos >= 0 && pos < QUEST_ORDER.length - 1) {
                    setStage(QUEST_ORDER[pos + 1].id);
                    setIndex(0);
                }
            }
        } else {
            setCombo(1);
            // offer canonical solution
            if (canonical) {
                // small toast
                console.log("Megoldás:", canonical);
            }
        }
    };

    const startRun = () => setStage("q0");

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 p-5">
            <div className="max-w-4xl mx-auto space-y-6">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">MATH‑CRAFT: Level 1</h1>
                        <div className="text-slate-400">Gamifikált 3. osztályos matek – online óra</div>
                    </div>
                    <Badge>Season 1</Badge>
                </header>

                <HUD name={name} skin={skin} xp={xp} combo={combo} powerups={powerups} onPowerup={doPowerup} timer={timer} />

                {stage === "spawn" && (
                    <Card>
                        <SectionHeader title="Spawn & Tutorial" subtitle="Belépés" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Gamer név</label>
                                <input className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="pl. Wolf" />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-300 mb-1">Skin (emoji)</label>
                                <input className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2" value={skin} onChange={(e) => setSkin(e.target.value)} placeholder="pl. ⚡" />
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-slate-300">
                            Szabályok: helyes válasz = <b>+10 XP</b> (+5 bónusz). 3 egymás utáni jó = <b>Combo ×2</b>. Powerupok: <b>Hint</b>, <b>Freeze</b>, <b>Respawn</b>.
                        </div>
                        <div className="mt-4 flex gap-3">
                            <button onClick={startRun} className="px-4 py-2 rounded-xl border border-emerald-500/60 hover:bg-emerald-500/10">Indítás (Quest 0)</button>
                        </div>
                    </Card>
                )}

                {stage !== "spawn" && stage !== "loot" && (
                    <>
                        <Card>
                            <SectionHeader title={QUEST_ORDER.find((q) => q.id === stage)?.label || "Quest"} subtitle="Szakasz" />
                            <div className="text-slate-300 mb-3">Haladás ebben a szakaszban: {index + 1}/{stageTasks.length}</div>
                            {current ? (
                                <Question task={current} onResult={handleResult} frozen={frozen} />
                            ) : (
                                <div className="text-slate-400">Nincs több kérdés ebben a szakaszban.</div>
                            )}
                            <div className="mt-4 flex flex-wrap gap-2">
                                {QUEST_ORDER.map((q) => (
                                    <button key={q.id} onClick={() => { setStage(q.id); setIndex(0); }} className={`px-3 py-1.5 rounded-xl border ${stage === q.id ? "border-emerald-500/60 bg-emerald-500/10" : "border-slate-700 hover:bg-slate-800"}`}>{q.label}</button>
                                ))}
                            </div>
                        </Card>
                    </>
                )}

                {stage === "loot" && (
                    <Card>
                        <SectionHeader title="Loot & Season Pass" subtitle="Zárás" />
                        <div className="space-y-2 text-slate-300">
                            <p>Össz‑XP: <b>{xp}</b>. Skinek: {Math.floor(xp / 50)} db feloldva.</p>
                            <p>Daily Quest (házi, 8–10p): Pénzes lapról 3 feladat + 0–30 ötösével leírni.</p>
                            <p>Kattints bármelyik szakasz gombra, ha ismételnél.</p>
                        </div>
                    </Card>
                )}

                <footer className="text-center text-xs text-slate-500 pt-6">Mihaszna Matek • Math‑Craft Level 1 • v1.0</footer>
            </div>
        </div>
    );
}


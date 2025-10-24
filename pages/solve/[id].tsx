import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Task {
    id: number;
    question_text: string;
    solution_text?: string; // csak backend-ön belül tároljuk
}

export default function SolvePage() {
    const router = useRouter();
    const { id } = router.query;
    const [task, setTask] = useState<Task | null>(null);
    const [answer, setAnswer] = useState("");
    const [result, setResult] = useState<string | null>(null);

    // 1) Betöltjük a feladatot
    useEffect(() => {
        if (!id) return;
        fetch(`http://localhost:8001/tasks/${id}`)
            .then((res) => res.json())
            .then(setTask)
            .catch(console.error);
    }, [id]);

    // 2) Beküldés
    const submit = async () => {
        if (!task) return;
        const res = await fetch("http://localhost:8001/attempts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: 1,       // statikusan most, később auth
                task_id: task.id,
                answer_text: answer,
            }),
        });
        const data = await res.json();
        setResult(data.is_correct ? "Helyes!" : "Hibás, próbáld újra.");
    };

    if (!task) return <p>Betöltés…</p>;
    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Feladat #{task.id}</h1>
            <p className="mb-4">{task.question_text}</p>
            <textarea
                className="w-full p-2 border rounded mb-4"
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
            />
            <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={submit}
            >
                Beküldés
            </button>
            {result && <p className="mt-4 font-medium">{result}</p>}
        </div>
    );
}

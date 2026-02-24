"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    FileQuestion,
    Plus,
    Trash2,
    GripVertical,
    AlertTriangle,
    PencilLine,
    Upload,
    Crown,
    Sparkles,
    Loader2,
    Wand2,
    Lock,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

import { useMission } from "@/context/MissionContext";

interface QuestionsStepProps {
    context: string;
    questions: string[];
    setQuestions: (q: string[]) => void;
}

export default function QuestionsStep({
    context,
    questions,
    setQuestions,
}: QuestionsStepProps) {
    const { currentMission } = useMission();
    const [newQuestion, setNewQuestion] = useState("");
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editValue, setEditValue] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [bulkText, setBulkText] = useState("");

    // Upsell state
    const [showUpsell, setShowUpsell] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [rationale, setRationale] = useState("");

    const addQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions([...questions, newQuestion.trim()]);
            setNewQuestion("");
        }
    };

    const removeQuestion = (idx: number) => {
        setQuestions(questions.filter((_, i) => i !== idx));
    };

    const startEdit = (idx: number) => {
        setEditIndex(idx);
        setEditValue(questions[idx]);
    };

    const saveEdit = () => {
        if (editIndex !== null && editValue.trim()) {
            const updated = [...questions];
            updated[editIndex] = editValue.trim();
            setQuestions(updated);
            setEditIndex(null);
            setEditValue("");
        }
    };

    const importBulk = () => {
        const lines = bulkText
            .split("\n")
            .map((l) => l.replace(/^\d+[\.\)\-\s]+/, "").trim())
            .filter((l) => l.length > 5);
        if (lines.length > 0) {
            setQuestions([...questions, ...lines]);
            setBulkText("");
            setBulkMode(false);
        }
    };

    // Upsell: AI question generation
    const generateQuestions = async () => {
        setIsGenerating(true);
        setRationale("");
        try {
            const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/generate_questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    context,
                    count: 8,
                    mission_id: currentMission?.mission_id
                }),
            });
            if (!resp.ok) {
                const errorText = await resp.text().catch(() => "");
                throw new Error(errorText || "Generation failed");
            }
            const data = await resp.json();
            if (data.questions) {
                setQuestions(data.questions);
                setRationale(data.rationale || "");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto py-10">
            {/* Section Header */}
            <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <FileQuestion size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-slate-900">
                            Submit Your Questionnaire
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Paste the questions you want stress-tested
                        </p>
                    </div>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
                    Enter the survey questions{" "}
                    <span className="text-slate-900 font-bold">you've already drafted</span>.
                    Our diagnostic lab will run each one against synthetic respondents to
                    detect{" "}
                    <span className="text-emerald-600">
                        bias, ambiguity, leading language, missing options
                    </span>
                    , and other structural flaws — before you deploy in the field.
                </p>
            </div>

            {/* Bulk Import Toggle */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setBulkMode(false)}
                    className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!bulkMode
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-100 text-slate-500 border border-slate-200 hover:text-slate-900"
                        }`}
                >
                    One at a time
                </button>
                <button
                    onClick={() => setBulkMode(true)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${bulkMode
                        ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-slate-100 text-slate-500 border border-slate-200 hover:text-slate-900"
                        }`}
                >
                    <Upload size={12} />
                    Bulk Paste
                </button>
            </div>

            {/* Bulk Paste Area */}
            {bulkMode && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8"
                >
                    <textarea
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder={`Paste your questions here — one per line. Line numbers and bullets will be stripped automatically.\n\nExample:\n1. On a scale of 1-10, how likely are you to use our service?\n2. What factors most influence your purchasing decisions?\n3. How would you rate the value for money of this product?`}
                        rows={8}
                        className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 text-slate-800 placeholder:text-slate-400 font-medium leading-relaxed focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all resize-none text-sm mb-4"
                    />
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            {bulkText.split("\n").filter((l) => l.trim().length > 5).length}{" "}
                            questions detected
                        </span>
                        <button
                            onClick={importBulk}
                            disabled={
                                bulkText.split("\n").filter((l) => l.trim().length > 5)
                                    .length === 0
                            }
                            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${bulkText.split("\n").filter((l) => l.trim().length > 5).length >
                                0
                                ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed"
                                }`}
                        >
                            Import All
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Single Question Input */}
            {!bulkMode && (
                <div className="flex gap-3 mb-8">
                    <input
                        type="text"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addQuestion()}
                        placeholder="Type a survey question and press Enter..."
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 placeholder:text-slate-400 font-medium text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                    <button
                        onClick={addQuestion}
                        disabled={!newQuestion.trim()}
                        className={`px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${newQuestion.trim()
                            ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        <Plus size={14} />
                        Add
                    </button>
                </div>
            )}

            {/* Questions List */}
            <div className="space-y-3 mb-8">
                {questions.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 border border-slate-100 rounded-3xl">
                        <FileQuestion
                            size={40}
                            className="text-slate-300 mx-auto mb-4"
                        />
                        <p className="text-slate-400 font-bold text-sm">
                            No questions submitted yet
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                            Paste your survey questions above to begin the audit
                        </p>
                    </div>
                ) : (
                    <AnimatePresence>
                        {questions.map((q, i) => (
                            <motion.div
                                key={`q-${i}-${q.slice(0, 20)}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ delay: i * 0.05 }}
                                className="group flex items-start gap-4 bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 shadow-sm hover:shadow transition-all"
                            >
                                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                                    <GripVertical
                                        size={14}
                                        className="text-slate-300 group-hover:text-slate-400 transition-colors"
                                    />
                                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black flex items-center justify-center">
                                        Q{i + 1}
                                    </span>
                                </div>

                                {editIndex === i ? (
                                    <div className="flex-1 flex gap-3">
                                        <input
                                            type="text"
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                                            className="flex-1 bg-white border border-emerald-400 rounded-xl px-4 py-2 text-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-100"
                                            autoFocus
                                        />
                                        <button
                                            onClick={saveEdit}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest"
                                        >
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <p className="flex-1 text-slate-800 font-medium text-sm leading-relaxed pt-0.5">
                                            {q}
                                        </p>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEdit(i)}
                                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
                                            >
                                                <PencilLine size={14} />
                                            </button>
                                            <button
                                                onClick={() => removeQuestion(i)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Summary Bar */}
            {questions.length > 0 && (
                <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl px-5 py-3 mb-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {questions.length} question{questions.length !== 1 ? "s" : ""} ready
                        for audit
                    </span>
                    <button
                        onClick={() => setQuestions([])}
                        className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            )}

            {/* Warning */}
            {questions.length > 0 && questions.length < 2 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-8 flex items-center gap-3 text-amber-600 text-xs font-bold bg-amber-50 border border-amber-100 px-5 py-3 rounded-xl"
                >
                    <AlertTriangle size={14} />
                    Add at least 2 questions to proceed to the diagnostic lab.
                </motion.div>
            )}

            {/* Upsell: AI Question Drafting */}
            <div className="border-t border-slate-100 pt-8">
                <button
                    onClick={() => setShowUpsell(!showUpsell)}
                    className="flex items-center gap-3 w-full text-left group"
                >
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                        <Crown size={14} className="text-amber-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                            Don't have questions yet?
                            <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                                Pro
                            </span>
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Let our AI methodologist draft an optimised questionnaire for you
                        </p>
                    </div>
                    {showUpsell ? (
                        <ChevronUp size={14} className="text-slate-500" />
                    ) : (
                        <ChevronDown size={14} className="text-slate-500" />
                    )}
                </button>

                <AnimatePresence>
                    {showUpsell && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-6"
                        >
                            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 shadow-sm">
                                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
                                    Our AI survey methodologist will draft a complete,
                                    bias-free questionnaire based on your research context. The
                                    generated questions are pre-optimised for structural quality
                                    and can be further refined before running through the
                                    diagnostic lab.
                                </p>
                                <button
                                    onClick={generateQuestions}
                                    disabled={isGenerating}
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${isGenerating
                                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                        : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
                                        }`}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={14} className="animate-spin" />
                                            Drafting Questionnaire...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 size={14} />
                                            Draft Questionnaire
                                        </>
                                    )}
                                </button>

                                {rationale && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-6 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl"
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">
                                            Methodologist's Strategy
                                        </p>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                            {rationale}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

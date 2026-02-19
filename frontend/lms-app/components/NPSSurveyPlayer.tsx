"use client";

import { useState } from "react";
import { CheckCircle2, ThumbsUp, MessageSquare } from "lucide-react";

interface NPSSurveyPlayerProps {
    contentId: string;
    question?: string;
    minLabel?: string;
    maxLabel?: string;
    followUpQuestion?: string;
    onComplete?: (score: number, comment: string) => void;
}

export default function NPSSurveyPlayer({
    contentId,
    question = "¿Qué probabilidad hay de que recomiendes este curso a un colega o amigo?",
    minLabel = "Muy improbable",
    maxLabel = "Muy probable",
    followUpQuestion = "¿Por qué diste esta puntuación? (Opcional)",
    onComplete,
}: NPSSurveyPlayerProps) {
    const [selectedScore, setSelectedScore] = useState<number | null>(null);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (selectedScore !== null) {
            setSubmitted(true);
            if (onComplete) {
                onComplete(selectedScore, comment);
            }
        }
    };

    const getScoreColor = (score: number) => {
        if (score <= 6) return "text-red-600 bg-red-50 border-red-200";
        if (score <= 8) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
    };

    const getCategory = (score: number) => {
        if (score <= 6) return { label: "Detractor", color: "text-red-700" };
        if (score <= 8) return { label: "Pasivo", color: "text-yellow-700" };
        return { label: "Promotor", color: "text-emerald-700" };
    };

    if (submitted) {
        const category = selectedScore !== null ? getCategory(selectedScore) : null;

        return (
            <div className="max-w-3xl mx-auto p-8">
                <div className="bg-white rounded-2xl border-2 border-emerald-200 p-8 text-center">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Gracias por tu feedback!</h3>
                    <p className="text-gray-600 mb-4">
                        Tu respuesta ha sido registrada. Valoramos mucho tu opinión.
                    </p>
                    {category && (
                        <div className="mt-6 inline-block">
                            <p className="text-sm text-gray-500 mb-1">Categoría</p>
                            <span className={`text-lg font-bold ${category.color}`}>
                                {category.label}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-8">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                        <ThumbsUp className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Encuesta NPS</h3>
                        <p className="text-xs text-gray-500">Net Promoter Score</p>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <p className="text-base font-semibold text-gray-800 mb-6">{question}</p>

                    {/* Score Selector */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-11 gap-2">
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                                <button
                                    key={score}
                                    onClick={() => setSelectedScore(score)}
                                    aria-label={`Score ${score}`}
                                    className={`
                    aspect-square rounded-xl border-2 font-bold text-lg transition-all
                    hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500
                    cursor-pointer
                    ${selectedScore === score
                                            ? `${getScoreColor(score)} border-current scale-110 shadow-lg`
                                            : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                        }
                  `}
                                >
                                    {score}
                                </button>
                            ))}
                        </div>

                        {/* Labels */}
                        <div className="flex justify-between text-xs text-gray-500 px-1">
                            <span className="font-medium">{minLabel}</span>
                            <span className="font-medium">{maxLabel}</span>
                        </div>
                    </div>
                </div>

                {/* Selected Score Indicator */}
                {selectedScore !== null && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Tu puntuación</p>
                                <p className={`text-2xl font-bold mt-1 ${getCategory(selectedScore).color}`}>
                                    {selectedScore} / 10
                                </p>
                            </div>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${getCategory(selectedScore).color}`}>
                                    {getCategory(selectedScore).label}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Follow-up Comment */}
                {selectedScore !== null && (
                    <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <MessageSquare className="w-4 h-4" />
                            {followUpQuestion}
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Comparte tus comentarios aquí..."
                            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none text-gray-700 placeholder:text-gray-400"
                        />
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleSubmit}
                    disabled={selectedScore === null}
                    aria-label="Submit NPS survey"
                    className={`
            w-full py-4 rounded-xl font-bold text-sm transition-all
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
            cursor-pointer
            ${selectedScore === null
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                        }
          `}
                >
                    {selectedScore === null ? "Selecciona una puntuación" : "Enviar Respuesta"}
                </button>
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { TrendingUp, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

type SkillArea = {
    id: string;
    name: string;
    color: string;
    bgClient: string;
    progress: number;
    description: string;
    competencies: string[];
    courses: { title: string; icon: string }[];
};

const SKILL_AREAS: SkillArea[] = [
    {
        id: "leadership",
        name: "Liderazgo y desarrollo personal",
        color: "#e91e63", // Pink
        bgClient: "bg-pink-100",
        progress: 75,
        description: "Obtén la confianza necesaria para avanzar con firmeza y determinación. Aprende a confiar en tus propias capacidades.",
        competencies: ["Asertividad", "Capacidad de delegar", "Confianza", "Entusiasmo", "Perseverancia", "Toma de decisiones"],
        courses: [
            { title: "Mejora tu disciplina", icon: "🏋️" },
            { title: "Las cosas claras - Feedback", icon: "📢" },
            { title: "Toma el mando", icon: "⚓" }
        ]
    },
    {
        id: "innovation",
        name: "Creación e innovación",
        color: "#ffccbc", // Peach
        bgClient: "bg-orange-100",
        progress: 40,
        description: "Desarrolla tu creatividad para resolver problemas complejos y generar nuevas ideas de negocio.",
        competencies: ["Creatividad", "Design Thinking", "Resolución de problemas"],
        courses: [{ title: "Innovación disruptiva", icon: "💡" }]
    },
    {
        id: "communication",
        name: "Comunicación e inspiración",
        color: "#fff9c4", // Pale Yellow
        bgClient: "bg-yellow-100",
        progress: 60,
        description: "Mejora tus habilidades comunicativas para inspirar a otros y transmitir tus ideas con claridad.",
        competencies: ["Oratoria", "Storytelling", "Negociación"],
        courses: [{ title: "Hablar en público", icon: "🎤" }]
    },
    {
        id: "collaboration",
        name: "Colaboración y entendimiento",
        color: "#dcedc8", // Pale Green
        bgClient: "bg-green-100",
        progress: 85,
        description: "Fomenta el trabajo en equipo y la inteligencia emocional para construir relaciones sólidas.",
        competencies: ["Empatía", "Escucha activa", "Gestión de conflictos"],
        courses: [{ title: "Trabajo en equipo ágil", icon: "🤝" }]
    },
    {
        id: "wellness",
        name: "Bienestar y concienciación",
        color: "#b2dfdb", // Teal
        bgClient: "bg-teal-100",
        progress: 30,
        description: "Equilibra tu vida profesional y personal mediante técnicas de mindfulness y gestión del estrés.",
        competencies: ["Mindfulness", "Gestión del tiempo", "Resiliencia"],
        courses: [{ title: "Mindfulness para líderes", icon: "🧘" }]
    },
    {
        id: "productivity",
        name: "Productividad y planificación",
        color: "#b3e5fc", // Light Blue
        bgClient: "bg-blue-100",
        progress: 50,
        description: "Optimiza tu flujo de trabajo y aprende a priorizar tareas para maximizar tu impacto.",
        competencies: ["Organización", "Foco", "Metodologías ágiles"],
        courses: [{ title: "Productividad extrema", icon: "⚡" }]
    },
    {
        id: "digital",
        name: "Digitalización y especialización",
        color: "#d1c4e9", // Lavender
        bgClient: "bg-purple-100",
        progress: 20,
        description: "Domina las herramientas digitales esenciales para la transformación tecnológica de tu sector.",
        competencies: ["Análisis de datos", "Herramientas No-Code", "IA Generativa"],
        courses: [{ title: "IA para negocios", icon: "🤖" }]
    },
    {
        id: "strategy",
        name: "Estrategia y autogestión",
        color: "#e1bee7", // Purple
        bgClient: "bg-fuchsia-100",
        progress: 65,
        description: "Define objetivos claros y traza planes estratégicos para alcanzarlos con autonomía.",
        competencies: ["Visión estratégica", "OKRs", "Toma de decisiones"],
        courses: [{ title: "Estrategia corporativa", icon: "♟️" }]
    }
];

export default function TalentWheel() {
    const [selectedSkill, setSelectedSkill] = useState<SkillArea>(SKILL_AREAS[0]);
    const [showAnalysis, setShowAnalysis] = useState(false);

    // Calculate overall average
    const totalProgress = Math.round(SKILL_AREAS.reduce((acc, curr) => acc + curr.progress, 0) / SKILL_AREAS.length);

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Award className="w-6 h-6 text-primary" />
                        {showAnalysis ? "Análisis de Competencias" : "Déjate guiar por tus talentos"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                        {showAnalysis
                            ? "Resumen detallado de tu progreso en todas las áreas de desarrollo profesional."
                            : "La rueda del talento muestra tus fortalezas en ocho áreas diferentes. Aprovecha tus puntos fuertes y refuerza los débiles."}
                    </p>
                </div>
                <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="text-sm text-primary hover:text-secondary-dark flex items-center gap-1 font-medium px-3 py-1.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {showAnalysis ? (
                        <>Volver a la rueda</>
                    ) : (
                        <>
                            <TrendingUp className="w-4 h-4" /> Ver análisis completo
                        </>
                    )}
                </button>
            </div>

            {showAnalysis ? (
                <div className="animate-in fade-in duration-300">
                    <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-primary to-primary-light rounded-xl text-white">
                        <div className="w-20 h-20 rounded-full border-4 border-secondary flex items-center justify-center text-2xl font-bold">
                            {totalProgress}%
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Nivel de Talento Global</h3>
                            <p className="text-secondary text-sm">¡Estás en el top 15% de tu cohorte!</p>
                            <div className="mt-2 text-xs opacity-80 max-w-md">
                                Tu perfil destaca especialmente en <strong>Colaboración</strong> y <strong>Liderazgo</strong>.
                                Te recomendamos enfocarte en <em>Digitalización</em> este trimestre.
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SKILL_AREAS.map(skill => (
                            <div key={skill.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: skill.color }}></div>
                                        <span className="font-bold text-gray-700">{skill.name}</span>
                                    </div>
                                    <span className="font-bold text-sm">{skill.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{ width: `${skill.progress}%`, backgroundColor: skill.color }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                                    <span>Nivel: {skill.progress > 80 ? 'Experto' : skill.progress > 50 ? 'Intermedio' : 'Iniciado'}</span>
                                    <span className="text-green-600 font-medium">+5% este mes</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        {/* The Wheel (Custom SVG) */}
                        <div className="relative w-80 h-80 shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                {SKILL_AREAS.map((skill, i) => {
                                    // Calculate segment path
                                    const anglePerSegment = 360 / SKILL_AREAS.length;
                                    const startAngle = i * anglePerSegment;
                                    const endAngle = (i + 1) * anglePerSegment;

                                    // Simple math to create donut segments
                                    const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
                                    const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
                                    const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
                                    const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
                                    const x1_inner = 50 + 15 * Math.cos((startAngle * Math.PI) / 180);
                                    const y1_inner = 50 + 15 * Math.sin((startAngle * Math.PI) / 180);
                                    const x2_inner = 50 + 15 * Math.cos((endAngle * Math.PI) / 180);
                                    const y2_inner = 50 + 15 * Math.sin((endAngle * Math.PI) / 180);

                                    const path = `
                                        M ${x1_inner} ${y1_inner}
                                        L ${x1} ${y1}
                                        A 40 40 0 0 1 ${x2} ${y2}
                                        L ${x2_inner} ${y2_inner}
                                        A 15 15 0 0 0 ${x1_inner} ${y1_inner}
                                    `;

                                    return (
                                        <g key={skill.id} onClick={() => setSelectedSkill(skill)} className="cursor-pointer group">
                                            <path
                                                d={path}
                                                fill={skill.color}
                                                opacity={selectedSkill.id === skill.id ? 1 : 0.6}
                                                stroke="white"
                                                strokeWidth="1"
                                                className="transition-all duration-300 group-hover:opacity-90 hover:scale-105 origin-center"
                                            />
                                        </g>
                                    );
                                })}

                                {/* Center Circle */}
                                <circle cx="50" cy="50" r="12" fill="#d1c4e9" className="drop-shadow-sm" />
                                <text
                                    x="50" y="50"
                                    textAnchor="middle"
                                    dy=".3em"
                                    fill="#4a148c"
                                    fontSize="10"
                                    fontWeight="bold"
                                    transform="rotate(90 50 50)"
                                >
                                    GR
                                </text>
                            </svg>
                        </div>

                        {/* Detail Panel */}
                        <div className="flex-1 space-y-6 w-full">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-2xl font-bold">{selectedSkill.name}</h3>
                                    <span className="px-2 py-1 bg-gray-100 border border-gray-200 rounded text-sm font-bold min-w-[3rem] text-center">
                                        {selectedSkill.progress}%
                                    </span>
                                </div>
                                <p className="text-gray-600">{selectedSkill.description}</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm mb-3 text-gray-800">Competencias en esta área:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedSkill.competencies.map((comp, i) => (
                                        <span key={i} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${selectedSkill.bgClient} border-black/5`}>
                                            {comp}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold text-sm mb-3 text-gray-800">Cursos que te pueden interesar:</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedSkill.courses.map((course, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group border border-transparent hover:border-gray-200">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm ${selectedSkill.color} bg-opacity-20`}>
                                                <div className="bg-white w-8 h-8 rounded flex items-center justify-center shadow-sm">
                                                    {course.icon}
                                                </div>
                                            </div>
                                            <span className="font-bold text-sm text-gray-800 group-hover:text-primary transition-colors">{course.title}</span>
                                            <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chips for quick selection (Mobile friendly) */}
                    <div className="mt-8 flex gap-2 flex-wrap border-t border-gray-100 pt-6">
                        {SKILL_AREAS.map(skill => (
                            <button
                                key={skill.id}
                                onClick={() => setSelectedSkill(skill)}
                                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${selectedSkill.id === skill.id
                                    ? 'bg-primary text-white shadow-md'
                                    : `bg-gray-50 text-gray-600 hover:bg-gray-100`
                                    }`}
                                style={selectedSkill.id === skill.id ? { backgroundColor: skill.color, color: '#000' } : {}}
                            >
                                {skill.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

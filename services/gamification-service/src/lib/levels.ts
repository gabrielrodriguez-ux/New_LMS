/**
 * Level calculation utilities
 * 50 levels with progressive XP requirements
 */

export interface LevelInfo {
    level: number
    name: string
    xpRequired: number
    xpToNext: number
    progressPercent: number
}

// Level thresholds and names (50 levels)
export const LEVEL_THRESHOLDS: { xp: number; name: string }[] = [
    { xp: 0, name: 'Novato' },
    { xp: 100, name: 'Iniciado' },
    { xp: 250, name: 'Aprendiz' },
    { xp: 500, name: 'Estudiante' },
    { xp: 850, name: 'Estudiante II' },
    { xp: 1300, name: 'Estudiante III' },
    { xp: 1850, name: 'Avanzado' },
    { xp: 2500, name: 'Avanzado II' },
    { xp: 3250, name: 'Avanzado III' },
    { xp: 4100, name: 'Competente' },
    { xp: 5050, name: 'Competente II' },
    { xp: 6100, name: 'Competente III' },
    { xp: 7250, name: 'Experto' },
    { xp: 8500, name: 'Experto II' },
    { xp: 9850, name: 'Experto III' },
    { xp: 11300, name: 'Especialista' },
    { xp: 12850, name: 'Especialista II' },
    { xp: 14500, name: 'Especialista III' },
    { xp: 16250, name: 'Profesional' },
    { xp: 18100, name: 'Profesional II' },
    { xp: 20050, name: 'Profesional III' },
    { xp: 22100, name: 'Senior' },
    { xp: 24250, name: 'Senior II' },
    { xp: 26500, name: 'Senior III' },
    { xp: 28850, name: 'Veterano' },
    { xp: 31300, name: 'Veterano II' },
    { xp: 33850, name: 'Veterano III' },
    { xp: 36500, name: 'Maestro' },
    { xp: 39250, name: 'Maestro II' },
    { xp: 42100, name: 'Maestro III' },
    { xp: 45050, name: 'Gran Maestro' },
    { xp: 48100, name: 'Gran Maestro II' },
    { xp: 51250, name: 'Gran Maestro III' },
    { xp: 54500, name: 'Leyenda' },
    { xp: 57850, name: 'Leyenda II' },
    { xp: 61300, name: 'Leyenda III' },
    { xp: 64850, name: 'Mítico' },
    { xp: 68500, name: 'Mítico II' },
    { xp: 72250, name: 'Mítico III' },
    { xp: 76100, name: 'Épico' },
    { xp: 80050, name: 'Épico II' },
    { xp: 84100, name: 'Épico III' },
    { xp: 88250, name: 'Heroico' },
    { xp: 92500, name: 'Heroico II' },
    { xp: 96850, name: 'Heroico III' },
    { xp: 101300, name: 'Titán' },
    { xp: 105850, name: 'Titán II' },
    { xp: 110500, name: 'Titán III' },
    { xp: 115250, name: 'Inmortal' },
    { xp: 120100, name: 'Supremo' }
]

export function calculateLevel(totalXp: number): LevelInfo {
    let currentLevel = 1
    let currentLevelXp = 0
    let nextLevelXp = LEVEL_THRESHOLDS[1]?.xp || 100

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
        if (totalXp >= LEVEL_THRESHOLDS[i].xp) {
            currentLevel = i + 1
            currentLevelXp = LEVEL_THRESHOLDS[i].xp
            nextLevelXp = LEVEL_THRESHOLDS[i + 1]?.xp || LEVEL_THRESHOLDS[i].xp + 5000
        } else {
            break
        }
    }

    const xpInCurrentLevel = totalXp - currentLevelXp
    const xpNeededForLevel = nextLevelXp - currentLevelXp
    const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForLevel) * 100))

    return {
        level: currentLevel,
        name: LEVEL_THRESHOLDS[currentLevel - 1]?.name || 'Supremo',
        xpRequired: currentLevelXp,
        xpToNext: nextLevelXp - totalXp,
        progressPercent
    }
}

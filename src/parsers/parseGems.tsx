import { gemEffectRegex,gemSkillRegex,gemLevelRegex } from "../regex/regex";
import type { JewelInfo } from "../types/type";


// TODO Для одного из кейсов не работает корректно(если у камня есть все параметры то может не записывать урон% скипая его и записывая тольк поддержку)
export function parseGems(jsonData: Document): JewelInfo[] {
    const data = JSON.stringify(jsonData);
    const results: JewelInfo[] = [];

    // Собираем информацию о камнях и их уровнях
    const skillGems = new Map<string, { gemId: string; skillName: string }>();
    const gemLevels = new Map<string, number>();

    // Обрабатываем слоты и уровни камней
    for (const match of data.matchAll(gemSkillRegex)) {
        skillGems.set(match[1], { gemId: match[1], skillName: match[2] });
    }

    for (const match of data.matchAll(gemLevelRegex)) {
        gemLevels.set(match[1], parseInt(match[2]));
    }

    // Обрабатываем эффекты камней
    for (const match of data.matchAll(gemEffectRegex)) {
        if (match[1]) { // Основной эффект (урон/время/поддержка)
        const skillName = match[1];
        const effectType = match[2];
        const value = parseFloat(match[3]);

        // Находим или создаем запись о скилле
        let skillData = results.find(s => s.skillName === skillName);
        if (!skillData) {
            skillData = { skillName, gemsLvl: [0, 0], levelsStats: [0, 0, 0] };
            results.push(skillData);
        }

        // Обновляем данные в зависимости от типа эффекта
        const relatedGems = Array.from(skillGems.values()).filter(g => g.skillName === skillName);
        for (const { gemId } of relatedGems) {
            const level = gemLevels.get(gemId) || 0;

            if (effectType.includes('урон')) {
            skillData.gemsLvl[0] = level;
            skillData.levelsStats[0] = value;
            } else if (effectType.includes('время')) {
            skillData.gemsLvl[1] = level;
            skillData.levelsStats[1] = value;
            } else if (effectType.includes('поддержки')) {
            skillData.gemsLvl[0] = level;
            skillData.levelsStats[2] = value;
            }
        }
        } 
        else if (match[4] && results.length > 0) { // Доп. эффект поддержки
        results[results.length - 1].levelsStats[2] = parseFloat(match[5]);
        }
    }

    return results;
}

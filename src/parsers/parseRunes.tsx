import { runesNameRegex } from "../regex/regex";
import type { RuneInfo,ColorMap } from "../types/type";

const runeColorMap: ColorMap = {
    '#FF6000': 'Реликтовый',
    '#F99200': 'Легендарный',
    '#CE43FC': 'Эпический',
    '#00B0FA': 'Редкий',
    '#8DF901': 'Необычный',
};

export function parseRunes(jsonData: object): RuneInfo[] {
    const text = JSON.stringify(jsonData);
    const matchesIterator = text.matchAll(runesNameRegex);
    const runes: RuneInfo[] = [];

    for (let i = 0; i < 8; i++) {
        const match = matchesIterator.next();
        if (match.done) break;
        const rawRuneName = match.value[2];
        const decodedRuneName = rawRuneName
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/^Руна\s/, '')
            .trim();
        runes.push({
            color: runeColorMap[match.value[1].toUpperCase()],
            rune: decodedRuneName
        });
    }
    return runes;
}
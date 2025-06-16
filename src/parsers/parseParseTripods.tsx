import {tripodRegex} from '../regex/regex'
import type { TripodInfo } from '../types/type';

export function parseTripods(jsonData:Document):TripodInfo {
    const text:string = JSON.stringify(jsonData);
    const tripods: TripodInfo = [];
    const matches = Array.from(text.matchAll(tripodRegex));
    
    // Берем первые 8 совпадений (или все, если меньше)
    for (let i = 0; i < Math.min(matches.length, 8); i++) {
        const match = matches[i];
        tripods.push([
            parseInt(match[1]) || 0,
            parseInt(match[2]) || 0,
            parseInt(match[3]) || 0
        ]);
    }
    
    // Дополняем нулями если совпадений меньше 8
    while (tripods.length < 8) {
        tripods.push([0, 0, 0]);
    }
    
    return tripods;
}

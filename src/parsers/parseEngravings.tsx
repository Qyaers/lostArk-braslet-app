import {  engravingRegex } from '../regex/regex';
import type {EngrInfo,ColorMap} from '../types/type';

const engrColorMap: ColorMap = {
    '#FF6000': 'Реликтовая',
    '#FE9600': 'Легендарная',
    '#CE43FC': 'Эпическая',
};

export function parseEngravings(jsonData: object):EngrInfo[]{//{
    const data = JSON.stringify(jsonData);
    const engravings:EngrInfo[] = [];
    
    for(const match of data.matchAll(engravingRegex)){
        engravings.push(
            {
                engrName:match[2],
                engrColor:engrColorMap[match[1]],
                engrLvl: parseInt(match[3]),
            }
        );
    }
    return engravings;
}
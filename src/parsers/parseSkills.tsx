import { skillNameRegex } from "../regex/regex";

export function parseSkillsName(jsonData:object):string[] {
    const text:string = JSON.stringify(jsonData);
    const skills:string[] = [];
    let match:RegExpExecArray|null;

    while ((match = skillNameRegex.exec(text)) !== null && skills.length < 8) {
        const skillName = match[1].trim();
        skills.push(skillName);
    }
    return skills;
}
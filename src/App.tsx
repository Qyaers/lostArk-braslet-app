import { useState, type ChangeEvent } from 'react';
import { fetchData } from './Api';
import { tripodRegex,skillNameRegex,runesNameRegex , gemSkillRegex, gemLevelRegex, gemEffectRegex} from "./regex/regex";
import type { TripodInfo,SkillsInfo,JewelInfo, RuneColorMap, RuneInfo } from "./types/type";

function App() {
  //TODO вынести цвета в отдельный файл для уменьшения логики кода
  const runeColorMap: RuneColorMap = {
      '#FF6000': 'Реликтовый',
      '#F99200': 'Легендарный',
      '#CE43FC': 'Эпический',
      '#00B0FA': 'Редкий',
      '#8DF901': 'Необычный',
  };

  const [isLoading, setIsLoading] = useState(false);
  const [text,setText] = useState("");
  const [data,setData] = useState<Promise<Document>|null>(null);

  const [tripods,setTripods] = useState<TripodInfo|null>(null);
  const [skills,setSkills] = useState<SkillsInfo|null>(null);
  const [runes,setRunes] = useState<RuneInfo[]|null>(null);
  const [gems,setGems] = useState<JewelInfo[] |null>(null);

  function handlerInputText(e:ChangeEvent<HTMLInputElement>):void{
    setText(e.target.value);
  }
  // TODO добавить то что ниже в коменте как допишу парсер вынести логику в отдельный компонент. Либо придумать как разбить это все на модули, чтобы вся логика не хранилась в одном файле.
  // TODO вытащить ещё несколько параметров из данных: Гравы + Внешки + Фетранит + Элики(сет лвл) + Высшая закалка + Транса + Арк 123 + Бижа(все) + брас

  async function handlerClick():Promise<void> {
      setIsLoading(true);
      try {
          const newData:Document|null = await getData();
          if (newData) {
              getSkillsTripod(newData);
              getSkillsName(newData);
              getRunes(newData);
              getGemsInfo(newData);
          }
      } catch (error) {
          console.error("Error:", error);
      } finally {
          setIsLoading(false);
      }
  }

  function getData():Promise<Document>|null{
    refreshState();
    if(text.length>=2){
      console.log(text);
      const response:Promise<Document> = fetchData(text);
      setData(response);
      return response;
    }
    return null;
  }

  function refreshState():void{
    setData(null);
    setTripods(null);
    setSkills(null);
    setRunes(null);
    setGems(null);
  }

function getSkillsTripod(jsonData:Document):void {
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
    
    setTripods(tripods);
}

  function getSkillsName(jsonData:object):void {
    const text:string = JSON.stringify(jsonData);
    const skills:string[] = [];
    let match:RegExpExecArray|null;
    
    while ((match = skillNameRegex.exec(text)) !== null && skills.length < 8) {
      const skillName = match[1].trim();
      skills.push(skillName);
    }

    setSkills(skills);
  }

  function getRunes(jsonData: object): void {
    const text = JSON.stringify(jsonData);
    const matchesIterator = text.matchAll(runesNameRegex);
    const results: RuneInfo[] = [];
    
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
      results.push({
          color: runeColorMap[match.value[1].toUpperCase()],
          rune: decodedRuneName
      });
    }

    setRunes(results);
  }
// TODO Для одного из кейсов не работает корректно(если у камня есть все параметры то может не записывать урон% скипая его и записывая тольк поддержку)
  function getGemsInfo(jsonData: object): void {
    const text = JSON.stringify(jsonData);
    const results: JewelInfo[] = [];

    // Собираем информацию о камнях и их уровнях
    const skillGems = new Map<string, { gemId: string; skillName: string }>();
    const gemLevels = new Map<string, number>();

    // Обрабатываем слоты и уровни камней
    for (const match of text.matchAll(gemSkillRegex)) {
      skillGems.set(match[1], { gemId: match[1], skillName: match[2] });
    }

    for (const match of text.matchAll(gemLevelRegex)) {
      gemLevels.set(match[1], parseInt(match[2]));
    }

    // Обрабатываем эффекты камней
    for (const match of text.matchAll(gemEffectRegex)) {
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

    setGems(results);
  }
//  Гравировки
// <span><font color='#FF6000'>Моргенштерн</font> - для самой гравы, цвет = текущий уровень гравы
// <FONT COLOR='#FF6000'>0</FONT> - для лвл грав

// Внешки
// потенциально можно находить по \"Element_001\": \"Ловкость +2.00% где вместо ловкости один из 3х мейн статов

// Бижа (только эффекты)

  return (
    <div>
      <div>
        <h1>Данные с сайта:</h1>
        <input type="text" value={text} onChange={handlerInputText}/>
        <button onClick={handlerClick} disabled={isLoading}>
          {isLoading ? "Загрузка..." : "Получить данные по нику"}
        </button>
      </div>
      {!isLoading &&
        <div>
          Полученная информация:
          {tripods?<pre>tripods = {JSON.stringify(tripods, null, 2)}</pre>:""}
          {skills?<pre>skills = {JSON.stringify(skills, null, 2)}</pre>:""}
          {runes?<pre>runes = {JSON.stringify(runes, null, 2)}</pre>:""}
          {gems?<pre>jewells = {JSON.stringify(gems, null, 2)}</pre>:""}
          Вывод данных в разных форматах для тестов и поиска информации со страницы:
          <pre>{JSON.stringify(data, null, 5)}</pre>
          {/* <pre>{data}</pre> */}
        </div>
      }
    </div>
  );
}

export default App;
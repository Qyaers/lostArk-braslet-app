import { useState, type ChangeEvent } from 'react';
import { fetchData } from './Api';
import { parseTripods } from './parsers/parseParseTripods';
import { parseSkillsName } from './parsers/parseSkills';
import { parseRunes } from './parsers/parseRunes';
import { parseGems } from './parsers/parseGems';
import { parseEngravings } from './parsers/parseEngravings';
import { parseSkinsStats } from './parsers/parseSkins';
import { parseStone } from './parsers/parserStone';


import type { TripodInfo,SkillsInfo,JewelInfo, RuneInfo, EngrInfo, SkinsInfo, StoneInfo} from "./types/type";

function App() {

  const [isLoading, setIsLoading] = useState(false);
  const [text,setText] = useState("");
  const [data,setData] = useState<Promise<Document>|null>(null);

  const [tripods,setTripods] = useState<TripodInfo|null>(null);
  const [skills,setSkills] = useState<SkillsInfo|null>(null);
  const [runes,setRunes] = useState<RuneInfo[]|null>(null);
  const [gems,setGems] = useState<JewelInfo[] |null>(null);
  const [engrs,setEngrs] = useState<EngrInfo[]|null>(null)
  const [skinsInfo,setSkinsInfo] = useState<SkinsInfo[]|null>(null);
  const [stoneInfo,setStoneInfo] = useState<StoneInfo[]|null>(null);

  function handlerInputText(e:ChangeEvent<HTMLInputElement>):void{
    setText(e.target.value);
  }
  // TODO вытащить ещё несколько параметров из данных: Класс перса +Элики(сет лвл) + Высшая закалка + Транса + Арк 123 + Бижа(все) + брас

  async function handlerClick():Promise<void> {
      setIsLoading(true);
      try {
          const newData:Document|null = await getData();
          if (newData) {
            setTripods(parseTripods(newData));
            setSkills(parseSkillsName(newData));
            setRunes(parseRunes(newData));
            setGems(parseGems(newData));
            setEngrs(parseEngravings(newData));
            setSkinsInfo(parseSkinsStats(newData));
            setStoneInfo(parseStone(newData));
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
      {(!isLoading && data) &&
        <div>
          Полученная информация:
          {tripods?<pre>tripods = {JSON.stringify(tripods, null, 2)}</pre>:""}
          {skills?<pre>skills = {JSON.stringify(skills, null, 2)}</pre>:""}
          {runes?<pre>runes = {JSON.stringify(runes, null, 2)}</pre>:""}
          {gems?<pre>jewells = {JSON.stringify(gems, null, 2)}</pre>:""}
          {engrs?<pre>engrs = {JSON.stringify(engrs, null, 2)}</pre>:""}
          {skinsInfo?<pre>skins = {JSON.stringify(skinsInfo, null, 2)}</pre>:""}
          {stoneInfo?<pre>stone = {JSON.stringify(stoneInfo, null, 2)}</pre>:""}
          Вывод данных в разных форматах для тестов и поиска информации со страницы:
          <pre>{JSON.stringify(data, null, 5)}</pre>
          <pre>{data}</pre>
        </div>
      }
    </div>
  );
}

export default App;
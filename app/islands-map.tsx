"use client";
import {useMemo,useState,useEffect,useRef} from 'react';
import {geoMercator,geoPath,geoCentroid} from 'd3-geo';
import {Pause,Play,Expand} from 'lucide-react';
import {Button} from '@/components/ui/button';
import region from '@/lib/indonesia-region.json';
import shapes from '@/lib/island-coasts.json';
import islandInfo from '@/lib/island-info.json';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
const topics=islandInfo.map(i=>[i.name,i.coast,i.potential.join(', '),i.description]);
export default function IslandsMap(){
 const mapBox=useRef<HTMLElement>(null);
 const defaultSelected = useMemo(() => {
  const idx = islandInfo.findIndex(i => i.name.toLowerCase().includes('jawa'));
  return idx !== -1 ? idx : 1;
 }, []);
 const [selected,setSelected]=useState<number|null>(defaultSelected),[paused,setPaused]=useState(false);
 const [isMaximized, setIsMaximized] = useState(false);
 useEffect(()=>setPaused(matchMedia('(prefers-reduced-motion: reduce)').matches),[]);
 useEffect(()=>{
  if(!isMaximized)return;
  const handleKeyDown=(e:KeyboardEvent)=>{if(e.key==='Escape')setIsMaximized(false);};
  const handleClickOutside=(e:MouseEvent|TouchEvent)=>{
   if(mapBox.current&&!mapBox.current.contains(e.target as Node)){
    setIsMaximized(false);
   }
  };
  window.addEventListener('keydown',handleKeyDown);
  const timer=setTimeout(()=>window.addEventListener('pointerdown',handleClickOutside),50);
  return ()=>{
   window.removeEventListener('keydown',handleKeyDown);
   clearTimeout(timer);
   window.removeEventListener('pointerdown',handleClickOutside);
  };
 },[isMaximized]);
 const map=useMemo(()=>{const projection=geoMercator().fitExtent([[45,48],[1155,445]],region.features.find(f=>f.properties.id==='IDN') as any);return {projection,path:geoPath(projection)};},[]);
 const info=selected===null?null:topics[selected];
 return (
  <>
  {isMaximized&&<div className="expand-backdrop" onClick={()=>setIsMaximized(false)} aria-hidden="true"/>}
  <section ref={mapBox} className={`geo-map-section islands-map ${paused?'is-paused':''} ${isMaximized?'is-maximized':''}`} aria-label="Peta interaktif garis pantai Indonesia">
  <div className="geo-map-head"><div><span className="geo-kicker">JELAJAHI PESISIR</span><h2>Pulau dan potensi laut</h2></div><div className="map-controls"><Button variant="ghost" aria-label={isMaximized?"Perkecil peta":"Perbesar peta"} onClick={()=>setIsMaximized(!isMaximized)}><Expand/></Button><Button variant="ghost" aria-label={paused?'Putar animasi':'Jeda animasi'} onClick={()=>setPaused(!paused)}>{paused?<Play/>:<Pause/>}</Button></div></div>
  <div className="geo-map-scroll zoomable-map" tabIndex={0} aria-label="Peta pulau yang dapat digulir"><div className="geo-map-inner"><svg viewBox="0 0 1200 490" className="indonesia-map" aria-label="Pilih pulau untuk mengetahui garis pantai dan potensi laut" role="group"><defs><clipPath id="coasts-clip"><rect width="1200" height="490"/></clipPath></defs><g clipPath="url(#coasts-clip)">{region.features.filter(f=>f.properties.id!=='IDN').map(f=><path key={f.properties.id} className="map-neighbor" d={map.path(f as any)||''}/>)}{shapes.map((shape,i)=><g key={topics[i][0]} role="button" tabIndex={0} aria-label={topics[i][0]} aria-pressed={selected===i} className={'island-choice '+(selected===i?'island-selected':'')} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setSelected(i);}}}><path className="island-fill" d={map.path(shape as any)||''}/><path className="island-coast" d={map.path(shape.coast as any)||''}/></g>)}{shapes.map((shape,i)=>{const p=map.projection(geoCentroid(shape as any))!;return i<5?<text key={i} x={p[0]} y={p[1]} className="island-label" textAnchor="middle" pointerEvents="none">{topics[i][0].toUpperCase()}</text>:null;})}</g></svg></div></div>

  <div className="island-info" aria-live="polite">{selected!==null?<IslandDetails key={selected} info={islandInfo[selected]}/>:<p>Ketuk pulau pada peta untuk menjelajahi garis pantai dan kekayaan lautnya.</p>}</div>
  </section>
  </>
 );
}

function IslandDetails({info}:{info:typeof islandInfo[number]}){
 const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
 return <><h3>{info.name}</h3><div className="coast-detail-layout"><figure className="coast-photo">{failed?<div className="coast-image-error"><p>Foto belum dapat dimuat.</p><button onClick={()=>{setFailed(false);setAttempt(n=>n+1);}}>Coba lagi</button></div>:<img key={attempt} className="coast-img" src={info.image} alt={info.beach} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>}<figcaption>{info.beach}<a href={info.image} target="_blank" rel="noreferrer">Lihat gambar asli ↗</a></figcaption></figure><Tabs defaultValue="coast" className="coast-detail-tabs" onKeyDown={e=>e.stopPropagation()}><TabsList aria-label="Informasi pesisir"><TabsTrigger value="coast">Garis pantai</TabsTrigger><TabsTrigger value="potential">Potensi laut</TabsTrigger><TabsTrigger value="info">Penjelasan</TabsTrigger></TabsList><TabsContent value="coast"><p>{info.coast}</p><h4>Perairan utama</h4><p>{info.waters}</p></TabsContent><TabsContent value="potential"><ul>{info.potential.map(p=><li key={p}>{p}</li>)}</ul></TabsContent><TabsContent value="info"><p>{info.description}</p></TabsContent></Tabs></div></>;
}

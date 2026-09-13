"use client";
import {useState,useMemo,useEffect,useRef,useLayoutEffect} from 'react';
import {geoMercator,geoPath,geoGraticule} from 'd3-geo';
import {Globe2,BookOpen,ShieldCheck,ArrowRight,Triangle,Pause,Play,Sun,Mountain,Leaf,Waves,House,Backpack,MoveRight,Expand,Maximize,ZoomIn,ZoomOut} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Tabs,TabsList,TabsTrigger,TabsContent} from '@/components/ui/tabs';
import region from '@/lib/indonesia-region.json';
import equatorPlaces from '@/lib/equator-places.json';
import './geography.css';
import IslandsMap from './islands-map';
import AudioPlayer from '@/components/audio-player';

const volcanoes=[{"name": "Sinabung", "point": [98.392, 3.17], "region": "Sumatera Utara", "description": "Stratovolcano di Kabupaten Karo. Sinabung kembali menunjukkan aktivitas setelah sebelumnya lama tidak mengalami erupsi besar dalam catatan modern.", "source": "https://volcano.si.edu/volcano.cfm?vn=261080", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Gunung_Sinabung.jpg"}, {"name": "Kerinci", "point": [101.264, -1.697], "region": "Jambi–Sumatera Barat", "description": "Gunung api tertinggi di Indonesia, dengan ketinggian sekitar 3.800 m. Berada di kawasan Pegunungan Bukit Barisan.", "source": "https://volcano.si.edu/volcano.cfm?vn=261170", "image": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Gunung_Kerinci.jpg"}, {"name": "Anak Krakatau", "point": [105.423, -6.101], "region": "Selat Sunda", "description": "Gunung api yang tumbuh di kompleks Kaldera Krakatau setelah letusan dahsyat Krakatau tahun 1883. Berada di antara Pulau Sumatra dan Jawa.", "source": "https://volcano.si.edu/volcano.cfm?vn=262000", "image": "https://tangselpos.id/storage/2026/09/gunung-anak-krakatau-masih-batuk-batuk-hari-ini-sudah-5-kali-erupsi-08092026-202824.jpg"}, {"name": "Tangkuban Parahu", "point": [107.6, -6.77], "region": "Jawa Barat", "description": "Gunung api di sebelah utara Bandung yang terkenal dengan kawah-kawahnya. Bentuknya merupakan bagian dari kompleks vulkanik Sunda.", "source": "https://volcano.si.edu/volcano.cfm?vn=263090", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Tangkuban_Perahu.jpg"}, {"name": "Merapi", "point": [110.446, -7.54], "region": "DIY–Jawa Tengah", "description": "Salah satu gunung api paling aktif di Indonesia. Gunung ini memiliki kubah lava aktif dan berada di sebelah utara Yogyakarta.", "source": "https://volcano.si.edu/volcano.cfm?vn=263250", "image": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Mount_Merapi.jpg"}, {"name": "Semeru", "point": [112.922, -8.108], "region": "Jawa Timur", "description": "Gunung tertinggi di Pulau Jawa dengan ketinggian sekitar 3.657 m. Aktivitas erupsinya sering berupa letusan abu dari kawah puncak.", "source": "https://volcano.si.edu/volcano.cfm?vn=263300", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Mount_Semeru.jpg"}, {"name": "Ijen", "point": [114.242, -8.058], "region": "Jawa Timur", "description": "Kompleks gunung api yang terkenal dengan danau kawah berwarna biru kehijauan dan sangat asam. Berada di ujung timur Pulau Jawa.", "source": "https://volcano.si.edu/volcano.cfm?vn=263350", "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Kawah_ijen.jpg"}, {"name": "Agung", "point": [115.508, -8.343], "region": "Bali", "description": "Gunung api tertinggi di Bali dengan ketinggian sekitar 2.997 m. Terletak di bagian timur Pulau Bali.", "source": "https://volcano.si.edu/volcano.cfm?vn=264020", "image": "https://upload.wikimedia.org/wikipedia/commons/c/cc/MountAgung.jpg"}, {"name": "Rinjani", "point": [116.47, -8.42], "region": "Lombok, NTB", "description": "Gunung api setinggi sekitar 3.726 m yang memiliki Kaldera Segara Anak dengan danau besar di dalamnya.", "source": "https://volcano.si.edu/volcano.cfm?vn=264030", "image": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Gunung_rinjani.jpg"}, {"name": "Tambora", "point": [118, -8.25], "region": "Sumbawa, NTB", "description": "Terkenal karena letusan sangat besar tahun 1815 yang membentuk kaldera luas di puncaknya.", "source": "https://volcano.si.edu/volcano.cfm?vn=264040", "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Mount_Tambora_Volcano%2C_Sumbawa_Island%2C_Indonesia.jpg"}, {"name": "Kelimutu", "point": [121.82, -8.77], "region": "Flores, NTT", "description": "Kompleks gunung api yang terkenal dengan tiga danau kawah yang dapat menunjukkan warna berbeda.", "source": "https://volcano.si.edu/volcano.cfm?vn=264140", "image": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Danau_Kelimutu.jpg"}, {"name": "Lokon", "point": [124.7992, 1.3644], "region": "Sulawesi Utara", "description": "Kompleks gunung api dekat Tomohon. Aktivitas vulkaniknya terutama berpusat di Kawah Tompaluan di antara Lokon dan Empung.", "source": "https://volcano.si.edu/volcano.cfm?vn=266100", "image": "https://upload.wikimedia.org/wikipedia/commons/5/55/Gunung_Lokon.jpg"}, {"name": "Soputan", "point": [124.737, 1.112], "region": "Sulawesi Utara", "description": "Stratovolcano di bagian utara Sulawesi dan termasuk gunung api yang memiliki riwayat aktivitas cukup sering.", "source": "https://volcano.si.edu/volcano.cfm?vn=266030", "image": "https://upload.wikimedia.org/wikipedia/commons/2/20/Soputan.jpg"}, {"name": "Dukono", "point": [127.8783, 1.6992], "region": "Halmahera Utara", "description": "Kompleks gunung api di Pulau Halmahera yang dikenal memiliki aktivitas erupsi dan pelepasan abu yang berlangsung lama.", "source": "https://volcano.si.edu/volcano.cfm?vn=268010", "image": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Dukono.jpg"}, {"name": "Ibu", "point": [127.6324, 1.4941], "region": "Halmahera Barat", "description": "Stratovolcano di bagian barat laut Halmahera. Kawah puncaknya menjadi pusat aktivitas vulkanik gunung ini.", "source": "https://volcano.si.edu/volcano.cfm?vn=268030", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Gunung_Ibu.jpg"}, {"name": "Gamalama", "point": [127.3322, 0.81], "region": "Ternate, Maluku Utara", "description": "Gunung api berbentuk kerucut yang membentuk sebagian besar Pulau Ternate. Memiliki sejarah erupsi yang panjang.", "source": "https://volcano.si.edu/volcano.cfm?vn=268060", "image": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Gunung_Gamalama.jpg"}];
import Link from 'next/link';

const islands=[{name:'SUMATRA',point:[100,2.4]},{name:'JAWA',point:[111,-6]},{name:'KALIMANTAN',point:[114,1.3]},{name:'SULAWESI',point:[121.1,-3.9]},{name:'PAPUA',point:[137,-3.3]},{name:'NUSA TENGGARA',point:[119,-10.4]},{name:'MALUKU',point:[130.4,-1.9]}];
export default function GeographyHome({section='home'}:{section?:'home'|'belajar'|'mitigasi'}){
 const [fullscreen,setFullscreen]=useState(false),[fullscreenError,setFullscreenError]=useState('');
 const [showPrompt, setShowPrompt] = useState(false);
 const [playMusic, setPlayMusic] = useState(false);

 useEffect(()=>{
  const sync=()=>setFullscreen(!!document.fullscreenElement);sync();document.addEventListener('fullscreenchange',sync);
  if (!sessionStorage.getItem('geo_prompted')) {
    setShowPrompt(true);
  } else {
    setPlayMusic(true);
  }
  return ()=>document.removeEventListener('fullscreenchange',sync);
 },[]);

 async function toggleFullscreen(){try{setFullscreenError('');if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setFullscreenError('Layar penuh belum tersedia. Gunakan tombol layar penuh pada browser papan.');}}
 
 function handlePrompt(accept: boolean) {
  sessionStorage.setItem('geo_prompted', 'true');
  setShowPrompt(false);
  setPlayMusic(true);
  if (accept) document.documentElement.requestFullscreen().catch(()=>{});
 }

 return <div className={'geo-home '+(section==='home'?'is-home':section==='belajar'?'is-learning':'')}>
 {showPrompt && section === 'home' && (
   <div className="prompt-overlay">
     <div className="prompt-dialog">
       <p>Gunakan layar penuh untuk pengalaman terbaik?</p>
       <div className="prompt-actions">
         <Button onClick={() => handlePrompt(true)}>Ya</Button>
         <Button variant="outline" onClick={() => handlePrompt(false)}>Tidak</Button>
       </div>
     </div>
   </div>
 )}
 {section==='home'&&<AudioPlayer autoPlayRequested={playMusic} />}
 <div className="home-fullscreen"><Button variant="ghost" onClick={toggleFullscreen} aria-label={fullscreen?'Keluar layar penuh':'Layar penuh'} aria-pressed={fullscreen}>{fullscreen ? <Maximize aria-label="Keluar layar penuh"/> : <Maximize aria-label="Layar penuh"/>}</Button>{fullscreenError&&<p role="status">{fullscreenError}</p>}</div>
 {section!=='home'&&<header className="geo-nav"><Link className="geo-brand" href="/"><span><Globe2/></span><div>Nusantara<span>JELAJAH • PAHAMI • SIAGA</span></div></Link><nav aria-label="Menu utama"><Link href="/belajar" aria-current={section==='belajar'?'page':undefined}>Belajar</Link><Link href="/mitigasi" aria-current={section==='mitigasi'?'page':undefined}>Mitigasi Gempa</Link></nav><Button asChild variant="outline"><Link href="/lab"><Triangle/>Laboratorium <ArrowRight/></Link></Button></header>}
  {section==='home'?<>
  <section className="geo-intro"><div className="geo-kicker"><span/> IPAS · KELAS 6</div><h1>Mengenal Kondisi Geografis Indonesia <span>(Manfaat dan Ancaman)</span></h1><p>Kenali negeri kita. Temukan kekayaan alamnya, pahami risikonya,<br className="desktop-break"/> dan belajar menjadi generasi yang siap siaga.</p><nav className="hero-glass-menu" aria-label="Pilih kegiatan"><Link href="/belajar"><BookOpen/>Belajar</Link><Link href="/mitigasi"><ShieldCheck/>Mitigasi Gempa</Link><Link href="/lab" className="hero-btn-lab"><Triangle/>Lab Maya<img src="/stem-logo.png" alt="STEM" className="stem-button-badge" /></Link></nav></section>


 </>:section==='belajar'?<Learning/>:<Mitigation/>}
 <footer className="geo-footer"><span>Belajar mengenal alam. Berlatih menghadapi tantangan.</span><div><a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Peta: Natural Earth</a><a href="https://volcano.si.edu/" target="_blank" rel="noreferrer">Gunung api: Smithsonian GVP</a><a href="https://pubs.usgs.gov/gip/dynamic/fire.html" target="_blank" rel="noreferrer">Cincin Api: USGS</a></div></footer>
 </div>;
}

function LearningMap({topic}:{topic:"equator"|"fire"}){
 const mapBox=useRef<HTMLElement>(null),detailBox=useRef<HTMLDivElement>(null);
 const [paused,setPaused]=useState(false);
 const [isMaximized, setIsMaximized] = useState(false);
 const defaultSelected = useMemo(() => {
  if (topic === 'equator') {
   const idx = equatorPlaces.findIndex(p => p.name.toLowerCase().includes('pontianak'));
   return idx !== -1 ? idx : 4;
  } else {
   const idx = volcanoes.findIndex(v => v.name.toLowerCase().includes('anak krakatau'));
   return idx !== -1 ? idx : 2;
  }
 }, [topic]);
 const [selected,setSelected]=useState<number|null>(defaultSelected);
 const [connector,setConnector]=useState({d:'',width:0,height:0});
 const map=useMemo(()=>{const indonesia=region.features.find(f=>f.properties.id==='IDN')!;const projection=geoMercator().fitExtent([[45,48],[1155,445]],indonesia as any);const path=geoPath(projection);return {projection,path,graticule:path(geoGraticule().extent([[90,-18],[149,12]]).step([5,5])()),equator:path({type:'LineString',coordinates:[[91,0],[145,0]]}),arcs:[path({type:'LineString',coordinates:volcanoes.slice(0,11).map(v=>v.point)}),path({type:'LineString',coordinates:[volcanoes[12],volcanoes[11]].map(v=>v.point)}),path({type:'LineString',coordinates:[volcanoes[15],volcanoes[14],volcanoes[13]].map(v=>v.point)})]};},[]);
 const equatorTargets = useMemo(() => {
  if (topic !== 'equator') return [];
  return equatorPlaces.map((place, idx) => ({
   index: idx,
   name: place.name,
   x: (map.projection(place.point as [number, number]) || [0, 0])[0],
  })).sort((a, b) => b.x - a.x);
 }, [topic, map]);
 const lastTimeRef = useRef<number>(0);
 const sunXRef = useRef<number>(1090);
 const lastTriggeredRef = useRef<{ index: number; targetIdx: number; time: number } | null>(null);
 const manualInteractedUntilRef = useRef<number>(0);
 const [isDragging, setIsDragging] = useState(false);
 const isDraggingRef = useRef(false);
 const sunElRef = useRef<SVGGElement | null>(null);

 const updateSunDragPosition = (clientX: number) => {
  const sunEl = sunElRef.current;
  const svg = mapBox.current?.querySelector<SVGSVGElement>('.indonesia-map');
  if (!sunEl || !svg) return;

  let newSvgX = 0;
  try {
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = 0;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      newSvgX = pt.matrixTransform(ctm.inverse()).x;
    }
  } catch {
    const rect = svg.getBoundingClientRect();
    newSvgX = ((clientX - rect.left) / rect.width) * 1200;
  }
  newSvgX = Math.max(90, Math.min(1090, newSvgX));

  sunXRef.current = newSvgX;
  sunEl.style.transform = `translateX(${newSvgX}px)`;
  sunEl.style.opacity = '1';

  let closestIdx = -1;
  let minDist = Infinity;
  for (let i = 0; i < equatorPlaces.length; i++) {
    const placeX = (map.projection(equatorPlaces[i].point as [number, number]) || [0, 0])[0];
    const dist = Math.abs(newSvgX - placeX);
    if (dist < minDist) {
      minDist = dist;
      closestIdx = i;
    }
  }

  if (closestIdx !== -1 && minDist <= 60) {
    setSelected(closestIdx);
    const targetIdx = equatorTargets.findIndex(t => t.index === closestIdx);
    if (targetIdx !== -1) {
      lastTriggeredRef.current = {
        index: closestIdx,
        targetIdx,
        time: Date.now()
      };
    }
  }
 };

 const endSunDrag = () => {
  if (!isDraggingRef.current) return;
  isDraggingRef.current = false;
  setIsDragging(false);
  lastTimeRef.current = performance.now();
  manualInteractedUntilRef.current = Date.now() + 1500;
 };

 const handleSunPointerDown = (e: React.PointerEvent) => {
  if (e.button !== 0 && e.pointerType === 'mouse') return;
  e.preventDefault();
  e.stopPropagation();

  isDraggingRef.current = true;
  setIsDragging(true);
  manualInteractedUntilRef.current = Date.now() + 60000;

  try {
    (e.target as Element).setPointerCapture?.(e.pointerId);
  } catch {}
 };

 useEffect(() => {
  if (!isDragging) return;
  const handlePointerMove = (e: PointerEvent) => {
    e.preventDefault();
    updateSunDragPosition(e.clientX);
  };
  const handlePointerUp = () => {
    endSunDrag();
  };
  window.addEventListener('pointermove', handlePointerMove, { passive: false });
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);
  return () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
  };
 }, [isDragging, map, equatorTargets]);

 useEffect(()=>{
  let frame=0;
  lastTimeRef.current=performance.now();
  const update=()=>{
   const now=performance.now();
   let dt=(now-lastTimeRef.current)/1000;
   lastTimeRef.current=now;
   if(dt>0.1)dt=0.016;

   const root=mapBox.current,detail=detailBox.current,point=root?.querySelector<HTMLButtonElement>('.volcano-hit.chosen'),viewport=root?.querySelector('.zoomable-map');
   if(root&&detail&&point&&viewport){const r=root.getBoundingClientRect(),p=point.getBoundingClientRect(),a=detail.getBoundingClientRect(),v=viewport.getBoundingClientRect();const scale=r.width/root.clientWidth;const px=p.left+p.width/2,py=p.top+p.height/2;const x=(px-r.left)/scale,y=(py-r.top)/scale,ex=(a.left+a.width/2-r.left)/scale,ey=(a.top-r.top)/scale;
    const d=px>=v.left&&px<=v.right&&py>=v.top&&py<=v.bottom?`M ${x} ${y} L ${x} ${ey-12} L ${ex} ${ey-12} L ${ex} ${ey}`:'';
    setConnector(old=>old.d===d&&old.width===root.clientWidth&&old.height===root.clientHeight?old:{d,width:root.clientWidth,height:root.clientHeight});}

   if(topic==='equator'&&equatorTargets.length>0){
    const sunEl=sunElRef.current;
    if(!paused&&!isDraggingRef.current){
     sunXRef.current-=31.25*dt;
     if(sunXRef.current<=90){
      sunXRef.current=1090;
      lastTriggeredRef.current=null;
     }
     if(sunEl){
      sunEl.style.transform=`translateX(${sunXRef.current}px)`;
      let opacity=1;
      if(sunXRef.current>1030){
       opacity=Math.max(0,Math.min(1,(1090-sunXRef.current)/60));
      }else if(sunXRef.current<130){
       opacity=Math.max(0,Math.min(1,(sunXRef.current-90)/40));
      }
      sunEl.style.opacity=String(opacity);
     }
    }

    const currentTimeMs=Date.now();
    if(!isDraggingRef.current&&currentTimeMs>=manualInteractedUntilRef.current){
     const currentX=sunXRef.current;
     let currentTargetIdx=-1;
     for(let i=0;i<equatorTargets.length;i++){
      if(currentX<=equatorTargets[i].x+18){
       currentTargetIdx=i;
      }else{
       break;
      }
     }
     if(currentTargetIdx!==-1){
      const lastTrigger=lastTriggeredRef.current;
      if(!lastTrigger||lastTrigger.targetIdx!==currentTargetIdx){
       const elapsed=lastTrigger?(currentTimeMs-lastTrigger.time):Infinity;
       if(elapsed>=1400){
        lastTriggeredRef.current={
         index:equatorTargets[currentTargetIdx].index,
         targetIdx:currentTargetIdx,
         time:currentTimeMs
        };
        setSelected(equatorTargets[currentTargetIdx].index);
       }
      }
     }
    }
   }

   frame=requestAnimationFrame(update);
  };
  frame=requestAnimationFrame(update);
  return ()=>cancelAnimationFrame(frame);
 },[selected, isMaximized, paused, topic, equatorTargets]);

 useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion: reduce)');setPaused(mq.matches);},[]);
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
 const fire=topic==="fire",equator=!fire;
 const locations=fire?volcanoes:equatorPlaces;
 return (
  <>
  {isMaximized&&<div className="expand-backdrop" onClick={()=>setIsMaximized(false)} aria-hidden="true"/>}
  <section ref={mapBox} className={`geo-map-section fire-detail-map ${paused?'is-paused':''} ${isMaximized?'is-maximized':''}`} aria-label="Peta interaktif Indonesia"><div className="geo-map-head"><div><span className="geo-kicker">JELAJAHI PETA</span><h2>{fire?'Jalur Cincin Api':'Garis Khatulistiwa'}</h2></div><div className="map-controls"><Button variant="ghost" aria-label={isMaximized?"Perkecil peta":"Perbesar peta"} onClick={()=>setIsMaximized(!isMaximized)}><Expand/></Button><Button variant="ghost" aria-label={paused?'Putar animasi':'Jeda animasi'} onClick={()=>setPaused(!paused)}>{paused?<Play/>:<Pause/>}</Button></div></div>
  <div className="geo-map-scroll zoomable-map" tabIndex={0} aria-label="Peta dapat digulir"><div className="geo-map-inner"><svg viewBox="0 0 1200 490" className="indonesia-map" role="img" aria-labelledby="map-title map-description"><title id="map-title">{fire?'Peta Indonesia dan contoh gunung api dalam jalur Cincin Api':'Peta Indonesia dilintasi khatulistiwa'}</title><desc id="map-description">{fire?'Enam belas gunung api. Garis penghubung skematis, bukan batas lempeng atau peta bahaya.':'Dua belas titik daerah khatulistiwa. Koordinat lintang nol adalah titik representatif, bukan selalu lokasi tugu atau pusat permukiman. Animasi Matahari menggambarkan gerak semu harian timur ke barat secara sederhana.'}</desc><defs><clipPath id="map-clip"><rect width="1200" height="490"/></clipPath></defs><g clipPath="url(#map-clip)"><path d={map.graticule||''} className="map-graticule"/>{region.features.map(f=><path key={f.properties.id} d={map.path(f as any)||''} className={f.properties.id==='IDN'?'map-land':'map-neighbor'}/>)}
  {equator&&<g className="equator"><path d={map.equator||''}/><text x="1100" y={(map.projection([140,0])?.[1]||0)-14} textAnchor="end">KHATULISTIWA · 0°</text></g>}
  {fire&&<g className="fire-paths">{map.arcs.map((d,i)=><g key={i}><path className="fire-glow" d={d||''}/><path className="fire-route" d={d||''}/></g>)}</g>}
  {islands.map(i=>{const p=map.projection(i.point as [number,number])!;return <text key={i.name} x={p[0]} y={p[1]} className="island-label" textAnchor="middle">{i.name}</text>})}<text x="135" y="405" className="ocean-label">SAMUDRA HINDIA</text><text x="990" y="78" className="ocean-label">SAMUDRA PASIFIK</text>
  {locations.map((v,i)=>{const p=map.projection(v.point as [number,number])!;return <g key={v.name} transform={`translate(${p[0]},${p[1]})`}><circle r="12" className="volcano-pulse" style={{animationDelay:`${i*.4}s`}}/><circle r="5" className="volcano-center"/></g>})}
  {equator&&<g transform={`translate(0,${(map.projection([120,0])?.[1]||0)-44})`} aria-label="Ilustrasi gerak semu Matahari dari timur ke barat"><g ref={sunElRef} className={`equator-sun ${isDragging?'is-dragging':''}`} style={{transform:`translateX(${sunXRef.current}px)`}} onPointerDown={handleSunPointerDown} role="slider" aria-label="Posisi matahari khatulistiwa. Geser manual ke kanan atau kiri" aria-valuemin={90} aria-valuemax={1090} tabIndex={0} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();e.stopPropagation();const delta=e.key==='ArrowLeft'?-25:25;const nextX=Math.max(90,Math.min(1090,sunXRef.current+delta));sunXRef.current=nextX;if(sunElRef.current){sunElRef.current.style.transform=`translateX(${nextX}px)`;}lastTimeRef.current=performance.now();manualInteractedUntilRef.current=Date.now()+3000;let closestIdx=-1,minDist=Infinity;for(let i=0;i<equatorPlaces.length;i++){const px=(map.projection(equatorPlaces[i].point as [number,number])||[0,0])[0];const dist=Math.abs(nextX-px);if(dist<minDist){minDist=dist;closestIdx=i;}}if(closestIdx!==-1&&minDist<=60)setSelected(closestIdx);}}}><title>Geser matahari ke kanan atau kiri</title><circle cx="0" cy="0" r="42" className="sun-drag-hit"/><image href="/sun-icon.png" x="-35" y="-35" width="70" height="70" preserveAspectRatio="xMidYMid meet"/></g></g>}</g></svg>
  {locations.map((v,i)=>{const p=map.projection(v.point as [number,number])!;return <button key={v.name} className={'volcano-hit '+(selected===i?'chosen':'')} style={{left:p[0]/12+'%',top:p[1]/4.9+'%'}} aria-label={`Pelajari ${fire?"Gunung ":"daerah "}${v.name}, ${v.region}`} aria-pressed={selected===i} onClick={()=>{setSelected(i);manualInteractedUntilRef.current=Date.now()+4000;}}><span className="sr-only">{v.name}</span></button>})}</div></div>
  {<div className="volcano-detail-slot">{selected!==null&&<div ref={detailBox} className="volcano-inline-detail" aria-live="polite"><VolcanoPhoto key={locations[selected].image} name={locations[selected].name} url={locations[selected].image}/><div className="volcano-detail-copy"><div className="volcano-detail-heading"><h3>{locations[selected].name}</h3><button aria-label="Tutup penjelasan" onClick={()=>{setSelected(null);manualInteractedUntilRef.current=Date.now()+4000;}}>×</button></div><p className="volcano-region">{locations[selected].region}</p><p>{locations[selected].description}</p><select aria-label={fire?"Pilih gunung api":"Pilih daerah khatulistiwa"} value={selected} onChange={e=>{const idx=Number(e.target.value);setSelected(idx);manualInteractedUntilRef.current=Date.now()+4000;}} onKeyDown={e=>e.stopPropagation()}>{locations.map((v,i)=><option key={v.name} value={i}>{v.name}</option>)}</select></div></div>}</div>}
  {connector.d&&<svg className="volcano-connector" viewBox={`0 0 ${connector.width} ${connector.height}`} aria-hidden="true"><path d={connector.d}/></svg>}
  </section>
  </>
 );
}
function VolcanoPhoto({name,url}:{name:string;url:string}){
 const [failed,setFailed]=useState(false),[attempt,setAttempt]=useState(0);
 return <figure className="volcano-photo">{failed?<div className="volcano-photo-error"><Mountain aria-hidden="true"/><p>Foto belum dapat dimuat.</p><button onClick={()=>{setFailed(false);setAttempt(a=>a+1);}}>Coba lagi</button></div>:<img key={attempt} className="volcano-img" src={url} alt={'Foto '+name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={()=>setFailed(true)}/>}<figcaption><a href={url} target="_blank" rel="noreferrer">Lihat gambar asli ↗</a><span>{url.includes('wikimedia.org')?'Wikimedia Commons':new URL(url).hostname}</span></figcaption></figure>;
}
function Learning(){
 const [slide,setSlide]=useState(0);
 const titles=['Dilintasi Khatulistiwa','Jalur Cincin Api','Negeri Kepulauan'];
 return <section className={'learning-deck slide-theme-'+slide} aria-label="Slide Kondisi Geografis Indonesia" onKeyDown={e=>{if(e.key==='ArrowRight'){e.preventDefault();setSlide(s=>Math.min(2,s+1));}if(e.key==='ArrowLeft'){e.preventDefault();setSlide(s=>Math.max(0,s-1));}}}>
 <div className="slide-top"><Link href="/" aria-label="Kembali ke Beranda"><House /></Link></div>
 <h1>Kondisi Geografis Indonesia</h1>
 <div className="slide-body has-map">
 {slide===0&&<article className="slide-glass"><img className="slide-illustration" src="/slide-khatulistiwa.png" alt=""/><Sun/><h2>Dilintasi Khatulistiwa</h2><p>Garis khayal lintang 0° yang membagi Bumi menjadi belahan utara dan selatan.</p><h3>Pengaruh & Manfaat</h3><ul className="slide-aspects"><li><strong>Ekonomi:</strong> Sinar matahari dan iklim tropis sepanjang tahun menyuburkan sektor pertanian, perkebunan, serta pariwisata bahari.</li><li><strong>Sosial:</strong> Pola aktivitas masyarakat berjalan relatif stabil tanpa hambatan perubahan musim yang ekstrem.</li><li><strong>Budaya:</strong> Melahirkan ragam tradisi bercocok tanam, arsitektur rumah panggung bersirkulasi luas, dan pakaian adat berbahan ringan.</li></ul></article>}
 {slide===1&&<article className="slide-glass"><img className="slide-illustration" src="/slide-cincin-api.png" alt=""/><Mountain/><h2>Jalur Cincin Api</h2><p>Kawasan pertemuan lempeng aktif dengan banyak gunung api dan potensi gempa di sekitar Samudra Pasifik.</p><h3>Pengaruh & Manfaat</h3><ul className="slide-aspects"><li><strong>Ekonomi:</strong> Abu vulkanik menyuburkan tanah pertanian serta menyimpan potensi energi panas bumi (geotermal) dan tambang mineral tinggi.</li><li><strong>Sosial:</strong> Menuntut ketangguhan (<em>resilience</em>) dan kesiapsiagaan masyarakat terhadap ancaman gempa, erupsi, dan tsunami.</li><li><strong>Budaya:</strong> Mendorong lahirnya kearifan lokal mitigasi bencana (arsitektur tradisional tahan gempa) serta tradisi penghormatan alam.</li></ul></article>}
 {slide===2&&<article className="slide-glass"><img className="slide-illustration" src="/slide-kepulauan.png" alt=""/><Waves/><h2>Negeri Kepulauan</h2><p>Negara maritim yang menghubungkan ribuan pulau dengan bentang alam dan potensi perairan yang luas.</p><h3>Pengaruh & Manfaat</h3><ul className="slide-aspects"><li><strong>Ekonomi:</strong> Potensi perikanan dan sumber daya laut melimpah, meski membutuhkan biaya logistik dan transportasi antarpulau.</li><li><strong>Sosial:</strong> Pemukiman terkonsentrasi di wilayah pesisir serta mobilitas penduduk bertumpu pada konektivitas laut.</li><li><strong>Budaya:</strong> Isolasi geografis antarpulau melahirkan keberagaman suku, bahasa daerah, adat istiadat, serta tradisi kebaharian yang kaya.</li></ul></article>}
 {slide<2?<LearningMap key={slide} topic={slide===0?"equator":"fire"}/>:<IslandsMap key={slide}/>}
 </div>
 <nav className="slide-navigation" aria-label="Navigasi slide" style={{justifyContent: 'center'}}><div className="slide-selectors">{titles.map((title,i)=><button key={title} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}: ${title}`} aria-current={slide===i?'step':undefined}>{i+1}</button>)}</div></nav>
 </section>
}
function LightPrompt(){return <Leaf aria-hidden="true"/>}
function Mitigation(){return <section className="geo-lesson"><Link href="/" className="back-home">← Kembali ke beranda</Link><span className="geo-kicker">MITIGASI GEMPA</span><h1>Kenali risikonya.<br/>Latih kesiapsiagaannya.</h1><p className="lesson-intro">Mitigasi adalah upaya mengurangi risiko bencana. Mulailah dari lingkungan terdekat dan berlatihlah bersama guru serta keluarga.</p><Tabs defaultValue="sebelum" className="mitigation-tabs"><TabsList aria-label="Tahapan kesiapsiagaan"><TabsTrigger value="sebelum">Sebelum gempa</TabsTrigger><TabsTrigger value="saat">Saat gempa</TabsTrigger><TabsTrigger value="sesudah">Sesudah gempa</TabsTrigger></TabsList><TabsContent value="sebelum"><div className="safety-content"><Backpack/><div><h2>Siapkan, kenali, dan berlatih.</h2><ol><li>Kenali tempat berlindung, jalur evakuasi, dan titik kumpul sekolah.</li><li>Bersama orang dewasa, amankan lemari dan letakkan benda berat di bawah.</li><li>Siapkan perlengkapan darurat: air, makanan, senter, serta kotak P3K.</li></ol></div></div></TabsContent><TabsContent value="saat"><div className="safety-content"><ShieldCheck/><div><h2>Lindungi diri dari benda yang jatuh.</h2><ol><li>Di dalam ruangan, merunduk, lindungi kepala dan leher, lalu berlindung di bawah meja kokoh dan berpegangan.</li><li>Jauhi kaca. Jangan menggunakan lift. Ikuti arahan guru.</li><li>Di luar, jauhi bangunan, tiang, dan pohon. Di pesisir, setelah guncangan kuat atau lama berhenti, segera evakuasi ke tempat tinggi melalui jalur aman.</li></ol></div></div></TabsContent><TabsContent value="sesudah"><div className="safety-content"><House/><div><h2>Keluar tertib dan tetap waspada.</h2><ol><li>Setelah guncangan berhenti, ikuti jalur aman menuju titik kumpul bersama guru.</li><li>Laporkan orang yang terluka kepada orang dewasa. Hindari bangunan yang rusak.</li><li>Waspadai gempa susulan dan ikuti informasi resmi BMKG serta petugas.</li></ol></div></div></TabsContent></Tabs><p className="safety-source">Panduan pembelajaran diringkas dari <a href="https://www.bmkg.go.id/gempabumi/mitigasi/antisipasi-gempabumi" target="_blank" rel="noreferrer">BMKG: Antisipasi Gempa Bumi</a>. Sesuaikan latihan dengan prosedur sekolah.</p><div className="lab-invitation"><span className="lab-invitation-icon"><Triangle/></span><div><span className="geo-kicker">LANJUTKAN DENGAN EKSPERIMEN</span><h2>Bisakah menaramu bertahan?</h2><p>Bangun dari nol menggunakan marshmallow dan tusuk gigi virtual. Uji guncangan, lalu perbaiki desainmu.</p></div><Button asChild><Link href="/lab">Masuk aplikasi <ArrowRight/></Link></Button></div><p className="model-note">Laboratorium adalah model pembelajaran struktur sederhana, bukan pengujian keamanan bangunan nyata.</p></section>}

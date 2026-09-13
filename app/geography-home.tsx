"use client";
import {useState,useMemo,useEffect,useRef,useLayoutEffect} from 'react';
import {geoMercator,geoPath,geoGraticule} from 'd3-geo';
import {Globe2,BookOpen,ShieldCheck,ArrowRight,Triangle,Pause,Play,Sun,Mountain,Leaf,Waves,House,Backpack,MoveRight,Expand,Maximize,ZoomIn,ZoomOut,CheckCircle2,AlertTriangle,ChevronRight,ChevronLeft,ShieldAlert,Users,Radio,Building,Activity,PhoneCall,AlertOctagon,User,HelpCircle} from 'lucide-react';
import {Button} from '@/components/ui/button';

import region from '@/lib/indonesia-region.json';
import equatorPlaces from '@/lib/equator-places.json';
import './geography.css';
import IslandsMap from './islands-map';
import AudioPlayer from '@/components/audio-player';
import QuizApp from '@/components/quiz-app';

const volcanoes=[{"name": "Sinabung", "point": [98.392, 3.17], "region": "Sumatera Utara", "description": "Stratovolcano di Kabupaten Karo. Sinabung kembali menunjukkan aktivitas setelah sebelumnya lama tidak mengalami erupsi besar dalam catatan modern.", "source": "https://volcano.si.edu/volcano.cfm?vn=261080", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e6/Gunung_Sinabung.jpg"}, {"name": "Kerinci", "point": [101.264, -1.697], "region": "Jambi–Sumatera Barat", "description": "Gunung api tertinggi di Indonesia, dengan ketinggian sekitar 3.800 m. Berada di kawasan Pegunungan Bukit Barisan.", "source": "https://volcano.si.edu/volcano.cfm?vn=261170", "image": "https://upload.wikimedia.org/wikipedia/commons/b/b3/Gunung_Kerinci.jpg"}, {"name": "Anak Krakatau", "point": [105.423, -6.101], "region": "Selat Sunda", "description": "Gunung api yang tumbuh di kompleks Kaldera Krakatau setelah letusan dahsyat Krakatau tahun 1883. Berada di antara Pulau Sumatra dan Jawa.", "source": "https://volcano.si.edu/volcano.cfm?vn=262000", "image": "https://tangselpos.id/storage/2026/09/gunung-anak-krakatau-masih-batuk-batuk-hari-ini-sudah-5-kali-erupsi-08092026-202824.jpg"}, {"name": "Tangkuban Parahu", "point": [107.6, -6.77], "region": "Jawa Barat", "description": "Gunung api di sebelah utara Bandung yang terkenal dengan kawah-kawahnya. Bentuknya merupakan bagian dari kompleks vulkanik Sunda.", "source": "https://volcano.si.edu/volcano.cfm?vn=263090", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Tangkuban_Perahu.jpg"}, {"name": "Merapi", "point": [110.446, -7.54], "region": "DIY–Jawa Tengah", "description": "Salah satu gunung api paling aktif di Indonesia. Gunung ini memiliki kubah lava aktif dan berada di sebelah utara Yogyakarta.", "source": "https://volcano.si.edu/volcano.cfm?vn=263250", "image": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Mount_Merapi.jpg"}, {"name": "Semeru", "point": [112.922, -8.108], "region": "Jawa Timur", "description": "Gunung tertinggi di Pulau Jawa dengan ketinggian sekitar 3.657 m. Aktivitas erupsinya sering berupa letusan abu dari kawah puncak.", "source": "https://volcano.si.edu/volcano.cfm?vn=263300", "image": "https://upload.wikimedia.org/wikipedia/commons/e/e3/Mount_Semeru.jpg"}, {"name": "Ijen", "point": [114.242, -8.058], "region": "Jawa Timur", "description": "Kompleks gunung api yang terkenal dengan danau kawah berwarna biru kehijauan dan sangat asam. Berada di ujung timur Pulau Jawa.", "source": "https://volcano.si.edu/volcano.cfm?vn=263350", "image": "https://upload.wikimedia.org/wikipedia/commons/a/ae/Kawah_ijen.jpg"}, {"name": "Agung", "point": [115.508, -8.343], "region": "Bali", "description": "Gunung api tertinggi di Bali dengan ketinggian sekitar 2.997 m. Terletak di bagian timur Pulau Bali.", "source": "https://volcano.si.edu/volcano.cfm?vn=264020", "image": "https://upload.wikimedia.org/wikipedia/commons/c/cc/MountAgung.jpg"}, {"name": "Rinjani", "point": [116.47, -8.42], "region": "Lombok, NTB", "description": "Gunung api setinggi sekitar 3.726 m yang memiliki Kaldera Segara Anak dengan danau besar di dalamnya.", "source": "https://volcano.si.edu/volcano.cfm?vn=264030", "image": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Gunung_rinjani.jpg"}, {"name": "Tambora", "point": [118, -8.25], "region": "Sumbawa, NTB", "description": "Terkenal karena letusan sangat besar tahun 1815 yang membentuk kaldera luas di puncaknya.", "source": "https://volcano.si.edu/volcano.cfm?vn=264040", "image": "https://upload.wikimedia.org/wikipedia/commons/7/78/Mount_Tambora_Volcano%2C_Sumbawa_Island%2C_Indonesia.jpg"}, {"name": "Kelimutu", "point": [121.82, -8.77], "region": "Flores, NTT", "description": "Kompleks gunung api yang terkenal dengan tiga danau kawah yang dapat menunjukkan warna berbeda.", "source": "https://volcano.si.edu/volcano.cfm?vn=264140", "image": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Danau_Kelimutu.jpg"}, {"name": "Lokon", "point": [124.7992, 1.3644], "region": "Sulawesi Utara", "description": "Kompleks gunung api dekat Tomohon. Aktivitas vulkaniknya terutama berpusat di Kawah Tompaluan di antara Lokon dan Empung.", "source": "https://volcano.si.edu/volcano.cfm?vn=266100", "image": "https://upload.wikimedia.org/wikipedia/commons/5/55/Gunung_Lokon.jpg"}, {"name": "Soputan", "point": [124.737, 1.112], "region": "Sulawesi Utara", "description": "Stratovolcano di bagian utara Sulawesi dan termasuk gunung api yang memiliki riwayat aktivitas cukup sering.", "source": "https://volcano.si.edu/volcano.cfm?vn=266030", "image": "https://upload.wikimedia.org/wikipedia/commons/2/20/Soputan.jpg"}, {"name": "Dukono", "point": [127.8783, 1.6992], "region": "Halmahera Utara", "description": "Kompleks gunung api di Pulau Halmahera yang dikenal memiliki aktivitas erupsi dan pelepasan abu yang berlangsung lama.", "source": "https://volcano.si.edu/volcano.cfm?vn=268010", "image": "https://upload.wikimedia.org/wikipedia/commons/6/6e/Dukono.jpg"}, {"name": "Ibu", "point": [127.6324, 1.4941], "region": "Halmahera Barat", "description": "Stratovolcano di bagian barat laut Halmahera. Kawah puncaknya menjadi pusat aktivitas vulkanik gunung ini.", "source": "https://volcano.si.edu/volcano.cfm?vn=268030", "image": "https://upload.wikimedia.org/wikipedia/commons/5/5b/Gunung_Ibu.jpg"}, {"name": "Gamalama", "point": [127.3322, 0.81], "region": "Ternate, Maluku Utara", "description": "Gunung api berbentuk kerucut yang membentuk sebagian besar Pulau Ternate. Memiliki sejarah erupsi yang panjang.", "source": "https://volcano.si.edu/volcano.cfm?vn=268060", "image": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Gunung_Gamalama.jpg"}];
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const MITIGATION_INTRO_TEXT = "Terletak di kawasan Cincin Api Pasifik, Indonesia sangat rawan terhadap gempa bumi. Mengingat bencana datang tanpa peringatan, mitigasi atau upaya pengurangan risiko bencana menjadi sangat krusial demi keselamatan bersama. Mari pelajari langkah mitigasi gempa yang tepat.";

function MitigationIntroModal({
  isOpen,
  onClose,
  onProceed
}: {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setIsFinished(false);
      return;
    }

    setDisplayedText('');
    setIsFinished(false);
    let index = 0;

    const timer = setInterval(() => {
      index++;
      if (index <= MITIGATION_INTRO_TEXT.length) {
        setDisplayedText(MITIGATION_INTRO_TEXT.slice(0, index));
      } else {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'Enter' && isFinished) {
        onProceed();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFinished, onClose, onProceed]);

  if (!isOpen) return null;

  return (
    <div
      className="miti-intro-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pengantar Mitigasi Gempa"
    >
      <div className="miti-intro-dialog" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="miti-intro-close"
          onClick={onClose}
          aria-label="Tutup"
        >
          ✕
        </button>

        <div className="miti-intro-icon-wrap">
          <div className="miti-intro-icon-ring">
            <AlertTriangle className="miti-intro-alert-icon" />
          </div>
          <span className="miti-intro-badge">PERINGATAN DINI & MITIGASI BENCANA</span>
        </div>

        <div
          className="miti-intro-content"
          onClick={() => {
            if (!isFinished) {
              setDisplayedText(MITIGATION_INTRO_TEXT);
              setIsFinished(true);
            }
          }}
          title={!isFinished ? "Klik untuk mempercepat teks" : undefined}
        >
          <p className="miti-intro-text">
            {displayedText}
            {!isFinished && <span className="miti-typewriter-cursor">|</span>}
          </p>
        </div>

        {isFinished && (
          <div className="miti-intro-action-wrap">
            <button
              type="button"
              className="miti-intro-action-btn"
              onClick={onProceed}
              autoFocus
            >
              <ShieldAlert className="miti-btn-shield" />
              <span>Mitigasi Gempa</span>
              <ArrowRight className="miti-btn-arrow" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const islands=[{name:'SUMATRA',point:[100,2.4]},{name:'JAWA',point:[111,-6]},{name:'KALIMANTAN',point:[114,1.3]},{name:'SULAWESI',point:[121.1,-3.9]},{name:'PAPUA',point:[137,-3.3]},{name:'NUSA TENGGARA',point:[119,-10.4]},{name:'MALUKU',point:[130.4,-1.9]}];
export default function GeographyHome({section='home'}:{section?:'home'|'belajar'|'mitigasi'|'uji-pemahaman'}){
 const router = useRouter();
 const [fullscreen,setFullscreen]=useState(false),[fullscreenError,setFullscreenError]=useState('');
 const [showPrompt, setShowPrompt] = useState(false);
 const [playMusic, setPlayMusic] = useState(false);
 const [showMitigationIntro, setShowMitigationIntro] = useState(false);
 const [showDeveloperModal, setShowDeveloperModal] = useState(false);

 useEffect(()=>{
  const sync=()=>setFullscreen(!!document.fullscreenElement);sync();document.addEventListener('fullscreenchange',sync);
  if (!sessionStorage.getItem('geo_prompted')) {
    setShowPrompt(true);
  } else {
    setPlayMusic(true);
  }
  return ()=>document.removeEventListener('fullscreenchange',sync);
 },[]);

 useEffect(() => {
  if (section === 'mitigasi' && !sessionStorage.getItem('miti_intro_seen')) {
    setShowMitigationIntro(true);
  }
 }, [section]);

 useEffect(() => {
  if (!showDeveloperModal) return;
  const handleKey = (e: KeyboardEvent) => {
   if (e.key === 'Escape') setShowDeveloperModal(false);
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
 }, [showDeveloperModal]);

 async function toggleFullscreen(){try{setFullscreenError('');if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setFullscreenError('Layar penuh belum tersedia. Gunakan tombol layar penuh pada browser papan.');}}
 
 function handlePrompt(accept: boolean) {
  sessionStorage.setItem('geo_prompted', 'true');
  setShowPrompt(false);
  setPlayMusic(true);
  if (accept) document.documentElement.requestFullscreen().catch(()=>{});
 }

 function handleProceedToMitigation() {
  sessionStorage.setItem('miti_intro_seen', 'true');
  setShowMitigationIntro(false);
  if (section !== 'mitigasi') {
    router.push('/mitigasi');
  }
 }

 return <div className={'geo-home '+(section==='home'?'is-home':(section==='belajar'||section==='mitigasi'||section==='uji-pemahaman')?'is-learning':'')}>
 <MitigationIntroModal
   isOpen={showMitigationIntro}
   onClose={() => setShowMitigationIntro(false)}
   onProceed={handleProceedToMitigation}
 />
 {section === 'home' && (
   <button
     type="button"
     className="home-developer-btn"
     onClick={() => setShowDeveloperModal(true)}
     aria-label="Tentang Pengembang"
   >
     <User className="w-4 h-4" />
     <span>Tentang Pengembang</span>
   </button>
 )}
 {showDeveloperModal && (
   <div
     className="dev-modal-overlay"
     onClick={() => setShowDeveloperModal(false)}
     role="dialog"
     aria-modal="true"
     aria-label="Tentang Pengembang"
   >
     <div className="dev-modal-card">
       <img
         src="/tentang-pengembang.png"
         alt="Tentang Pengembang - Teguh Firmansyah Apriliana, M.Pd"
         className="dev-modal-img"
       />
       <div className="dev-modal-hint">Klik di mana saja untuk keluar</div>
     </div>
   </div>
 )}
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
 {section!=='home'&&<header className="geo-nav"><Link className="geo-brand" href="/"><span><Globe2/></span><div>Nusantara<span>JELAJAH • PAHAMI • SIAGA</span></div></Link><nav aria-label="Menu utama"><Link href="/belajar" aria-current={section==='belajar'?'page':undefined}>Belajar</Link><Link href="/mitigasi" aria-current={section==='mitigasi'?'page':undefined} onClick={(e)=>{e.preventDefault();setShowMitigationIntro(true);}}>Mitigasi Gempa</Link><Link href="/uji-pemahaman" aria-current={section==='uji-pemahaman'?'page':undefined}>Uji Pemahaman</Link></nav><Button asChild variant="outline"><Link href="/lab"><Triangle/>Laboratorium <ArrowRight/></Link></Button></header>}
  {section==='home'?<>
  <section className="geo-intro"><div className="geo-kicker"><span/> IPAS · KELAS 6</div><h1>Mengenal Kondisi Geografis Indonesia <span>(Manfaat dan Ancaman)</span></h1><p>Kenali negeri kita. Temukan kekayaan alamnya, pahami risikonya,<br className="desktop-break"/> dan belajar menjadi generasi yang siap siaga.</p><nav className="hero-glass-menu" aria-label="Pilih kegiatan"><Link href="/belajar"><BookOpen/>Belajar</Link><Link href="/mitigasi" onClick={(e)=>{e.preventDefault();setShowMitigationIntro(true);}}><ShieldCheck/>Mitigasi Gempa</Link><Link href="/lab" className="hero-btn-lab"><Triangle/>Lab Maya<img src="/stem-logo.png" alt="STEM" className="stem-button-badge" /></Link><Link href="/uji-pemahaman" className="hero-btn-quiz"><HelpCircle/>Uji Pemahaman</Link></nav></section>


 </>:section==='belajar'?<Learning/>:section==='mitigasi'?<Mitigation/>:<QuizApp/>}
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
 {slide===0&&<article className="slide-glass"><img className="slide-illustration" src="/slide-khatulistiwa.gif" alt="Animasi Dilintasi Khatulistiwa"/><Sun/><h2>Dilintasi Khatulistiwa</h2><p>Garis khayal lintang 0° yang membagi Bumi menjadi belahan utara dan selatan.</p><h3>Pengaruh & Manfaat</h3><ul className="slide-aspects"><li><strong>Ekonomi:</strong> Sinar matahari dan iklim tropis sepanjang tahun menyuburkan sektor pertanian, perkebunan, serta pariwisata bahari.</li><li><strong>Sosial:</strong> Pola aktivitas masyarakat berjalan relatif stabil tanpa hambatan perubahan musim yang ekstrem.</li><li><strong>Budaya:</strong> Melahirkan ragam tradisi bercocok tanam, arsitektur rumah panggung bersirkulasi luas, dan pakaian adat berbahan ringan.</li></ul></article>}
 {slide===1&&<article className="slide-glass"><img className="slide-illustration" src="/slide-cincin-api.gif" alt="Animasi Jalur Cincin Api"/><Mountain/><h2>Jalur Cincin Api</h2><p>Kawasan pertemuan lempeng aktif dengan banyak gunung api dan potensi gempa di sekitar Samudra Pasifik.</p><h3>Pengaruh & Manfaat</h3><ul className="slide-aspects"><li><strong>Ekonomi:</strong> Abu vulkanik menyuburkan tanah pertanian serta menyimpan potensi energi panas bumi (geotermal) dan tambang mineral tinggi.</li><li><strong>Sosial:</strong> Menuntut ketangguhan (<em>resilience</em>) dan kesiapsiagaan masyarakat terhadap ancaman gempa, erupsi, dan tsunami.</li><li><strong>Budaya:</strong> Mendorong lahirnya kearifan lokal mitigasi bencana (arsitektur tradisional tahan gempa) serta tradisi penghormatan alam.</li></ul></article>}
 {slide===2&&<article className="slide-glass"><img className="slide-illustration" src="/slide-kepulauan.gif" alt="Animasi Negeri Kepulauan"/><Waves/><h2>Negeri Kepulauan</h2><p>Negara maritim yang menghubungkan ribuan pulau dengan bentang alam dan potensi perairan yang luas.</p><h3>Pengaruh & Manfaat</h3><ul className="slide-aspects"><li><strong>Ekonomi:</strong> Potensi perikanan dan sumber daya laut melimpah, meski membutuhkan biaya logistik dan transportasi antarpulau.</li><li><strong>Sosial:</strong> Pemukiman terkonsentrasi di wilayah pesisir serta mobilitas penduduk bertumpu pada konektivitas laut.</li><li><strong>Budaya:</strong> Isolasi geografis antarpulau melahirkan keberagaman suku, bahasa daerah, adat istiadat, serta tradisi kebaharian yang kaya.</li></ul></article>}
 {slide<2?<LearningMap key={slide} topic={slide===0?"equator":"fire"}/>:<IslandsMap key={slide}/>}
 </div>
 <nav className="slide-navigation" aria-label="Navigasi slide" style={{justifyContent: 'center'}}><div className="slide-selectors">{titles.map((title,i)=><button key={title} onClick={()=>setSlide(i)} aria-label={`Slide ${i+1}: ${title}`} aria-current={slide===i?'step':undefined}>{i+1}</button>)}</div></nav>
 </section>
}
function LightPrompt(){return <Leaf aria-hidden="true"/>}
interface MitigationPointData {
 id: string;
 shortTitle: string;
 title: string;
 desc: string;
 badge: string;
 image?: string;
 caption: string;
 tips: string[];
 keyRules: { label: string; text: string }[];
}

interface MitigationPhaseData {
 title: string;
 subtitle: string;
 summary: string;
 icon: typeof Backpack;
 points: MitigationPointData[];
}

const mitigationPhases: MitigationPhaseData[] = [
 {
  title: 'Sebelum Gempa',
  subtitle: 'FASE 1 · KESIAPSIAGAAN AWAL',
  summary: 'Siapkan diri, kenali lingkungan, dan berlatih rutin agar siap saat bencana datang.',
  icon: Backpack,
  points: [
   {
    id: 'sebelum-1',
    shortTitle: 'Kenali Jalur & Titik Kumpul',
    title: 'Kenali Tempat Berlindung, Jalur Evakuasi, dan Titik Kumpul',
    desc: 'Kenali tempat berlindung, jalur evakuasi, dan titik kumpul di sekolah maupun di rumah.',
    badge: 'Rute & Titik Kumpul Aman',
    image: '/mitigasi-sebelum-1.jpg',
    caption: 'Memahami rambu hijau darurat, arah panah lantai menuju titik kumpul lapangan terbuka, serta posisi Drop-Cover-Hold On di bawah meja kokoh.',
    tips: [
     'Hafalkan arah panah hijau jalur keluar darurat di koridor sekolah dan rumah',
     'Tentukan titik kumpul (muster point) lapang yang bebas dari bahaya runtuhan gedung',
     'Latih posisi perlindungan merunduk di bawah meja kokoh secara berkala'
    ],
    keyRules: [
     { label: 'Lokasi', text: 'Di sekolah & di rumah' },
     { label: 'Tujuan', text: 'Tahu arah evakuasi tanpa panik saat darurat' }
    ]
   },
   {
    id: 'sebelum-2',
    shortTitle: 'Amankan Perabotan Berat',
    title: 'Amankan Lemari & Taruh Benda Berat di Bagian Bawah',
    desc: 'Bersama orang dewasa, amankan lemari, rak buku, dan letakkan benda berat di bagian bawah agar tidak mudah jatuh.',
    badge: 'Pencegahan Bahaya Ruangan',
    image: '/mitigasi-sebelum-2.jpg',
    caption: 'Memasang siku pengunci dinding (L-bracket) pada lemari tinggi dan menata barang berat pada rak bagian paling bawah.',
    tips: [
     'Pasang siku pengunci (L-bracket) antara lemari tinggi dan dinding kokoh',
     'Pindahkan buku tebal, vas, dan benda berat ke rak dasar lemari',
     'Pastikan pintu keluar dan koridor tidak terhalang perabotan besar'
    ],
    keyRules: [
     { label: 'Prioritas', text: 'Cegah cedera tertimpa perabot roboh' },
     { label: 'Metode', text: 'Kunci bracket besi kuat ke dinding tembok' }
    ]
   },
   {
    id: 'sebelum-3',
    shortTitle: 'Siapkan Tas Siaga Bencana',
    title: 'Siapkan Tas Darurat Bencana (Emergency Bag)',
    desc: 'Siapkan tas darurat berisi air minum, makanan ringan, senter, peluit, dan kotak P3K.',
    badge: 'Kebutuhan Darurat 72 Jam',
    image: '/mitigasi-sebelum-3.jpg',
    caption: 'Tas siaga bencana tahan air berisi logistik bertahan hidup 72 jam pertama yang siap disambar kapan saja.',
    tips: [
     'Air minum botol mineral & makanan padat energi tahan lama',
     'Senter terang, baterai cadangan, dan peluit darurat untuk meminta tolong',
     'Kotak P3K, obat pribadi, masker penahan debu, serta radio darurat'
    ],
    keyRules: [
     { label: 'Posisi Tas', text: 'Dekat pintu keluar / mudah dijangkau' },
     { label: 'Kapasitas', text: 'Mencukupi kebutuhan bertahan 3 hari' }
    ]
   },
   {
    id: 'sebelum-4',
    shortTitle: 'Ikuti Simulasi Gempa Rutin',
    title: 'Ikuti Simulasi Evakuasi Gempa Berkala',
    desc: 'Ikuti simulasi gempa secara berkala di sekolah dan di lingkungan rumah.',
    badge: 'Latihan Refleks & Tanggap Darurat',
    image: '/mitigasi-sebelum-4.jpg',
    caption: 'Siswa berjalan tertib dengan melindungi kepala menggunakan buku menuju titik kumpul lapangan terbuka dipandu guru.',
    tips: [
     'Latih refleks spontan merunduk begitu alarm tanda bahaya berbunyi',
     'Jalan cepat teratur tanpa saling mendahului atau mendorong teman',
     'Dengarkan dan ikuti seluruh arahan guru atau koordinator keselamatan'
    ],
    keyRules: [
     { label: 'Frekuensi', text: 'Minimal 1-2 kali per semester di sekolah' },
     { label: 'Manfaat', text: 'Membiasakan tubuh tetap tenang dan teratur' }
    ]
   }
  ]
 },
 {
  title: 'Saat Gempa',
  subtitle: 'FASE 2 · TINDAKAN PENYELAMATAN DIRI',
  summary: 'Lindungi diri dari benda yang jatuh. Tetap tenang dan ikuti prosedur keselamatan.',
  icon: ShieldCheck,
  points: [
   {
    id: 'saat-1',
    shortTitle: 'Drop, Cover, Hold On',
    title: 'Di Dalam Ruangan: Merunduk, Lindungi Kepala & Bertahan',
    desc: 'Di dalam ruangan — Merunduk, lindungi kepala dan leher, berlindung di bawah meja kokoh, dan berpegangan kuat.',
    badge: 'Aturan Emas Bertahan Hidup',
    image: '/mitigasi-saat-1.jpg',
    caption: 'Tiga langkah baku internasional: Merunduk ke lantai (Drop), Lindungi kepala bawah meja (Cover), Pegang kaki meja kuat (Hold On).',
    tips: [
     'DROP: Segera merunduk ke lantai sebelum guncangan kuat menjatuhkan Anda',
     'COVER: Lindungi kepala dan leher dengan masuk ke kolong meja kokoh',
     'HOLD ON: Pegang erat kaki meja dengan kedua tangan agar meja tidak bergeser'
    ],
    keyRules: [
     { label: 'Peringatan', text: 'Jangan lari keluar saat gempa sedang bergetar keras' },
     { label: 'Fokus', text: 'Lindungi kepala dari serpihan genteng dan lampu plafon' }
    ]
   },
   {
    id: 'saat-2',
    shortTitle: 'Jauhi Kaca & Jangan Pakai Lift',
    title: 'Jauhi Kaca Jendela & Dilarang Menggunakan Lift',
    desc: 'Jauhi kaca, jendela, dan benda yang bisa jatuh. Jangan menggunakan lift.',
    badge: 'Area Bahaya Bangunan',
    image: '/mitigasi-saat-2.jpg',
    caption: 'Kaca jendela mudah pecah menjadi serpihan tajam, sedangkan lift berisiko mati total akibat putusnya aliran listrik.',
    tips: [
     'Menjauh minimal 2–3 meter dari jendela, pintu kaca, dan cermin dinding',
     'Gunakan tas ransel atau buku tebal sebagai pelindung kepala jika tidak ada meja',
     'Jika sedang berada di dalam lift, tekan semua tombol lantai dan segera keluar saat pintu terbuka'
    ],
    keyRules: [
     { label: 'Larangan Mutlak', text: 'DILARANG menggunakan lift saat gempa' },
     { label: 'Jalur Keluar', text: 'Selalu gunakan tangga darurat' }
    ]
   },
   {
    id: 'saat-3',
    shortTitle: 'Di Luar Ruangan: Area Terbuka',
    title: 'Di Luar Ruangan: Jauhi Gedung & Cari Lapangan Lapang',
    desc: 'Di luar ruangan — Jauhi bangunan, tiang listrik, dan pohon besar. Cari area terbuka.',
    badge: 'Zona Bebas Runtuhan',
    image: '/mitigasi-saat-3.jpg',
    caption: 'Menjauh dari fasad dinding gedung, genteng atap, tiang kabel listrik, serta papan reklame.',
    tips: [
     'Bergerak menuju tengah lapangan sepak bola, taman, atau halaman terbuka lebar',
     'Waspadai jatuhnya genteng, serpihan kaca, dan ornamen dinding dari lantai atas',
     'Jauhi trafo dan kabel tiang listrik yang berpotensi putus bertegangan'
    ],
    keyRules: [
     { label: 'Jarak Aman', text: 'Minimal sama dengan tinggi gedung terdekat' },
     { label: 'Posisi', text: 'Merunduk di tanah lapang jika getaran sangat keras' }
    ]
   },
   {
    id: 'saat-4',
    shortTitle: 'Di Pesisir: Waspada Tsunami',
    title: 'Di Kawasan Pesisir: Segera Mengungsi ke Tempat Tinggi',
    desc: 'Di pesisir — Setelah guncangan kuat berhenti, segera evakuasi ke tempat tinggi melalui jalur aman (waspada tsunami).',
    badge: 'Prosedur Tsunami 20-20-20',
    image: '/mitigasi-saat-4.jpg',
    caption: 'Jika gempa dirasakan kuat lebih dari 20 detik di dekat pantai, segera evakuasi ke bukit atau gedung tinggi aman.',
    tips: [
     'Prinsip 20-20-20: Gempa terasa >20 detik, evakuasi dalam 20 menit, tuju elevasi >20 meter',
     'Jangan menunggu air laut surut atau menunggu bunyi sirine peringatan',
     'Gunakan rute jalur evakuasi bukit terdekat dengan berjalan kaki cepat'
    ],
    keyRules: [
     { label: 'Tanda Bahaya', text: 'Air laut surut tiba-tiba & suara gemuruh laut' },
     { label: 'Arah Lari', text: 'Tegak lurus menjauhi garis pantai menuju perbukitan' }
    ]
   }
  ]
 },
 {
  title: 'Setelah Gempa',
  subtitle: 'FASE 3 · PEMULIHAN & KEWASPADAAN SUSULAN',
  summary: 'Keluar dengan tertib, tetap waspada terhadap gempa susulan, dan ikuti arahan petugas.',
  icon: House,
  points: [
   {
    id: 'setelah-1',
    shortTitle: 'Evakuasi Tertib ke Titik Kumpul',
    title: 'Setelah Guncangan Berhenti: Evakuasi Tenang & Tertib',
    desc: 'Setelah guncangan berhenti, ikuti jalur aman menuju titik kumpul bersama guru atau keluarga.',
    badge: 'Evakuasi Teratur Pasca Gempa',
    image: '/mitigasi-setelah-1.jpg',
    caption: 'Melangkah tenang melalui tangga darurat tanpa panik menuju titik kumpul lapangan terbuka bersama rombongan.',
    tips: [
     'Periksa diri sendiri dan teman sekitar apakah mengalami luka fisik',
     'Keluar perlahan lewat tangga darurat; jangan saling mendorong di pintu',
     'Berkumpul di titik kumpul dan lakukan absensi untuk memastikan semua orang selamat'
    ],
    keyRules: [
     { label: 'Etika Evakuasi', text: 'Dilarang panik, dilarang berlari kencang, dilarang mendorong' },
     { label: 'Pemeriksaan', text: 'Laporkan bila ada rekan yang tertinggal di ruangan' }
    ]
   },
   {
    id: 'setelah-2',
    shortTitle: 'Pertolongan & Gedung Rusak',
    title: 'Laporkan Orang Terluka & Jangan Masuki Bangunan Rusak',
    desc: 'Laporkan orang yang terluka kepada orang dewasa atau petugas. Jangan masuk ke bangunan yang rusak.',
    badge: 'Penanganan Korban & Struktur Bangunan',
    image: '/mitigasi-setelah-2.jpg',
    caption: 'Memberikan pertolongan pertama pada luka ringan dan melarang siapa pun masuk gedung yang mengalami retakan parah.',
    tips: [
     'Beri pertolongan pertama menggunakan isi kotak P3K darurat',
     'Jika ada korban tertimpa berat, segera laporkan ke tim SAR / guru / petugas medis',
     'Jangan sekali-kali masuk kembali ke gedung yang retak miring untuk mengambil barang'
    ],
    keyRules: [
     { label: 'Bahaya Runtuh', text: 'Gedung retak dapat roboh sewaktu-waktu' },
     { label: 'Nomor Darurat', text: '112 (Layanan Darurat) / 115 (Basarnas)' }
    ]
   },
   {
    id: 'setelah-3',
    shortTitle: 'Waspada Gempa Susulan',
    title: 'Waspadai Gempa Susulan (Aftershocks)',
    desc: 'Waspadai gempa susulan — tetap di luar bangunan dan di area terbuka.',
    badge: 'Siaga Gempa Lanjutan',
    image: '/mitigasi-setelah-3.jpg',
    caption: 'Gempa susulan sering terjadi beberapa saat setelah gempa utama, dengan potensi merobohkan gedung yang strukturnya sudah melemah.',
    tips: [
     'Tetap bertahan di lapangan terbuka hingga situasi dinyatakan aman sepenuhnya oleh petugas',
     'Jika gempa susulan datang, segera kembali lakukan posisi Drop-Cover-Hold On',
     'Tenangkan diri, tarik napas dalam-dalam, dan saling memberi semangat kepada teman'
    ],
    keyRules: [
     { label: 'Sifat Gempa', text: 'Dapat terjadi dalam hitungan menit, jam, atau beberapa hari' },
     { label: 'Langkah Aman', text: 'Gunakan tenda darurat luar ruangan jika rumah mengalami retak' }
    ]
   },
   {
    id: 'setelah-4',
    shortTitle: 'Pantau Info Resmi BMKG',
    title: 'Pantau Informasi Resmi BMKG & Hindari Berita Hoaks',
    desc: 'Ikuti informasi resmi dari BMKG dan instruksi petugas. Jangan percaya informasi yang belum terverifikasi.',
    badge: 'Pemberitaan Resmi Terverifikasi',
    caption: 'Mengakses data akurat parameter gempa dari aplikasi InfoBMKG dan mengikuti arahan komando BPBD setempat.',
    tips: [
     'Buka aplikasi resmi InfoBMKG atau kanal media sosial resmi bercentang biru',
     'Nyalakan radio bertenaga baterai jika jaringan seluler dan listrik padam',
     'Jangan menyebarkan kabar burung, pesan berantai tanpa sumber, atau isu gempa hoaks'
    ],
    keyRules: [
     { label: 'Sumber Valid', text: 'BMKG, BPBD, BNPB, dan Pemda setempat' },
     { label: 'Sikap Bijak', text: 'Saring sebelum sharing informasi bencana' }
    ]
   }
  ]
 }
];

function MitigationDiagram({ point }: { point: MitigationPointData }) {
 if (point.id === 'saat-1') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner">
     <ShieldAlert className="miti-pulse-icon" />
     <div>
      <h4>Tiga Langkah Emas Perlindungan Diri</h4>
      <p>Lakukan segera saat merasakan bumi berguncang keras</p>
     </div>
    </div>
    <div className="miti-diagram-grid-3">
     <div className="miti-diagram-step">
      <div className="miti-step-badge">1. DROP</div>
      <div className="miti-step-illustration drop-ill">
       <div className="drop-figure">🏃 ➔ 🧎</div>
      </div>
      <h5>Merunduk ke Lantai</h5>
      <p>Rendahkan tubuh sebelum gempa merobohkan keseimbangan Anda.</p>
     </div>
     <div className="miti-diagram-step">
      <div className="miti-step-badge highlight">2. COVER</div>
      <div className="miti-step-illustration cover-ill">
       <div className="cover-figure">🛡️ 🪑</div>
      </div>
      <h5>Lindungi Kepala Bawah Meja</h5>
      <p>Masuk ke kolong meja kokoh untuk menahan runtuhan genteng & lampu.</p>
     </div>
     <div className="miti-diagram-step">
      <div className="miti-step-badge">3. HOLD ON</div>
      <div className="miti-step-illustration hold-ill">
       <div className="hold-figure">✊ 🪵</div>
      </div>
      <h5>Pegang Kaki Meja Erat</h5>
      <p>Pegang erat kaki meja agar meja tetap menaungi tubuh saat bergetar.</p>
     </div>
    </div>
   </div>
  );
 }

 if (point.id === 'saat-2') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner warning-banner">
     <AlertOctagon className="miti-pulse-icon text-red" />
     <div>
      <h4>Dua Area Bahaya Tinggi di Dalam Gedung</h4>
      <p>Kaca pecah dan elevator macet adalah penyebab utama korban luka</p>
     </div>
    </div>
    <div className="miti-danger-split">
     <div className="miti-danger-card red-border">
      <div className="miti-danger-header">
       <span className="miti-danger-badge">BAHAYA PECAHAN KACA</span>
      </div>
      <div className="miti-danger-graphic glass-hazard">
       <div className="hazard-symbol">🪟 💥 ⚠️</div>
       <div className="hazard-distance">Zona Bahaya: Radius 2–3 Meter</div>
      </div>
      <ul>
       <li>Kaca jendela dapat meledak pecah ke dalam ruangan saat dinding berguncang.</li>
       <li>Serpihan kaca tajam dapat melukai wajah, leher, dan mata.</li>
       <li>Menjauhlah ke sudut ruangan atau di bawah meja yang jauh dari jendela.</li>
      </ul>
     </div>
     <div className="miti-danger-card yellow-border">
      <div className="miti-danger-header">
       <span className="miti-danger-badge warning">DILARANG PAKAI LIFT</span>
      </div>
      <div className="miti-danger-graphic lift-hazard">
       <div className="hazard-symbol">🛗 ❌ ➔ 🪜 ✔️</div>
       <div className="hazard-distance">Gunakan Selalu Tangga Darurat</div>
      </div>
      <ul>
       <li>Sensor otomatis atau korsleting listrik akan mematikan daya elevator seketika.</li>
       <li>Risiko terjebak berjam-jam di dalam kotak lift antara dua lantai.</li>
       <li>Kabel penahan lift berisiko keluar dari rel lintasan akibat getaran.</li>
      </ul>
     </div>
    </div>
   </div>
  );
 }

 if (point.id === 'saat-3') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner">
     <Building className="miti-pulse-icon" />
     <div>
      <h4>Panduan Zonasi Aman Luar Ruangan</h4>
      <p>Menjauh dari jangkauan jatuhan material gedung dan jaringan listrik</p>
     </div>
    </div>
    <div className="miti-outdoor-zones">
     <div className="zone-diagram">
      <div className="zone-building">
       <span>GEDUNG TINGGI</span>
       <div className="fall-radius-marker">⚠️ Zona Bahaya Fasad & Genteng Jatuh</div>
      </div>
      <div className="zone-safe">
       <span className="safe-badge">ZONA AMAN TERBUKA</span>
       <p>Lapangan Hijau / Halaman Parkir Lapang</p>
       <small>Jarak aman: minimal sama dengan tinggi bangunan tertinggi terdekat</small>
      </div>
      <div className="zone-pole">
       <span>TIANG LISTRIK</span>
       <div className="fall-radius-marker">⚡ Bahaya Kabel Putus</div>
      </div>
     </div>
    </div>
   </div>
  );
 }

 if (point.id === 'saat-4') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner">
     <Waves className="miti-pulse-icon text-cyan" />
     <div>
      <h4>Formula Penyelamatan Tsunami: 20 · 20 · 20</h4>
      <p>Pedoman resmi keselamatan di kawasan pesisir pantai</p>
     </div>
    </div>
    <div className="miti-tsunami-scale">
     <div className="tsunami-step-box">
      <div className="tsunami-num">20</div>
      <div className="tsunami-unit">DETIK</div>
      <p>Jika guncangan gempa terasa kuat lebih dari 20 detik atau sulit berdiri.</p>
     </div>
     <div className="tsunami-arrow">➔</div>
     <div className="tsunami-step-box">
      <div className="tsunami-num">20</div>
      <div className="tsunami-unit">MENIT</div>
      <p>Waktu evakuasi sebelum gelombang pertama tiba; jangan tunggu air laut surut.</p>
     </div>
     <div className="tsunami-arrow">➔</div>
     <div className="tsunami-step-box highlight-box">
      <div className="tsunami-num">20</div>
      <div className="tsunami-unit">METER</div>
      <p>Lari menuju perbukitan atau gedung tinggi vertikal dengan ketinggian minimal 20 meter.</p>
     </div>
    </div>
   </div>
  );
 }

 if (point.id === 'setelah-1') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner">
     <Users className="miti-pulse-icon" />
     <div>
      <h4>Alur Evakuasi Teratur Pasca Gempa</h4>
      <p>Bergerak tenang mengikuti tanda panah hijau menuju titik kumpul sekolah</p>
     </div>
    </div>
    <div className="miti-evac-flow">
     <div className="evac-node">
      <div className="evac-icon">🏫</div>
      <h6>1. Ruang Kelas</h6>
      <small>Tunggu getaran reda total</small>
     </div>
     <div className="evac-conn">➔</div>
     <div className="evac-node">
      <div className="evac-icon">🪜</div>
      <h6>2. Tangga Darurat</h6>
      <small>Jalan cepat, jangan dorong</small>
     </div>
     <div className="evac-conn">➔</div>
     <div className="evac-node">
      <div className="evac-icon">🟢</div>
      <h6>3. Koridor Rute</h6>
      <small>Ikuti panah lantai hijau</small>
     </div>
     <div className="evac-conn">➔</div>
     <div className="evac-node highlight-node">
      <div className="evac-icon">⛳</div>
      <h6>4. Titik Kumpul</h6>
      <small>Absensi & pengecekan tim</small>
     </div>
    </div>
   </div>
  );
 }

 if (point.id === 'setelah-2') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner">
     <AlertTriangle className="miti-pulse-icon text-amber" />
     <div>
      <h4>Pemeriksaan Korban & Bahaya Gedung Retak</h4>
      <p>Dua prioritas utama sesaat setelah mencapai area aman</p>
     </div>
    </div>
    <div className="miti-post-split">
     <div className="miti-post-card green-tint">
      <h5>🏥 Pertolongan Pertama (P3K)</h5>
      <ul>
       <li>Beri obat luka luar pada lecet atau memar ringan dari isi tas siaga.</li>
       <li>Tenangkan teman yang shock atau panik berlebihan.</li>
       <li>Jika ada korban pingsan atau cedera tulang, jangan dipindahkan sembarangan; segera panggil petugas medis / SAR.</li>
      </ul>
     </div>
     <div className="miti-post-card red-tint">
      <h5>🚫 Dilarang Masuk Gedung Rusak</h5>
      <ul>
       <li>Gedung yang terlihat retak miring berpotensi runtuh sewaktu-waktu.</li>
       <li>Jangan pernah kembali masuk ke dalam gedung untuk mengambil tas atau barang berharga.</li>
       <li>Tunggu pemeriksaan kelayakan struktur oleh insinyur sipil / tim BPBD.</li>
      </ul>
     </div>
    </div>
   </div>
  );
 }

 if (point.id === 'setelah-3') {
  return (
   <div className="miti-diagram-wrap">
    <div className="miti-diagram-banner">
     <Activity className="miti-pulse-icon" />
     <div>
      <h4>Siklus Gempa Susulan (Aftershocks)</h4>
      <p>Memahami mengapa harus tetap bertahan di area luar ruangan</p>
     </div>
    </div>
    <div className="miti-aftershock-graph">
     <div className="seismo-chart">
      <div className="seismo-wave main-wave">
       <span className="wave-tag">Gempa Utama (Besar)</span>
       <div className="wave-bars">
        <span style={{height:'35px'}}/><span style={{height:'75px'}}/><span style={{height:'120px'}}/><span style={{height:'95px'}}/><span style={{height:'40px'}}/>
       </div>
      </div>
      <div className="seismo-divider"/>
      <div className="seismo-wave after-wave">
       <span className="wave-tag">Gempa Susulan 1</span>
       <div className="wave-bars">
        <span style={{height:'25px'}}/><span style={{height:'45px'}}/><span style={{height:'65px'}}/><span style={{height:'35px'}}/>
       </div>
      </div>
      <div className="seismo-wave after-wave">
       <span className="wave-tag">Gempa Susulan 2...</span>
       <div className="wave-bars">
        <span style={{height:'18px'}}/><span style={{height:'32px'}}/><span style={{height:'25px'}}/>
       </div>
      </div>
     </div>
     <div className="seismo-note">
      ⚠️ <strong>Penting:</strong> Bangunan yang sudah mengalami retak struktur akibat gempa utama dapat langsung roboh meskipun gempa susulan berkekuatan lebih kecil. Tetaplah berada di luar ruangan!
     </div>
    </div>
   </div>
  );
 }

 return (
  <div className="miti-diagram-wrap">
   <div className="miti-diagram-banner">
    <Radio className="miti-pulse-icon" />
    <div>
     <h4>Pusat Informasi Valid & Saluran Darurat</h4>
     <p>Hanya percayai sumber data resmi dan abaikan kabar burung hoaks</p>
    </div>
   </div>
   <div className="miti-info-hub">
    <div className="info-hub-col">
     <h6>Kanal Resmi Terverifikasi</h6>
     <div className="hub-badge-item">
      <span>📱 Aplikasi Resmi InfoBMKG</span>
      <small>Data magnitudo, pusat gempa, dan peringatan dini tsunami</small>
     </div>
     <div className="hub-badge-item">
      <span>📻 Radio Darurat Siaga (RRI)</span>
      <small>Tetap dapat mengudara meski internet dan listrik daerah padam</small>
     </div>
     <div className="hub-badge-item">
      <span>🏢 Komando BPBD & BNPB</span>
      <small>Panduan resmi posko evakuasi dan pembagian bantuan logistik</small>
     </div>
    </div>
    <div className="info-hub-col">
     <h6>Panggilan Darurat Bebas Pulsa</h6>
     <div className="hub-call-badge">
      <div className="call-num">112</div>
      <div className="call-desc">Panggilan Darurat Terpadu Seluruh Indonesia</div>
     </div>
     <div className="hub-call-badge">
      <div className="call-num">115</div>
      <div className="call-desc">BASARNAS (Pencarian & Pertolongan Korban)</div>
     </div>
     <div className="hub-anti-hoax">
      🛡️ Jangan menyebarkan ramalan gempa hoaks di WhatsApp atau media sosial!
     </div>
    </div>
   </div>
  </div>
 );
}

function MitigationVisualizer({
 phase,
 point,
 pointIndex,
 totalPoints,
 onSelectPoint
}: {
 phase: MitigationPhaseData;
 point: MitigationPointData;
 pointIndex: number;
 totalPoints: number;
 onSelectPoint: (idx: number) => void;
}) {
 const [isZoomed, setIsZoomed] = useState(false);

 useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
   if (e.key === 'Escape') setIsZoomed(false);
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
 }, []);

 return (
  <>
   {isZoomed && point.image && (
    <div className="miti-zoom-backdrop" onClick={() => setIsZoomed(false)}>
     <div className="miti-zoom-content" onClick={e => e.stopPropagation()}>
      <img src={point.image} alt={point.title} className="miti-zoom-img" />
      <div className="miti-zoom-info">
       <h3>{point.title}</h3>
       <p>{point.caption}</p>
       <button onClick={() => setIsZoomed(false)} className="miti-zoom-close" aria-label="Tutup pratinjau">×</button>
      </div>
     </div>
    </div>
   )}

   <section className="geo-map-section miti-visual-section" aria-label="Visualisasi Langkah Mitigasi">
    <div className="geo-map-head miti-visual-head">
     <div>
      <span className="geo-kicker">VISUALISASI MITIGASI · LANGKAH {pointIndex + 1} DARI {totalPoints}</span>
      <h2>{point.shortTitle}</h2>
     </div>
     <div className="miti-head-actions">
      <div className="miti-step-controls">
       <Button
        variant="ghost"
        disabled={pointIndex === 0}
        onClick={() => onSelectPoint(pointIndex - 1)}
        aria-label="Langkah sebelumnya"
        className="miti-nav-btn"
       >
        <ChevronLeft />
       </Button>
       <span className="miti-step-pill">{pointIndex + 1} / {totalPoints}</span>
       <Button
        variant="ghost"
        disabled={pointIndex === totalPoints - 1}
        onClick={() => onSelectPoint(pointIndex + 1)}
        aria-label="Langkah berikutnya"
        className="miti-nav-btn"
       >
        <ChevronRight />
       </Button>
      </div>
      {point.image && (
       <Button
        variant="ghost"
        onClick={() => setIsZoomed(true)}
        aria-label="Perbesar gambar"
        className="miti-expand-btn"
        title="Perbesar gambar visualisasi"
       >
        <Expand />
       </Button>
      )}
     </div>
    </div>

    <div className="miti-visual-display">
     {point.image ? (
      <div className="miti-img-frame" onClick={() => setIsZoomed(true)} title="Klik untuk memperbesar gambar">
       <img src={point.image} alt={point.title} className="miti-img-display" />
       <div className="miti-img-tag">{point.badge}</div>
       <div className="miti-img-caption-overlay">
        <span>{point.caption}</span>
        <span className="miti-zoom-hint">🔍 Klik gambar untuk memperbesar</span>
       </div>
      </div>
     ) : (
      <MitigationDiagram point={point} />
     )}
    </div>

    <div className="miti-visual-footer">
     <div className="miti-tips-wrapper">
      <div className="miti-tips-title">
       <CheckCircle2 className="miti-check-icon" />
       <span>Tindakan Kunci & Panduan Praktis:</span>
      </div>
      <div className="miti-tips-chips">
       {point.tips.map((tip, i) => (
        <div key={i} className="miti-tip-chip">
         <span className="miti-chip-dot">•</span>
         <span>{tip}</span>
        </div>
       ))}
      </div>
      <div className="miti-rules-row">
       {point.keyRules.map((kr, i) => (
        <div key={i} className="miti-rule-pill">
         <strong>{kr.label}:</strong> {kr.text}
        </div>
       ))}
      </div>
     </div>
    </div>
   </section>
  </>
 );
}

function Mitigation() {
 const [slide, setSlide] = useState(0);
 const [activePoint, setActivePoint] = useState(0);
 const titles = ['Sebelum Gempa', 'Saat Gempa', 'Setelah Gempa'];

 const currentPhase = mitigationPhases[slide];
 const currentPoint = currentPhase.points[activePoint] || currentPhase.points[0];

 const handleSelectSlide = (i: number) => {
  setSlide(i);
  setActivePoint(0);
 };

 return (
  <section
   className={'learning-deck mitigation-deck miti-theme-' + slide}
   aria-label="Slide Mitigasi Gempa Bumi"
   onKeyDown={e => {
    if (e.key === 'ArrowRight') {
     e.preventDefault();
     if (activePoint < currentPhase.points.length - 1) {
      setActivePoint(p => p + 1);
     } else if (slide < 2) {
      handleSelectSlide(slide + 1);
     }
    }
    if (e.key === 'ArrowLeft') {
     e.preventDefault();
     if (activePoint > 0) {
      setActivePoint(p => p - 1);
     } else if (slide > 0) {
      handleSelectSlide(slide - 1);
      setActivePoint(mitigationPhases[slide - 1].points.length - 1);
     }
    }
   }}
  >
   <div className="slide-top">
    <Link href="/" aria-label="Kembali ke Beranda"><House /></Link>
   </div>
   <h1>Mitigasi Gempa Bumi</h1>

   <div className="slide-body has-map miti-body">
    <article className="slide-glass miti-glass">
     <div className="miti-phase-header">
      <div className="miti-phase-badge">{currentPhase.subtitle}</div>
      <h2>{currentPhase.title}</h2>
      <p className="miti-phase-summary">{currentPhase.summary}</p>
     </div>

     <div className="miti-list-label">
      <span>PILIH LANGKAH UNTUK MELIHAT VISUALISASI:</span>
     </div>

     <div className="miti-points-list">
      {currentPhase.points.map((pt, idx) => {
       const isActive = activePoint === idx;
       return (
        <button
         key={pt.id}
         type="button"
         className={'miti-point-card ' + (isActive ? 'is-active' : '')}
         onClick={() => setActivePoint(idx)}
         aria-pressed={isActive}
        >
         <div className="miti-card-num">{idx + 1}</div>
         <div className="miti-card-body">
          <div className="miti-card-title-row">
           <h4>{pt.shortTitle}</h4>
          </div>
          <p className="miti-card-desc">{pt.desc}</p>
         </div>
        </button>
       );
      })}
     </div>

     <p className="miti-source">
      Panduan diringkas dari{' '}
      <a href="https://www.bmkg.go.id/gempabumi/mitigasi/antisipasi-gempabumi" target="_blank" rel="noreferrer">
       BMKG: Antisipasi Gempa Bumi
      </a>.
     </p>
    </article>

    <MitigationVisualizer
     key={slide + '-' + activePoint}
     phase={currentPhase}
     point={currentPoint}
     pointIndex={activePoint}
     totalPoints={currentPhase.points.length}
     onSelectPoint={setActivePoint}
    />
   </div>

   <nav className="slide-navigation" aria-label="Navigasi fase mitigasi" style={{ justifyContent: 'center' }}>
    <div className="slide-selectors">
     {titles.map((title, i) => (
      <button
       key={title}
       onClick={() => handleSelectSlide(i)}
       aria-label={`Fase ${i + 1}: ${title}`}
       aria-current={slide === i ? 'step' : undefined}
      >
       {i + 1}
      </button>
     ))}
    </div>
   </nav>
  </section>
 );
}

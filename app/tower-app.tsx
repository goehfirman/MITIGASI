"use client";
import {useEffect,useState} from 'react';
import Link from 'next/link';
import Scene, { type Target } from './tower-scene';
import {Button} from '@/components/ui/button';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {Tabs,TabsList,TabsTrigger} from '@/components/ui/tabs';
import {Switch} from '@/components/ui/switch';
import {Select,SelectTrigger,SelectValue,SelectContent,SelectItem} from '@/components/ui/select';
import {Box,Rotate3D,Plus,Link2,Move,Trash2,Undo2,Redo2,Ruler,Play,Maximize,Users,BookOpen,History,Triangle,Square,ZoomIn,ZoomOut,GraduationCap,Download,Check,ArrowRight,Layers,Lightbulb,RotateCcw,House,X} from 'lucide-react';
import {preset,height,validDesign,type Design,type Result} from '@/lib/tower';
type Session={token:string,role:string,code?:string,name:string,challenge?:string,strength?:string};
const tools=[['orbit','Putar',Rotate3D],['add','Titik',Plus],['connect','Sambung',Link2],['move','Geser',Move],['delete','Hapus',Trash2]] as const;
const help:Record<string,string>={orbit:'Geser satu jari untuk memutar. Cubit dua jari untuk memperbesar.',add:'Ketuk petak untuk menambah titik. Lingkaran merah samar menandai posisi titik di bawah.',connect:'Ketuk dua marshmallow untuk menyambungkan tusuk gigi.',move:'Seret marshmallow pada bidang tingkat yang sama.',delete:'Ketuk marshmallow untuk menghapusnya beserta sambungannya.'};
export async function api(action:string,data:any={}){const r=await fetch('/api/lab',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,...data})});const v:any=await r.json();if(!r.ok)throw new Error(v.error||'Belum dapat terhubung. Coba lagi.');return v;}
function Choice({value,onChange,values,label}:any){return <Select value={value} onValueChange={onChange}><SelectTrigger aria-label={label}><SelectValue/></SelectTrigger><SelectContent>{values.map((v:string)=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select>}
export default function TowerApp(){
 const [fullscreen, setFullscreen] = useState(false);
 useEffect(() => {
  const handleFullscreenChange = () => setFullscreen(!!document.fullscreenElement);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
 }, []);
 const [design,setDesign]=useState<Design>(()=>({nodes:[],beams:[]})),[past,setPast]=useState<Design[]>([]),[future,setFuture]=useState<Design[]>([]),[tool,setTool]=useState('add'),[selected,setSelected]=useState<number|null>(null),[selectedTarget,setSelectedTarget]=useState<Target|null>(null),[level,setLevel]=useState(0),[view,setView]=useState('3/4'),[zoom,setZoom]=useState(1),[low,setLow]=useState(false),[wire,setWire]=useState(false),[mode,setMode]=useState('Bebas'),[strength,setStrength]=useState('Ringan'),[direction,setDirection]=useState('X-Y'),[run,setRun]=useState(0),[time,setTime]=useState(0),[result,setResult]=useState<Result|null>(null),[history,setHistory]=useState<Result[]>([]),[panel,setPanel]=useState(''),[message,setMessage]=useState('Mulai dari idemu sendiri. Ketuk petak untuk menambahkan marshmallow, lalu sambungkan titik-titiknya.'),[name,setName]=useState('Kelompok 1'),[session,setSession]=useState<Session|null>(null),[busy,setBusy]=useState(false),[reflection,setReflection]=useState(''),[className,setClassName]=useState('Kelas 6 — Eksperimen Gempa'),[code,setCode]=useState(''),[students,setStudents]=useState<any[]>([]),[classResults,setClassResults]=useState<Result[]>([]),[saved,setSaved]=useState(false);
 useEffect(()=>{try{const s=sessionStorage.getItem('tower-session');if(s){const v=JSON.parse(s);setSession(v);setName(v.name);api('history',{token:v.token}).then(x=>setHistory(x.results)).catch(e=>setMessage(e.message));}}catch{}},[]);
 useEffect(()=>{if(panel!=='guru'||session?.role!=='teacher')return;const refresh=()=>api('dashboard',{token:session.token}).then(x=>{setStudents(x.students);setClassResults(x.results);}).catch(e=>setMessage(e.message));refresh();const t=setInterval(refresh,5000);return()=>clearInterval(t);},[panel,session]);
 function edit(next:Design){if(run&&!result)return;if(!validDesign(next)){setMessage('Batas area: 80 marshmallow, 240 tusuk gigi, dan tinggi 48 cm.');return;}setRun(0);setPast(p=>[...p.slice(-29),design]);setFuture([]);setDesign(next);setSelected(null);setSelectedTarget(null);setResult(null);setSaved(false);}
 function node(id:number){if(tool==='delete'){edit({nodes:design.nodes.filter(n=>n.id!==id),beams:design.beams.filter(b=>b.a!==id&&b.b!==id)});return;}if(tool==='connect'){if(selected===null){setSelected(id);setMessage('Sekarang ketuk marshmallow kedua.');}else if(selected!==id){const exists=design.beams.some(b=>(b.a===id&&b.b===selected)||(b.b===id&&b.a===selected));if(!exists)edit({...design,beams:[...design.beams,{a:selected,b:id}]});setSelected(null);setMessage(exists?'Dua titik ini sudah tersambung.':'Tusuk gigi tersambung.');}}}
 function place(x:number,y:number,z:number,id?:number){if(Math.abs(x)>4||Math.abs(z)>4){setMessage('Tempatkan titik di dalam meja.');return;}if(design.nodes.some(n=>n.id!==id&&n.x===x&&n.y===y&&n.z===z)){setMessage('Sudah ada marshmallow di titik itu.');return;}edit({...design,nodes:id===undefined?[...design.nodes,{id:Math.max(-1,...design.nodes.map(n=>n.id))+1,x,y,z}]:design.nodes.map(n=>n.id===id?{...n,x,y,z}:n)});}
 async function ensureSession(){if(session)return session;const s=await api('start',{name:name.trim()||'Kelompok 1'});setSession(s);sessionStorage.setItem('tower-session',JSON.stringify(s));return s;}
 async function save(r:Result){setBusy(true);try{const s=await ensureSession();await api('save',{token:s.token,result:r});setSaved(true);setMessage('Percobaan tersimpan.');}catch(e:any){setMessage(e.message+' Hasil masih tersedia di layar; tekan Simpan lagi.');}finally{setBusy(false);}}
 function done(duration:number,standing:boolean){const r:Result={id:crypto.randomUUID(),name,height:height(design),strength,direction,duration:Math.round(duration*10)/10,score:Math.round(duration*10),standing,date:new Date().toISOString(),design};setResult(r);setHistory(h=>[r,...h]);setTime(10);setReflection('');save(r);}
 function start(){if(design.nodes.length<4||!design.nodes.some(n=>n.y>0)||design.beams.length<3){setMessage('Buat menara dengan titik di atas dasar dan minimal 3 sambungan.');return;}setSelected(null);setResult(null);setSaved(false);setTime(0);setRun(Date.now());setMessage('Amati gerakan menara selama 10 detik.');}
 async function enter(action:string){setBusy(true);try{const s=await api(action,{name:name.trim(),code:code.toUpperCase().trim(),className,challenge:mode,strength});setSession(s);sessionStorage.setItem('tower-session',JSON.stringify(s));setHistory([]);setName(s.name);if(s.challenge)setMode(s.challenge);if(s.strength)setStrength(s.strength);setMessage(action==='create'?'Kelas berhasil dibuat.':'Berhasil bergabung ke kelas.');if(action==='join')setPanel('');}catch(e:any){setMessage(e.message);}finally{setBusy(false);}}
 function csv(rows:Result[]){const esc=(v:any)=>'"'+String(v??'').replace(/^[=+@-]/,"'").replaceAll('"','""')+'"';const text='\uFEFF'+[['Nama','Tanggal','Tinggi (cm)','Gempa','Arah','Bertahan (detik)','Skor','Hasil','Refleksi'],...rows.map(r=>[r.name,r.date,r.height,r.strength,r.direction,r.duration,r.score,r.standing?'Berdiri':'Roboh',r.reflection||''])].map(row=>row.map(esc).join(',')).join('\r\n');const u=URL.createObjectURL(new Blob([text],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='hasil-toothpick-tower.csv';a.click();URL.revokeObjectURL(u);}
  return <main className="lab">
  {/* Top Navigation Bar */}
  <header className="lab-top-nav">
    <Button asChild variant="ghost" className="lab-icon-btn">
      <Link href="/"><House size={20} aria-label="Kembali ke Beranda"/></Link>
    </Button>
    <div className="lab-title-area">
      <img src="/stem-logo.png" alt="STEM" className="lab-stem-logo" />
      <h2>Lab Maya Struktur Anti Gempa</h2>
    </div>
    <div className="lab-top-right">
      <Button 
        variant="ghost" 
        className="lab-icon-btn" 
        onClick={async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{setMessage('Gunakan pintasan browser.');}}} 
        aria-label={fullscreen?'Keluar layar penuh':'Layar penuh'}
      >
        <Maximize size={20}/>
      </Button>
    </div>
  </header>

  {/* Open 3D Structure Stage (NO BOX) */}
  <div className="lab-stage">
    <Scene design={design} tool={tool} level={level} selected={selected} selectedBeam={selectedTarget?.type==='beam'?selectedTarget.index:null} low={low} wire={wire} view={view} zoom={zoom} run={run} strength={strength} direction={direction} onNode={node} onPlace={place} onProgress={setTime} onDone={done} onSelectTarget={setSelectedTarget}/>
    
    {/* Floating Action Popup when clicking Marshmallow or Toothpick */}
    {selectedTarget && !run && (
      <div 
        className="target-action-popup" 
        style={{
          left: Math.max(130, Math.min(typeof window !== 'undefined' ? window.innerWidth - 130 : 800, selectedTarget.screenX)),
          top: Math.max(75, selectedTarget.screenY)
        }}
      >
        <div className="popup-badge">
          {selectedTarget.type === 'node' ? '🍡 Marshmallow' : '🥢 Tusuk Gigi'}
        </div>
        
        {selectedTarget.type === 'node' && (
          <>
            <button 
              type="button" 
              className="popup-action-btn"
              onClick={() => {
                setTool('connect');
                setSelected(selectedTarget.id);
                setSelectedTarget(null);
                setMessage('Titik pertama dipilih. Ketuk marshmallow kedua untuk menyambung.');
              }}
            >
              <Link2 size={15}/> Sambung
            </button>
            <button 
              type="button" 
              className="popup-action-btn"
              onClick={() => {
                setTool('move');
                setSelected(selectedTarget.id);
                setSelectedTarget(null);
                setMessage('Mode Geser aktif. Tarik marshmallow ini ke posisi baru.');
              }}
            >
              <Move size={15}/> Geser
            </button>
            <button 
              type="button" 
              className="popup-action-btn delete"
              onClick={() => {
                edit({
                  nodes: design.nodes.filter(n => n.id !== selectedTarget.id),
                  beams: design.beams.filter(b => b.a !== selectedTarget.id && b.b !== selectedTarget.id)
                });
                setSelectedTarget(null);
                setSelected(null);
                setMessage('Marshmallow dan sambungannya berhasil dihapus.');
              }}
            >
              <Trash2 size={15}/> Hapus
            </button>
          </>
        )}

        {selectedTarget.type === 'beam' && (
          <button 
            type="button" 
            className="popup-action-btn delete"
            onClick={() => {
              edit({
                ...design,
                beams: design.beams.filter((_, i) => i !== selectedTarget.index)
              });
              setSelectedTarget(null);
              setMessage('Tusuk gigi berhasil dihapus.');
            }}
          >
            <Trash2 size={15}/> Hapus
          </button>
        )}

        <button 
          type="button" 
          className="popup-close-btn"
          onClick={() => {
            setSelectedTarget(null);
            setSelected(null);
          }}
          title="Tutup menu"
        >
          <X size={15}/>
        </button>
      </div>
    )}
    
    {/* Floating HUD Top: Stats & Camera/Options */}
    <div className="stage-hud-top">
      <div className="hud-group">
        <div className="hud-pill">
          <Ruler size={16} style={{color:'#f59e0b'}}/>
          <span>Tinggi: <strong>{height(design)} cm</strong></span>
        </div>
        <div className="hud-pill">
          <span className="material-dot wood"/>
          <span>Tusuk gigi: <strong>{design.beams.length}</strong>/240</span>
        </div>
        <div className="hud-pill">
          <span className="material-dot"/>
          <span>Marshmallow: <strong>{design.nodes.length}</strong>/80</span>
        </div>
      </div>

      <div className="hud-group">
        <div className="hud-camera-pills">
          {(['3/4','Depan','Atas'] as const).map(v => (
            <button 
              key={v} 
              type="button"
              className={`hud-cam-btn ${view===v?'active':''}`} 
              onClick={()=>setView(v)}
            >
              {v}
            </button>
          ))}
          <div className="hud-divider"/>
          <button 
            type="button"
            className="hud-cam-btn" 
            onClick={()=>setZoom(Math.max(.6,zoom-.2))} 
            title="Perkecil"
          >
            <ZoomOut size={14}/>
          </button>
          <button 
            type="button"
            className="hud-cam-btn" 
            onClick={()=>setZoom(Math.min(2.5,zoom+.2))} 
            title="Perbesar"
          >
            <ZoomIn size={14}/>
          </button>
        </div>


      </div>
    </div>

    {/* Center Result Overlay when simulation finishes */}
    {result && (
      <div className={`result-overlay ${result.standing?'success':'retry'}`}>
        <div className="result-icon">{result.standing ? '🎉' : '💥'}</div>
        <div className="result-header">
          <h3>{result.standing ? 'Menara Bertahan!' : 'Coba Perkuat Lagi'}</h3>
        </div>
        <div className="result-stats">
          <div className="result-stat-box">
            <span className="result-stat-val">{result.score}</span>
            <span className="result-stat-lbl">Skor / 100</span>
          </div>
          <div className="result-stat-box">
            <span className="result-stat-val">{result.duration}s</span>
            <span className="result-stat-lbl">Bertahan</span>
          </div>
          <div className="result-stat-box">
            <span className="result-stat-val">{height(design)}cm</span>
            <span className="result-stat-lbl">Tinggi</span>
          </div>
        </div>
        {mode==='Tantangan' && (
          <p className="result-challenge-msg">
            {result.standing && result.height>=18 && design.beams.length<=50
              ? '🎯 Misi berhasil! Menara tinggi dan tangguh.'
              : '⚠️ Misi belum tercapai. Target: tinggi ≥18 cm, tusuk gigi ≤50.'}
          </p>
        )}
        <div className="result-actions">
          <button 
            type="button"
            className="result-btn-reset" 
            onClick={()=>{setRun(0);setResult(null);setMessage('Desain dipulihkan. Perbaiki sebelum menguji lagi.');}}
          >
            <RotateCcw size={16}/> Perbaiki Desain
          </button>
          <Button 
            variant="outline" 
            className="result-btn-reflect" 
            onClick={()=>setPanel('refleksi')}
          >
            Tulis Refleksi
          </Button>
        </div>
      </div>
    )}

    {/* Floating Hint right above bottom toolbar */}
    <div className="stage-hint">
      <Lightbulb size={15} style={{color:'#facc15'}}/>
      <span>{run && !result ? 'Gempa sedang berlangsung... Amati kestabilan rangka menara!' : help[tool]}</span>
    </div>
  </div>

  {/* Simplified Bottom Toolbar */}
  <footer className="lab-toolbar">
    {/* Section: Alat Bangun (5 tools) */}
    <div className="tb-section tb-tools">
      {tools.map(([id, label, Icon]) => (
        <button
          key={id}
          type="button"
          disabled={!!run}
          className={`tb-tool-btn ${tool===id?'active':''}`}
          onClick={()=>{setTool(id);setSelected(null);}}
          title={label}
        >
          <Icon size={18}/>
          <span>{label}</span>
        </button>
      ))}
    </div>

    <div className="tb-divider"/>

    {/* Section 3: Tingkat & Edit */}
    <div className="tb-section tb-level-edit">
      <div className="tb-level-control">
        <button 
          type="button" 
          aria-label="Turunkan tingkat" 
          disabled={level===0||!!run} 
          className="tb-btn-icon" 
          onClick={()=>setLevel(level-1)}
        >
          −
        </button>
        <div className="tb-level-info">
          <span className="tb-level-num">Tk {level}</span>
          <span className="tb-level-cm">{level*6}cm</span>
        </div>
        <button 
          type="button" 
          aria-label="Naikkan tingkat" 
          disabled={level===8||!!run} 
          className="tb-btn-icon" 
          onClick={()=>setLevel(level+1)}
        >
          +
        </button>
      </div>

      <div className="tb-edit-actions">
        <button 
          type="button" 
          aria-label="Urungkan" 
          disabled={!past.length||!!run} 
          className="tb-btn-icon" 
          onClick={()=>{setFuture([design,...future]);setDesign(past[past.length-1]);setPast(past.slice(0,-1));setSelected(null);setResult(null);}}
          title="Urungkan (Undo)"
        >
          <Undo2 size={16}/>
        </button>
        <button 
          type="button" 
          aria-label="Ulangi" 
          disabled={!future.length||!!run} 
          className="tb-btn-icon" 
          onClick={()=>{setPast([...past,design]);setDesign(future[0]);setFuture(future.slice(1));setSelected(null);setResult(null);}}
          title="Ulangi (Redo)"
        >
          <Redo2 size={16}/>
        </button>
        <button 
          type="button" 
          disabled={!!run} 
          className="tb-btn-icon tb-clear-btn" 
          onClick={()=>edit({nodes:[],beams:[]})}
          title="Kosongkan Meja"
        >
          <RotateCcw size={16}/>
        </button>
      </div>
    </div>

    <div className="tb-divider"/>

    {/* Section 4: Pengaturan Gempa */}
    <div className="tb-section tb-quake">
      <div className="tb-quake-sub">
        <span className="tb-label">Kekuatan:</span>
        <div className="tb-pill-group">
          {['Ringan','Sedang','Kuat'].map(s => (
            <button
              key={s}
              type="button"
              disabled={!!run}
              className={`tb-pill-btn ${strength===s?'active':''}`}
              onClick={()=>setStrength(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="tb-quake-sub">
        <span className="tb-label">Arah:</span>
        <div className="tb-pill-group">
          {(run?[direction]:['X','X-Y']).map(d => (
            <button
              key={d}
              type="button"
              disabled={!!run}
              className={`tb-pill-btn ${direction===d?'active':''}`}
              onClick={()=>setDirection(d)}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="tb-divider"/>

    {/* Section 5: Tombol Simulasi Utama */}
    <div className="tb-section tb-simulate-section">
      <button 
        type="button"
        className={`tb-simulate-btn ${run&&!result?'testing':result?'reset':'ready'}`}
        disabled={!!run&&!result}
        onClick={() => {
          if (result) {
            setRun(0);
            setResult(null);
            setMessage('Desain dipulihkan. Perbaiki sebelum menguji lagi.');
          } else {
            start();
          }
        }}
      >
        {result ? (
          <><RotateCcw size={17}/><span>Perbaiki Desain</span></>
        ) : run ? (
          <div className="tb-sim-progress">
            <span className="tb-sim-pulse" />
            <span>Menguji ({Math.min(10, time).toFixed(1)}s)</span>
          </div>
        ) : (
          <><Play size={17} fill="currentColor"/><span>Simulasikan Gempa</span></>
        )}
      </button>
    </div>
  </footer>
 <Dialog open={!!panel} onOpenChange={o=>{if(!o)setPanel('')}}><DialogContent className="lab-dialog"><DialogTitle>{({belajar:'Belajar lewat eksperimen',riwayat:'Riwayat percobaan',guru:'Ruang guru',kelas:'Gabung kelas',refleksi:'Ceritakan penemuanmu'} as any)[panel]}</DialogTitle><DialogDescription>{panel==='guru'?'Kelola kegiatan dan hasil kelompok.':panel==='riwayat'?'Bandingkan desain pada kekuatan dan arah gempa yang sama.':'Toothpick Tower · Laboratorium STEM kelas 6'}</DialogDescription>
 {panel==='belajar'&&<div className="learning"><h3>Cara membangun di papan</h3><ol><li>Pilih menara contoh atau tekan Kosongkan.</li><li>Pilih Titik, atur tingkat, lalu ketuk petak meja.</li><li>Pilih Sambung dan ketuk dua marshmallow. Tambahkan penguat diagonal.</li><li>Pilih Putar untuk memeriksa sisi lain. Lalu uji gempa!</li></ol><div className="learning-grid"><article><strong>Sains · Titik berat</strong><p>Dasar lebar dan bagian atas yang ringan membantu menjaga titik berat tetap di atas bidang dasar.</p></article><article><strong>Rekayasa · Segitiga</strong><p>Segi empat dapat berubah bentuk. Penguat diagonal membaginya menjadi segitiga yang lebih kaku.</p></article><article><strong>Matematika · Pengukuran</strong><p>Bandingkan tinggi, jumlah bahan, dan waktu bertahan. Ubah satu hal setiap percobaan agar perbandingan adil.</p></article><article><strong>Teknologi · Model</strong><p>Ini model pembelajaran: sambungan dasar ditambatkan, batang dimodelkan sebagai penghubung jarak, dan sambungan dapat terputus. Skor = waktu bertahan ÷ 10 × 100. Roboh terdeteksi bila tinggi bagian atas turun lebih dari 40% atau penghubung putus.</p></article></div><p>Ringan, sedang, dan kuat adalah tingkat simulasi, bukan magnitudo gempa atau penilaian keamanan bangunan nyata. Saat latihan kesiapsiagaan di sekolah, ikuti arahan guru dan prosedur sekolah.</p></div>}
 {panel==='riwayat'&&<><Results rows={history} onLoad={r=>{setRun(0);edit(r.design);setPanel('');setMessage('Desain percobaan dimuat kembali.');}}/><Button disabled={!history.length} onClick={()=>csv(history)}><Download/>Unduh laporan CSV</Button></>}
 {panel==='refleksi'&&result&&<><p>Apa yang membuat desainmu bertahan atau roboh? Apa yang akan kamu ubah pada percobaan berikutnya?</p><textarea aria-label="Refleksi percobaan" maxLength={1500} value={reflection} onChange={e=>setReflection(e.target.value)} placeholder="Menurut kelompok kami…"/><Button disabled={busy||!reflection.trim()} onClick={async()=>{const r={...result,reflection};setResult(r);setHistory(h=>h.map(v=>v.id===r.id?r:v));await save(r);}}>Simpan refleksi</Button><p role="status">{message}</p></>}
 {panel==='kelas'&&<><label>Nama siswa / kelompok<input value={name} maxLength={40} onChange={e=>setName(e.target.value)}/></label><label>Kode kelas<input value={code} maxLength={8} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="Dari guru"/></label><Button disabled={busy||!name.trim()||!code.trim()} onClick={()=>enter('join')}>Gabung kelas</Button><p role="status">{message}</p></>}
 {panel==='guru'&&(session?.role==='teacher'?<><div className="class-code"><span>Kode kelas<strong>{session.code}</strong></span><p>{className}<br/>Bagikan kode ini kepada kelompok yang membuka aplikasi.</p></div><p>{students.length} kelompok bergabung · Diperbarui setiap 5 detik</p><div className="student-list">{students.length?students.map(s=><div key={s.id}><strong>{s.name}</strong><span>{s.attempts} percobaan · {s.attempts?'skor terbaik '+s.best:'belum menguji'}</span></div>):<p>Belum ada kelompok. Siswa dapat memilih Gabung kelas.</p>}</div><Results rows={classResults}/><Button disabled={!classResults.length} onClick={()=>csv(classResults)}><Download/>Unduh hasil kelas</Button><p>Simpan kode kelas dan kunci guru untuk membuka kembali dashboard.</p><textarea aria-label="Kunci guru" readOnly value={session.token}/></>:<><label>Nama kelas<input value={className} maxLength={80} onChange={e=>setClassName(e.target.value)}/></label><div className="form-row"><Choice label="Tugas kelas" value={mode} onChange={setMode} values={['Bebas','Tantangan']}/><Choice label="Kekuatan kelas" value={strength} onChange={setStrength} values={['Ringan','Sedang','Kuat']}/></div><Button disabled={busy||!className.trim()} onClick={()=>enter('create')}><Plus/>Buat sesi kelas</Button><label>Buka kembali dengan kunci guru<input value={code} onChange={e=>setCode(e.target.value)}/></label><Button disabled={busy||!code} variant="outline" onClick={async()=>{setBusy(true);try{const s=await api('restore',{token:code});setSession(s);sessionStorage.setItem('tower-session',JSON.stringify(s));}catch(e:any){setMessage(e.message);}finally{setBusy(false);}}}>Buka dashboard</Button><p role="status">{message}</p></>)}
 </DialogContent></Dialog></main>;
}
function Results({rows,onLoad}:{rows:Result[],onLoad?:(r:Result)=>void}){return rows.length?<div className="table-wrap"><table><thead><tr><th>Kelompok</th><th>Tinggi</th><th>Gempa</th><th>Bertahan</th><th>Skor</th>{onLoad&&<th>Desain</th>}</tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.name}<small>{r.standing?'Berdiri':'Roboh'}</small></td><td>{r.height} cm</td><td>{r.strength}<small>{r.direction}</small></td><td>{r.duration} dtk</td><td><b>{r.score}</b></td>{onLoad&&<td><Button variant="outline" onClick={()=>onLoad(r)}>Muat</Button></td>}</tr>)}</tbody></table></div>:<div className="empty"><History/><h3>Belum ada percobaan</h3><p>Uji menaramu untuk melihat hasil di sini.</p></div>}



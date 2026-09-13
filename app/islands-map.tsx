"use client";
import {useMemo,useState,useEffect} from 'react';
import {geoMercator,geoPath,geoCentroid} from 'd3-geo';
import {Pause,Play,ZoomIn,ZoomOut} from 'lucide-react';
import {Button} from '@/components/ui/button';
import region from '@/lib/indonesia-region.json';
import shapes from '@/lib/island-coasts.json';
const topics=[
 ['Sumatra','Barat terjal, timur landai.','Ikan, udang, tambak, mangrove, wisata bahari.','Pantai timur banyak memiliki muara dan mangrove, sedangkan pantai barat kaya potensi perikanan laut lepas.'],
 ['Jawa','Utara landai, selatan lebih terjal.','Perikanan, tambak, garam, pelabuhan, wisata pantai.','Pantai utara sangat penting untuk kegiatan ekonomi dan transportasi laut.'],
 ['Kalimantan','Landai, berlumpur, banyak mangrove.','Udang, ikan, kepiting, tambak, ekowisata mangrove.','Delta dan rawa pesisir mendukung ekosistem mangrove serta perikanan.'],
 ['Sulawesi','Sangat berlekuk dan banyak teluk.','Tuna, cakalang, rumput laut, terumbu karang, wisata selam.','Banyak teluk dan selat menciptakan habitat laut yang kaya.'],
 ['Papua','Utara lebih terjal, selatan berawa.','Perikanan, mutiara, mangrove, terumbu karang, wisata bahari.','Papua memiliki beberapa kawasan laut dengan keanekaragaman hayati sangat tinggi.'],
 ['Bali','Pantai pasir, tebing, dan pantai vulkanik.','Wisata bahari, ikan, rumput laut, terumbu karang.','Laut Bali penting untuk pariwisata, snorkeling, selam, dan budidaya laut.'],
 ['Nusa Tenggara','Berbukit dan banyak teluk kecil.','Rumput laut, mutiara, ikan, garam, wisata bahari.','Kondisi perairannya cocok untuk budidaya rumput laut dan mutiara.'],
 ['Maluku','Sangat berlekuk dan terdiri dari banyak pulau.','Tuna, cakalang, ikan karang, mutiara, wisata bahari.','Maluku memiliki sumber daya perikanan yang sangat besar.'],
 ['Bangka Belitung','Pasir putih dan batu granit.','Ikan, budidaya laut, wisata pantai.','Pantainya memiliki daya tarik wisata yang kuat karena batu granit dan air laut yang jernih.'],
 ['Kepulauan Riau','Banyak pulau kecil dan selat.','Perikanan, budidaya laut, pelabuhan, perdagangan, wisata.','Lokasinya strategis di jalur pelayaran internasional.'],
 ['Natuna & Anambas','Pulau kecil, teluk, dan pantai berbatu.','Ikan, terumbu karang, migas lepas pantai, wisata.','Kawasan ini penting secara ekonomi karena sumber daya ikan dan energi laut.'],
 ['Halmahera','Berlekuk dan banyak teluk.','Tuna, cakalang, rumput laut, terumbu karang, wisata.','Perairannya kaya ikan pelagis dan memiliki ekosistem terumbu karang yang baik.'],
];
export default function IslandsMap(){
 const [selected,setSelected]=useState<number|null>(null),[paused,setPaused]=useState(false),[zoom,setZoom]=useState(1);
 useEffect(()=>setPaused(matchMedia('(prefers-reduced-motion: reduce)').matches),[]);
 const map=useMemo(()=>{const projection=geoMercator().fitExtent([[45,48],[1155,445]],region.features.find(f=>f.properties.id==='IDN') as any);return {projection,path:geoPath(projection)};},[]);
 const info=selected===null?null:topics[selected];
 return <section className={'geo-map-section islands-map '+(paused?'is-paused':'')} aria-label="Peta interaktif garis pantai Indonesia">
 <div className="geo-map-head"><div><span className="geo-kicker">JELAJAHI PESISIR</span><h2>Pulau dan potensi laut</h2></div><div className="map-controls"><Button variant="ghost" disabled={zoom===1} aria-label="Perkecil peta" onClick={()=>setZoom(z=>z-.5)}><ZoomOut/></Button><span className="map-zoom-level">{zoom*100}%</span><Button variant="ghost" disabled={zoom===3} aria-label="Perbesar peta" onClick={()=>setZoom(z=>z+.5)}><ZoomIn/></Button><Button variant="ghost" aria-label={paused?'Putar animasi':'Jeda animasi'} onClick={()=>setPaused(!paused)}>{paused?<Play/>:<Pause/>}</Button></div></div>
 <div className="geo-map-scroll zoomable-map" tabIndex={0} aria-label="Peta pulau yang dapat digulir saat diperbesar"><div className="geo-map-inner" style={{width:`${zoom*100}%`}}><svg viewBox="0 0 1200 490" className="indonesia-map" aria-label="Pilih pulau untuk mengetahui garis pantai dan potensi laut" role="group"><defs><clipPath id="coasts-clip"><rect width="1200" height="490"/></clipPath></defs><g clipPath="url(#coasts-clip)">{region.features.filter(f=>f.properties.id!=='IDN').map(f=><path key={f.properties.id} className="map-neighbor" d={map.path(f as any)||''}/>)}{shapes.map((shape,i)=><g key={topics[i][0]} role="button" tabIndex={0} aria-label={topics[i][0]} aria-pressed={selected===i} className={'island-choice '+(selected===i?'island-selected':'')} onClick={()=>setSelected(i)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();setSelected(i);}}}><path className="island-fill" d={map.path(shape as any)||''}/><path className="island-coast" d={map.path(shape.coast as any)||''}/></g>)}{shapes.map((shape,i)=>{const p=map.projection(geoCentroid(shape as any))!;return i<5?<text key={i} x={p[0]} y={p[1]} className="island-label" textAnchor="middle" pointerEvents="none">{topics[i][0].toUpperCase()}</text>:null;})}</g></svg></div></div>
 <div className="island-picker"><label htmlFor="island-select">Pilih pulau</label><select id="island-select" value={selected??''} onChange={e=>setSelected(e.target.value===''?null:Number(e.target.value))} onKeyDown={e=>e.stopPropagation()}><option value="">Ketuk pulau pada peta</option>{topics.map((t,i)=><option key={t[0]} value={i}>{t[0]}</option>)}</select></div>
 <div className="island-info" aria-live="polite">{info?<><h3>{info[0]}</h3><dl><div><dt>Garis pantai</dt><dd>{info[1]}</dd></div><div><dt>Potensi laut</dt><dd>{info[2]}</dd></div></dl><p>{info[3]}</p></>:<p>Ketuk pulau atau pilih namanya untuk menjelajahi garis pantai dan kekayaan lautnya.</p>}</div>
 </section>;
}

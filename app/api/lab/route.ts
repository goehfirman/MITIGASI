import {db,hash} from '@/lib/lab-db';
import {validDesign} from '@/lib/tower';
const reply=(v:unknown,status=200)=>Response.json(v,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(req:Request){
 try{
 if(req.headers.get('origin')&&req.headers.get('origin')!==new URL(req.url).origin)return reply({error:'Permintaan tidak diizinkan.'},403);
 const raw=await req.text();if(raw.length>60000)return reply({error:'Data terlalu besar.'},413);const b=JSON.parse(raw),d=db();
 const fail=(s:string)=>reply({error:s},400);const name=typeof b.name==='string'?b.name.trim().slice(0,40):'';
 if(['start','join','create'].includes(b.action)){
 if(b.action!=='create'&&!name)return fail('Isi nama kelompok terlebih dahulu.');
 const token=crypto.randomUUID()+crypto.randomUUID(),tokenHash=await hash(token),id=crypto.randomUUID();let code:string|null=null,role='student',challenge='Bebas',strength='Ringan';
 if(b.action==='join'){code=String(b.code).toUpperCase().trim();const c:any=await d.prepare('SELECT * FROM classes WHERE code = ?').bind(code).first();if(!c)return fail('Kode kelas tidak ditemukan. Periksa kembali kode dari guru.');challenge=c.challenge;strength=c.strength;}
 if(b.action==='create'){
 if(typeof b.className!=='string'||!b.className.trim())return fail('Isi nama kelas.');
 role='teacher';challenge=b.challenge==='Tantangan'?'Tantangan':'Bebas';strength=['Ringan','Sedang','Kuat'].includes(b.strength)?b.strength:'Ringan';code=crypto.randomUUID().replaceAll('-','').slice(0,8).toUpperCase();
 await d.batch([d.prepare('INSERT INTO classes (code,name,teacher,challenge,strength) VALUES (?,?,?,?,?)').bind(code,b.className.trim().slice(0,80),id,challenge,strength),d.prepare('INSERT INTO participants (id,name,code,token,role) VALUES (?,?,?,?,?)').bind(id,name||'Guru',code,tokenHash,role)]);
 }else await d.prepare('INSERT INTO participants (id,name,code,token,role) VALUES (?,?,?,?,?)').bind(id,name,code,tokenHash,role).run();
 return reply({token,role,code,name:name||'Guru',challenge,strength});}
 if(typeof b.token!=='string'||b.token.length>200)return reply({error:'Sesi tidak tersedia. Gabung kembali.'},401);
 const p:any=await d.prepare('SELECT * FROM participants WHERE token = ?').bind(await hash(b.token)).first();if(!p)return reply({error:'Sesi tidak ditemukan. Gabung kembali atau periksa kunci guru.'},401);
 if(b.action==='restore'){if(p.role!=='teacher')return reply({error:'Kunci guru tidak valid.'},403);return reply({token:b.token,role:p.role,code:p.code,name:p.name});}
 if(b.action==='save'){
 const r=b.result;if(!r||typeof r.id!=='string'||r.id.length>100||!r.design||!Array.isArray(r.design.nodes)||!Array.isArray(r.design.beams)||!validDesign(r.design)||!Number.isFinite(r.duration)||r.duration<0||r.duration>10||!Number.isFinite(r.height)||r.height<0||r.height>48||!['Ringan','Sedang','Kuat'].includes(r.strength)||!['X','X-Y'].includes(r.direction)||typeof r.standing!=='boolean')return fail('Hasil percobaan tidak valid.');
 const clean={...r,name:p.name,score:Math.round(r.duration*10),reflection:String(r.reflection||'').slice(0,1500),date:new Date().toISOString()};
 const existing:any=await d.prepare('SELECT participant FROM attempts WHERE id = ?').bind(r.id).first();if(existing&&existing.participant!==p.id)return reply({error:'Hasil ini milik sesi lain.'},403);
 await d.prepare('INSERT INTO attempts (id,participant,payload,created) VALUES (?,?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload WHERE attempts.participant=excluded.participant').bind(r.id,p.id,JSON.stringify(clean),clean.date).run();return reply({ok:true});}
 if(b.action==='history'){const rows=await d.prepare('SELECT payload FROM attempts WHERE participant = ? ORDER BY created DESC LIMIT 100').bind(p.id).all();return reply({results:rows.results.map((r:any)=>JSON.parse(r.payload))});}
 if(b.action==='dashboard'){
 if(p.role!=='teacher')return reply({error:'Hanya guru yang dapat melihat hasil kelas.'},403);
 const students=await d.prepare("SELECT p.id,p.name,COUNT(a.id) AS attempts,COALESCE(MAX(CAST(json_extract(a.payload,'$.score') AS INTEGER)),0) AS best FROM participants p LEFT JOIN attempts a ON a.participant=p.id WHERE p.code=? AND p.role='student' GROUP BY p.id ORDER BY p.name").bind(p.code).all();
 const results=await d.prepare('SELECT a.payload FROM attempts a JOIN participants p ON p.id=a.participant WHERE p.code=? ORDER BY a.created DESC LIMIT 500').bind(p.code).all();return reply({students:students.results,results:results.results.map((r:any)=>JSON.parse(r.payload))});}
 return fail('Tindakan tidak dikenali.');
 }catch(e){console.error('Lab request failed',e instanceof Error?e.message:'unknown');return reply({error:'Belum dapat memuat atau menyimpan data. Hasil di layar tetap tersedia. Coba lagi.'},503);}
}

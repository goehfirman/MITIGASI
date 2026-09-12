"use client";
import {useEffect,useRef,useState} from 'react';
import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {simulation} from '@/lib/physics';
import type {Design} from '@/lib/tower';
export type SceneProps={design:Design,tool:string,level:number,selected:number|null,low:boolean,wire:boolean,view:string,zoom:number,run:number,strength:string,direction:string,onNode:(id:number)=>void,onPlace:(x:number,y:number,z:number,id?:number)=>void,onProgress:(t:number)=>void,onDone:(duration:number,standing:boolean)=>void};
export default function TowerScene(props:SceneProps){
 const host=useRef<HTMLDivElement>(null),latest=useRef(props),sceneRef=useRef<any>(null);latest.current=props;const [error,setError]=useState('');
 useEffect(()=>{if(!host.current)return;let renderer:T.WebGLRenderer;try{renderer=new T.WebGLRenderer({antialias:true,alpha:true});}catch{setError('Tampilan 3D tidak tersedia. Aktifkan WebGL atau buka aplikasi melalui Chrome / Edge di papan.');return;}
 const el=host.current;renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=true;el.appendChild(renderer.domElement);
 const scene=new T.Scene();scene.background=new T.Color('#eef3f8');const camera=new T.PerspectiveCamera(38,1,.1,100);camera.position.set(9,8,11);
 const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,2,0);controls.enableDamping=true;controls.minDistance=4;controls.maxDistance=32;controls.maxPolarAngle=Math.PI*.49;
 scene.add(new T.HemisphereLight(0xffffff,0x8090a8,2.7));const light=new T.DirectionalLight(0xffffff,3);light.position.set(4,9,5);light.castShadow=true;light.shadow.mapSize.set(1024,1024);scene.add(light);
 const group=new T.Group();scene.add(group);const platform=new T.Mesh(new T.BoxGeometry(8,.22,8),new T.MeshStandardMaterial({color:0xc8d6e4,roughness:.9}));platform.position.y=-.24;platform.receiveShadow=true;scene.add(platform);
 const grid=new T.GridHelper(8,16,0x9aafc4,0xbdcddd);grid.position.y=-.12;scene.add(grid);const editGrid=new T.GridHelper(8,16,0x5b7bd2,0xc4d0e9);editGrid.visible=false;scene.add(editGrid);
 const ray=new T.Raycaster(),pointer=new T.Vector2();let down={x:0,y:0,id:undefined as number|undefined};
 function locate(e:PointerEvent){const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);}
 function pick(e:PointerEvent){locate(e);const nodes=group.children.filter(c=>c.userData.kind==='node');const hit=ray.intersectObjects(nodes)[0];if(hit)return hit.object.userData.id as number;const r=renderer.domElement.getBoundingClientRect();let nearest:number|undefined=undefined,best=25;for(const n of nodes){const p=n.position.clone().project(camera);const dist=Math.hypot((p.x+1)*r.width/2-(e.clientX-r.left),(1-p.y)*r.height/2-(e.clientY-r.top));if(p.z<1&&dist<best){best=dist;nearest=n.userData.id;}}return nearest;}
 function start(e:PointerEvent){down={x:e.clientX,y:e.clientY,id:pick(e)};if(latest.current.tool==='move'&&down.id!==undefined)renderer.domElement.setPointerCapture(e.pointerId);}
 function end(e:PointerEvent){const p=latest.current;if(p.run)return;const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y)>8;if(p.tool==='add'||(p.tool==='move'&&down.id!==undefined)){locate(e);const y=p.tool==='move'?p.design.nodes.find(n=>n.id===down.id)!.y:p.level*1.5;const point=new T.Vector3();if(ray.ray.intersectPlane(new T.Plane(new T.Vector3(0,1,0),-y),point))p.onPlace(Math.round(point.x*2)/2,y,Math.round(point.z*2)/2,p.tool==='move'?down.id:undefined);}
 else if(!moved&&p.tool!=='orbit'){const id=pick(e);if(id!==undefined)p.onNode(id);}}
 renderer.domElement.addEventListener('pointerdown',start);renderer.domElement.addEventListener('pointerup',end);
 const resize=new ResizeObserver(()=>{const w=el.clientWidth,h=el.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();});resize.observe(el);
 sceneRef.current={scene,group,camera,controls,renderer,platform,grid,editGrid,sim:null,done:false,acc:0,follow:true};controls.addEventListener('start',()=>{if(sceneRef.current)sceneRef.current.follow=false;});let frame=0,last=performance.now(),lastReport=0;
 function updateMeshes(pos:T.Vector3[],broken:boolean[]=[]){const d=latest.current.design;for(const m of group.children as T.Mesh[]){if(m.userData.kind==='node')m.position.copy(pos[m.userData.index]);else{const b=d.beams[m.userData.index];const a=pos[d.nodes.findIndex(n=>n.id===b.a)],z=pos[d.nodes.findIndex(n=>n.id===b.b)];if(!a||!z)continue;m.position.copy(a).add(z).multiplyScalar(.5);m.scale.set(1,a.distanceTo(z),1);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),z.clone().sub(a).normalize());(m.material as T.MeshStandardMaterial).color.set(broken[m.userData.index]?0xe05b3e:0xc49858);}}}
 sceneRef.current.updateMeshes=updateMeshes;
 function animate(now:number){frame=requestAnimationFrame(animate);const s=sceneRef.current;if(!s)return;const delta=Math.min((now-last)/1000,.1);last=now;
 if(s.sim&&!s.done){s.acc+=delta;while(s.acc>=1/60&&s.sim.time<10){const shift=s.sim.step();platform.position.x=shift.dx;platform.position.z=shift.dz;s.acc-=1/60;}updateMeshes(s.sim.bodies.map((b:any)=>new T.Vector3(b.position.x,b.position.y,b.position.z)),s.sim.constraints.map((c:any)=>c.broken));if(now-lastReport>100){latest.current.onProgress(s.sim.time);lastReport=now;}if(s.sim.time>=10){s.done=true;latest.current.onDone(Math.min(10,s.sim.failedAt??10),s.sim.failedAt===null);}}
 if(s.sim&&!s.done&&s.follow){const center=new T.Vector3();s.sim.bodies.forEach((b:any)=>center.add(new T.Vector3(b.position.x,b.position.y,b.position.z)));center.divideScalar(Math.max(1,s.sim.bodies.length));controls.target.lerp(center,.04);}controls.update();renderer.render(scene,camera);}
 frame=requestAnimationFrame(animate);return()=>{cancelAnimationFrame(frame);resize.disconnect();controls.dispose();renderer.domElement.removeEventListener('pointerdown',start);renderer.domElement.removeEventListener('pointerup',end);scene.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>m.dispose());}});renderer.dispose();renderer.domElement.remove();sceneRef.current=null;};
 },[]);
 useEffect(()=>{const s=sceneRef.current;if(!s)return;s.sim=null;s.platform.position.set(0,-.24,0);for(const c of [...s.group.children]){s.group.remove(c);c.geometry.dispose();c.material.dispose();}
 props.design.nodes.forEach((n,i)=>{const m=new T.Mesh(new T.SphereGeometry(.15,12,8),new T.MeshStandardMaterial({color:n.id===props.selected?0x5279ee:0xfffcf2,roughness:.85,wireframe:props.wire}));m.castShadow=true;m.userData={kind:'node',id:n.id,index:i};s.group.add(m);});
 props.design.beams.forEach((b,i)=>{const m=new T.Mesh(new T.CylinderGeometry(.035,.035,1,7),new T.MeshStandardMaterial({color:0xc49858,roughness:.8,wireframe:props.wire}));m.castShadow=true;m.userData={kind:'beam',index:i};s.group.add(m);});s.updateMeshes(props.design.nodes.map(n=>new T.Vector3(n.x,n.y,n.z)));
 },[props.design,props.selected,props.wire]);
 useEffect(()=>{const s=sceneRef.current;if(s){s.controls.enabled=props.tool==='orbit'||!!props.run;s.editGrid.visible=props.tool==='add'&&!props.run;s.editGrid.position.y=props.level*1.5;s.renderer.setPixelRatio(props.low?1:Math.min(devicePixelRatio,1.5));s.renderer.shadowMap.enabled=!props.low;}},[props.tool,props.level,props.run,props.low]);
 useEffect(()=>{const s=sceneRef.current;if(!s)return;const h=Math.max(3,...props.design.nodes.map(n=>n.y));s.controls.target.set(0,h*.4,0);const v=props.view==='Depan'?[0,h*.4,14]:props.view==='Atas'?[0,16,.01]:[9,8,11];s.camera.position.set(v[0],v[1],v[2]);s.controls.update();},[props.view]);
 useEffect(()=>{const s=sceneRef.current;if(s){s.camera.zoom=props.zoom;s.camera.updateProjectionMatrix();}},[props.zoom]);
 useEffect(()=>{const s=sceneRef.current;if(!s)return;if(props.run){s.sim=simulation(props.design,props.strength,props.direction);s.done=false;s.acc=0;s.follow=true;}else{s.sim=null;s.platform.position.set(0,-.24,0);s.updateMeshes(props.design.nodes.map(n=>new T.Vector3(n.x,n.y,n.z)));}},[props.run]);
 return <div ref={host} className="scene" aria-label="Kanvas menara 3D">{error&&<div role="alert" className="webgl-error">{error}</div>}</div>;
}

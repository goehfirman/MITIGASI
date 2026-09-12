import * as C from 'cannon-es';
import type {Design} from './tower';
export function simulation(d:Design,strength:string,direction:string){
 const world=new C.World({gravity:new C.Vec3(0,-9.82,0)});(world.solver as C.GSSolver).iterations=25;world.defaultContactMaterial.friction=.6;
 const floor=new C.Body({mass:0,shape:new C.Plane()});floor.quaternion.setFromEuler(-Math.PI/2,0,0);floor.position.y=-.12;world.addBody(floor);
 const bodies=d.nodes.map(n=>{const b=new C.Body({mass:n.y===0?0:.1,shape:new C.Sphere(.12),position:new C.Vec3(n.x,n.y,n.z),linearDamping:.12,angularDamping:.5});world.addBody(b);return b;});
 const constraints=d.beams.map(e=>{const ai=d.nodes.findIndex(n=>n.id===e.a),bi=d.nodes.findIndex(n=>n.id===e.b);const c=new C.DistanceConstraint(bodies[ai],bodies[bi],undefined,250);c.collideConnected=false;world.addConstraint(c);return {c,ai,bi,broken:false};});
 let time=0,failedAt:number|null=null;const initial=Math.max(0,...d.nodes.map(n=>n.y));const top=d.nodes.map((n,i)=>({n,i})).filter(v=>v.n.y>=initial*.8);
 return {bodies,constraints,get time(){return time},get failedAt(){return failedAt},step(){
 time+=1/60;const amp=strength==='Ringan'?.055:strength==='Sedang'?.16:.34;const f=strength==='Ringan'?1.4:strength==='Sedang'?2:2.6;const ramp=Math.min(1,time/1.5);
 const dx=Math.sin(time*Math.PI*2*f)*amp*ramp,dz=direction==='X-Y'?Math.sin(time*Math.PI*2*f*.83)*amp*ramp:0;
 d.nodes.forEach((n,i)=>{if(n.y===0){bodies[i].position.set(n.x+dx,0,n.z+dz);bodies[i].aabbNeedsUpdate=true;}});world.step(1/60);
 constraints.forEach(c=>{if(!c.broken&&bodies[c.ai].position.distanceTo(bodies[c.bi].position)>c.c.distance*1.3){c.broken=true;world.removeConstraint(c.c);}});
 const avg=top.reduce((s,v)=>s+bodies[v.i].position.y,0)/Math.max(1,top.length);if(failedAt===null&&(avg<initial*.6||constraints.some(c=>c.broken)))failedAt=time;return {dx,dz};}};
}

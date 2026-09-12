export type Joint={id:number,x:number,y:number,z:number};
export type Beam={a:number,b:number};
export type Design={nodes:Joint[],beams:Beam[]};
export type Result={id:string,name:string,height:number,strength:string,direction:string,duration:number,score:number,standing:boolean,date:string,design:Design,reflection?:string};
export function preset(braced=true,levels=3,taper=true):Design{
 const nodes:Joint[]=[],beams:Beam[]=[];
 for(let l=0;l<=levels;l++){const w=taper?Math.max(.6,1.5-l*.25):1.5;for(const [x,z] of [[-w,-w],[w,-w],[w,w],[-w,w]])nodes.push({id:nodes.length,x,y:l*1.5,z});
 for(let j=0;j<4;j++){beams.push({a:l*4+j,b:l*4+(j+1)%4});if(l){beams.push({a:(l-1)*4+j,b:l*4+j});if(braced)beams.push({a:(l-1)*4+j,b:l*4+(j+1)%4});}}
 if(braced)beams.push({a:l*4,b:l*4+2});}return {nodes,beams};
}
export const height=(d:Design)=>Math.round(Math.max(0,...d.nodes.map(n=>n.y))*40)/10;
export function validDesign(d:Design){return d.nodes.length<=80&&d.beams.length<=240&&d.nodes.every(n=>[n.x,n.y,n.z].every(Number.isFinite)&&n.y>=0&&n.y<=12&&Math.abs(n.x)<=5&&Math.abs(n.z)<=5)&&new Set(d.nodes.map(n=>n.id)).size===d.nodes.length&&d.beams.every(b=>b.a!==b.b&&d.nodes.some(n=>n.id===b.a)&&d.nodes.some(n=>n.id===b.b));}

"use client";
import {useLayoutEffect,useRef,useState,type ReactNode} from 'react';
export default function ViewportFit({children}:{children:ReactNode}){
 const host=useRef<HTMLDivElement>(null),page=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState({width:1280,scale:1,left:0,ready:false});
 useLayoutEffect(()=>{
  let frame=0;
  const measure=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
   if(!host.current||!page.current)return;
   const available=host.current.getBoundingClientRect();
   const width=Math.max(1280,available.width);
   if(page.current.offsetWidth!==Math.round(width)){setSize(s=>({...s,width}));return;}
   const height=page.current.scrollHeight;
   const scale=Math.min(1,available.width/width,(available.height-4)/Math.max(1,height));
   setSize({width,scale,left:Math.max(0,(available.width-width*scale)/2),ready:true});
  });};
  const observer=new ResizeObserver(measure);observer.observe(host.current!);observer.observe(page.current!);
  window.addEventListener('resize',measure);document.addEventListener('fullscreenchange',measure);measure();
  return ()=>{cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener('resize',measure);document.removeEventListener('fullscreenchange',measure);};
 },[]);
 return <div className="viewport-fit" ref={host}><div ref={page} className="viewport-page" style={{width:size.width,transform:`translateX(${size.left}px) scale(${size.scale})`,visibility:size.ready?'visible':'hidden'}}>{children}</div></div>;
}

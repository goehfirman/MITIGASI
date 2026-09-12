import {env} from 'cloudflare:workers';
export function db(){const d=(env as unknown as {DB:D1Database}).DB;if(!d)throw new Error('Penyimpanan belum tersedia. Coba lagi sebentar.');return d;}
export async function hash(s:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('');}

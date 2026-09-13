const store = (globalThis as any).__STORE || {
  classes: [] as any[],
  participants: [] as any[],
  attempts: [] as any[]
};
(globalThis as any).__STORE = store;

export function db() {
  const parseScore = (payload: string) => JSON.parse(payload).score || 0;
  return {
    prepare: (query: string) => ({
      bind: (...args: any[]) => ({
        first: async () => {
          if (query.includes('FROM classes')) return store.classes.find((c:any) => c.code === args[0]);
          if (query.includes('FROM participants')) return store.participants.find((p:any) => p.token === args[0]);
          if (query.includes('FROM attempts')) return store.attempts.find((a:any) => a.id === args[0]);
          return null;
        },
        all: async () => {
          if (query.includes('SELECT payload FROM attempts WHERE participant = ?')) {
            const res = store.attempts.filter((a:any) => a.participant === args[0]).sort((a:any,b:any) => b.created.localeCompare(a.created)).slice(0, 100);
            return { results: res };
          }
          if (query.includes('SELECT p.id,p.name,COUNT')) {
            const students = store.participants.filter((p:any) => p.code === args[0] && p.role === 'student').sort((a:any,b:any) => a.name.localeCompare(b.name));
            const results = students.map((s:any) => {
              const atts = store.attempts.filter((a:any) => a.participant === s.id);
              return {
                id: s.id, name: s.name, attempts: atts.length,
                best: atts.reduce((max:number, a:any) => Math.max(max, parseScore(a.payload)), 0)
              };
            });
            return { results };
          }
          if (query.includes('JOIN participants p ON')) {
            const res = store.attempts.filter((a:any) => store.participants.find((p:any) => p.id === a.participant)?.code === args[0]).sort((a:any,b:any) => b.created.localeCompare(a.created)).slice(0, 500);
            return { results: res };
          }
          return { results: [] };
        },
        run: async () => {
          if (query.includes('INSERT INTO classes')) {
            store.classes.push({ code: args[0], name: args[1], teacher: args[2], challenge: args[3], strength: args[4] });
          } else if (query.includes('INSERT INTO participants')) {
            store.participants.push({ id: args[0], name: args[1], code: args[2], token: args[3], role: args[4] });
          } else if (query.includes('INSERT INTO attempts')) {
            const idx = store.attempts.findIndex((a:any) => a.id === args[0]);
            const entry = { id: args[0], participant: args[1], payload: args[2], created: args[3] };
            if (idx >= 0) store.attempts[idx] = entry; else store.attempts.push(entry);
          }
        }
      })
    }),
    batch: async (cmds: any[]) => {
      for (const c of cmds) await c.run();
    }
  };
}

export async function hash(s: string) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(b), x => x.toString(16).padStart(2, '0')).join('');
}

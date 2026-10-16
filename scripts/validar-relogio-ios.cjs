// Instrumentação local de teste, fora do bundle do aplicativo.
// Requer Metro em 127.0.0.1:8084 e Expo Go com o Flui aberto.
// Uso: node scripts/validar-relogio-ios.cjs [ISO-8601|restore]
// Sem argumento: inspeciona; restore: remove o relógio de teste.
const WebSocket = require('ws');

async function connect(target) {
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  const urls = [];
  const pending = new Map();
  let seq = 0;
  ws.on('message', raw => {
    const m = JSON.parse(raw);
    if (m.method === 'Debugger.scriptParsed' && m.params.url) urls.push(m.params.url);
    if (pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => { ws.terminate(); reject(Error('Conexão sem resposta')); }, 4000);
    ws.once('open', () => { clearTimeout(timer); resolve(); });
    ws.once('error', error => { clearTimeout(timer); reject(error); });
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++seq;
    const timer = setTimeout(() => { pending.delete(id); ws.terminate(); reject(Error('Comando sem resposta')); }, 4000);
    pending.set(id, m => { clearTimeout(timer); resolve(m); });
    ws.send(JSON.stringify({ id, method, params }));
  });
  await send('Debugger.enable');
  return { ws, send, urls };
}

(async () => {
  const targets = await (await fetch('http://127.0.0.1:8084/json/list')).json();
  let applied = false;
  for (const target of targets) {
    const session = await connect(target);
    console.log(JSON.stringify({ id: target.id, urls: session.urls.map(url => url.split('?')[0]) }));
    const mode = process.argv[2];
    if (mode && session.urls.some(url => url.startsWith('http://127.0.0.1:8084/node_modules/expo-router/entry.bundle'))) {
      const expression = mode === 'restore'
        ? `(() => { const c=globalThis.__fluiValidationClock12; if(c){Date=c.RealDate;delete globalThis.__fluiValidationClock12;} return {restored:true,now:new Date().toISOString()}; })()`
        : `(() => {
          const iso=${JSON.stringify(mode)};
          const c=globalThis.__fluiValidationClock12 || {RealDate:Date,offset:0};
          const RealDate=c.RealDate;
          const instant=RealDate.parse(iso);
          if(!Number.isFinite(instant)) throw Error('Instante inválido');
          c.offset=instant-RealDate.now();
          globalThis.__fluiValidationClock12=c;
          function TestDate(...args){
            if(new.target) return Reflect.construct(RealDate,args.length?args:[RealDate.now()+c.offset],new.target);
            return new RealDate(RealDate.now()+c.offset).toString();
          }
          Object.setPrototypeOf(TestDate,RealDate);
          TestDate.prototype=RealDate.prototype;
          TestDate.now=()=>RealDate.now()+c.offset;
          Date=TestDate;
          return {simulated:new Date().toISOString(),real:new RealDate().toISOString()};
        })()`;
      const result = await session.send('Runtime.evaluate', {expression,returnByValue:true});
      console.log(JSON.stringify({clock:result.result}));
      if(result.error || result.result?.exceptionDetails) throw Error('Relógio não aplicado');
      applied = true;
    }
    session.ws.close();
  }
  if (process.argv[2] && !applied) throw Error('Flui não encontrado no Metro local da porta 8084');
})().catch(error => { console.error(error.message); process.exitCode = 1; });

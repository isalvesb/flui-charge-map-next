const {chromium}=require(process.env.FLUI_PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs'),assert=require('node:assert/strict');
const out=require('path').resolve(process.env.FLUI_EVIDENCE_DIR || '.validation/consolidacao');fs.mkdirSync(out,{recursive:true});fs.mkdirSync(out+'/web-capturas',{recursive:true});
async function geometry(page){return page.getByText('Distância total',{exact:true}).evaluate(e=>{
 const row=e.parentElement.parentElement; const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
 return {row:{...rect(row),direction:getComputedStyle(row).flexDirection},items:[...row.children].filter(e=>e.textContent).map(e=>({text:e.textContent,...rect(e),flex:getComputedStyle(e).flex,children:[...e.children].map(c=>{const range=document.createRange();range.selectNodeContents(c);return {text:c.textContent,...rect(c),fontSize:getComputedStyle(c).fontSize,scrollWidth:c.scrollWidth,clientWidth:c.clientWidth,fragments:[...range.getClientRects()].map(r=>({x:r.x,y:r.y,right:r.right,bottom:r.bottom}))}})}))};
 });}
function verify(g){assert.equal(g.items.length,3);for(const item of g.items){assert(item.width>=100);assert(item.x>=g.row.x-1&&item.right<=g.row.right+1);for(const c of item.children){assert(c.x>=item.x-1&&c.right<=item.right+1,JSON.stringify(c));assert(c.scrollWidth<=c.clientWidth+1);for(const r of c.fragments)assert(r.x>=item.x-1&&r.right<=item.right+1,JSON.stringify(r));}}for(let a=0;a<3;a++)for(let b=a+1;b<3;b++){const x=g.items[a],y=g.items[b];assert(!(x.x<y.right-1&&x.right>y.x+1&&x.y<y.bottom-1&&x.bottom>y.y+1));}}
(async()=>{const browser=await chromium.launch({headless:true});const results=[];const themes=[['claro','light',false],['escuro','dark',false],['contraste-claro','light',true],['contraste-escuro','dark',true]];
for(const width of [320,375,390,481,768])for(const font of ['default','large'])for(const [theme,mode,hc] of themes)for(const scenario of (process.env.ONLY_INVIAVEL ? ['inviavel'] : ['direta','tres-paradas','inviavel'])){
 const name=`${width}-${font}-${theme}-${scenario}`;const context=await browser.newContext({viewport:{width,height:862},deviceScaleFactor:1});
 const prefs={hasSeenOnboarding:true,appearanceMode:mode,highContrast:hc,fontSize:font,vehicleRangeKm:scenario==='direta'?400:80,batteryPercent:scenario==='inviavel'?50:70,demoOriginId:'fiap'};
 await context.addInitScript(prefs=>localStorage.setItem('@flui:userPreferences',JSON.stringify(prefs)),prefs);
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
 await page.goto((process.env.FLUI_BASE_URL || 'http://127.0.0.1:8131')+'/trip-planner');await page.getByText('Resumo da viagem',{exact:true}).waitFor();await page.waitForTimeout(180);
 // Aguarda a largura medida e a distribuição correspondente ao tamanho atual.
 await page.waitForFunction(()=>{const label=[...document.querySelectorAll('div')].find(e=>e.childElementCount===0&&e.textContent==='Distância total');return label&&label.parentElement.getBoundingClientRect().width>=100});
 await page.getByRole('button',{name:'Ver trechos da viagem',exact:true}).click();await page.waitForTimeout(700);
 const g=await geometry(page);verify(g);assert.equal(g.items[0].children[1].text,'142 km');assert.equal(g.items[1].children[1].text,'2h02min');assert.equal(g.items[2].children[1].text,scenario==='tres-paradas'?'3':'0');
 const button=page.getByRole('button',{name:scenario==='inviavel'?'Viagem indisponível':'Iniciar viagem',exact:true});assert.equal(await button.isDisabled(),scenario==='inviavel');
 await page.screenshot({path:out+'/web-capturas/'+name+'-resumo.png'});
 const final=page.getByText(/O tempo de deslocamento não inclui espera nem duração das recargas/);await final.evaluate(e=>{for(let p=e.parentElement;p;p=p.parentElement){if(p.scrollHeight>p.clientHeight&&getComputedStyle(p).overflowY.match(/auto|scroll/)){p.scrollTop=p.scrollHeight;break}}});await page.waitForTimeout(100);
 const footer=await button.evaluate(e=>{const r=e.parentElement.getBoundingClientRect();return {top:r.top,bottom:r.bottom}}),end=await final.boundingBox(),bb=await button.boundingBox();assert(end);assert(end.y>=0&&end.y+end.height<=footer.top+1,JSON.stringify({end,footer}));assert(bb.y>=0&&bb.y+bb.height<=862);assert.equal(await button.isVisible(),true);
 await page.screenshot({path:out+'/web-capturas/'+name+'-final.png'});
 results.push({name,pass:true,geometry:g,final:end,footer,button:bb,errors});
 }catch(e){results.push({name,pass:false,error:e.stack,errors});await page.screenshot({path:out+'/web-capturas/'+name+'-falha.png'}).catch(()=>{});}
 fs.writeFileSync(out+(process.env.ONLY_INVIAVEL?'/matriz-web-inviavel.json':'/matriz-web.json'),JSON.stringify(results,null,2));await context.close();console.log(`${results.at(-1).pass?'PASS':'FAIL'} ${name}${results.at(-1).pass?'':' '+results.at(-1).error.split('\n')[0]}`);
}
console.log(JSON.stringify({total:results.length,pass:results.filter(r=>r.pass).length,fail:results.filter(r=>!r.pass).length}));await browser.close();process.exitCode=results.every(r=>r.pass)?0:1;})();

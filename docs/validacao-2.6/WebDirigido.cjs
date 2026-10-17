const {chromium}=require('/Users/guicunha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {expect}=require('/Users/guicunha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/test');
const fs=require('node:fs/promises');const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true});const results=[];
 for(const [name,width,height] of [['compacta',320,568],['horizontal',844,390],['tablet',768,1024],['panoramica',1920,480]]){
  const context=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'});const page=await context.newPage();
  await page.goto('http://127.0.0.1:8086/settings');const font=page.getByRole('button',{name:'Selecionar fonte maior',exact:true});await font.click();await expect(font).toHaveAttribute('aria-pressed','true');
  if(name==='tablet'){const dark=page.getByRole('button',{name:'Selecionar tema escuro',exact:true});await dark.click();await expect(dark).toHaveAttribute('aria-pressed','true');}
  await page.goto('http://127.0.0.1:8086/map');const hide=page.getByRole('button',{name:'Minimizar opções demonstrativas para ver o mapa inteiro',exact:true});await hide.waitFor();await page.waitForTimeout(500);
  const row={name,width,height,font:'maior',theme:name==='tablet'?'escuro':'claro',checks:[]};
  const noOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth);assert.ok(noOverflow);row.checks.push('sem overflow horizontal');
  const hover=page.getByRole('button',{name:'Abrir perfil',exact:true});await hover.hover();await page.waitForTimeout(180);const transform=await hover.evaluate(e=>getComputedStyle(e.firstElementChild).transform);assert.ok(transform==='none'||transform==='matrix(1, 0, 0, 1, 0, 0)',transform);row.checks.push('reduzir movimento mantém escala de toque/hover em 1');
  for(const label of ['Abrir perfil','Abrir busca e filtros','Mostrar atalhos de filtro','Aumentar zoom do mapa','Diminuir zoom do mapa','Centralizar origem demonstrativa: FIAP','Abrir assistente Flui IA','Minimizar opções demonstrativas para ver o mapa inteiro']){
   const btn=page.getByRole('button',{name:label,exact:true});const r=await btn.boundingBox();assert.ok(r&&r.width>=44&&r.height>=44,label+JSON.stringify(r));assert.ok(r.y>=0&&r.y+r.height<=height,label+' fora da tela');
  }row.checks.push('8 controles >=44 e dentro da tela');
  await page.screenshot({path:`/tmp/flui-beta26-final-${name}.png`});
  // O painel inteiro deve rolar: o último cartão continua alcançável em telas baixas.
  const cards=page.getByRole('button',{name:/\. Opção demonstrativa\./});const last=cards.last();await last.scrollIntoViewIfNeeded();await expect(last).toBeInViewport();await page.screenshot({path:`/tmp/flui-beta26-final-lista-${name}.png`});row.checks.push('último cartão alcançável por rolagem');
  await hide.click();await expect(page.getByRole('button',{name:'Mostrar opções demonstrativas',exact:true})).toBeVisible();
  const focus=[];
  for(let i=0;i<24;i++){await page.keyboard.press('Tab');focus.push(await page.evaluate(()=>document.activeElement?.getAttribute('aria-label')||document.activeElement?.textContent?.slice(0,60)));}
  assert.ok(!focus.some(v=>v&&/\. Opção demonstrativa\.|Minimizar opções/.test(v)),JSON.stringify(focus));row.focus=focus;row.checks.push('Tab não alcança painel oculto');
  await page.getByRole('button',{name:'Mostrar opções demonstrativas',exact:true}).click();
  await page.getByRole('button',{name:/Bateria para estimativa:/}).click();const close=page.getByRole('button',{name:'Fechar sem definir a carga',exact:true});await close.waitFor();
  await page.getByRole('button',{name:'Definir carga da bateria',exact:true}).scrollIntoViewIfNeeded();await page.screenshot({path:`/tmp/flui-beta26-final-bateria-${name}.png`});
  for(let i=0;i<10;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!!document.activeElement.closest('[aria-modal="true"]')),'Foco saiu do modal');}
  await page.keyboard.press('Escape');await expect(close).toHaveCount(0);row.checks.push('bateria rolável; foco contido; Escape fecha');
  const open=page.getByRole('button',{name:'Abrir assistente Flui IA',exact:true});await open.click();
  for(const label of ['Tenho pouca bateria','Quero carregar rápido','Quero evitar filas','Preciso de banheiro e café','Quero esperar com conforto']){const b=page.getByRole('button',{name:label,exact:true});await b.scrollIntoViewIfNeeded();await expect(b).toBeInViewport();}
  await page.screenshot({path:`/tmp/flui-beta26-final-assistente-${name}.png`});await page.getByRole('button',{name:'Fechar assistente',exact:true}).click();row.checks.push('5 opções FluIA alcançáveis; fecha pelo botão');
  for(const route of ['search','profile','point-details?stationId=station-01']){await page.goto('http://127.0.0.1:8086/'+route);await page.waitForTimeout(500);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route+' overflow');}
  row.checks.push('filtros, perfil e ficha sem overflow');
  results.push(row);await fs.writeFile('/tmp/flui-beta26-web-resultados.json',JSON.stringify(results,null,2));await context.close();
 }
 await browser.close();console.log('WEB APROVADO: 4 resoluções, fonte maior, dois temas, rolagem, toque, teclado e modais.');
})().catch(e=>{console.error(e);process.exit(1)});

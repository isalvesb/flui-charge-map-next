const {chromium}=require('/Users/guicunha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {expect}=require('/Users/guicunha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/test');
const assert=require('node:assert/strict');const fs=require('node:fs/promises');
(async()=>{const browser=await chromium.launch();const results=[];
for(const[name,width,height]of[['compacta',320,568],['horizontal',844,390],['tablet',768,1024],['panoramica',1920,480]]){
 const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
 await page.goto('http://127.0.0.1:8787/settings');const font=page.getByRole('button',{name:'Selecionar fonte maior',exact:true});await font.click();await expect(font).toHaveAttribute('aria-pressed','true');
 if(name==='tablet'){const theme=page.getByRole('button',{name:'Selecionar tema escuro',exact:true});await theme.click();await expect(theme).toHaveAttribute('aria-pressed','true');}
 await page.goto('http://127.0.0.1:8787/map');const open=page.getByRole('button',{name:'Abrir assistente Flui IA',exact:true});await open.waitFor();
 const row={name,width,height,font:'maior',theme:name==='tablet'?'escuro':'claro',checks:[]};
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 for(const label of['Abrir busca e filtros','Mostrar atalhos de filtro','Aumentar zoom do mapa','Diminuir zoom do mapa','Abrir assistente Flui IA']){const b=await page.getByRole('button',{name:label,exact:true}).boundingBox();assert.ok(b.width>=44&&b.height>=44,label);assert.ok(b.y>=0&&b.y+b.height<=height,label);}
 row.checks.push('mapa sem overflow; controles Beta >=44 e dentro da tela');
 await open.click();const input=page.getByRole('textbox',{name:'Mensagem para a FluIA',exact:true});await input.waitFor();const send=page.getByRole('button',{name:'Enviar mensagem',exact:true});const close=page.getByRole('button',{name:'Fechar assistente',exact:true});
 for(const el of[input,send,close]){const r=await el.boundingBox();assert.ok(r.y>=0&&r.y+r.height<=height,JSON.stringify(r));assert.ok(r.height>=44,JSON.stringify(r));}
 row.composer={input:await input.boundingBox(),send:await send.boundingBox()};row.checks.push('campo, envio e fechar visíveis e >=44');
 for(const label of['Tenho pouca bateria','Quero carregar rápido','Quero evitar filas','Preciso de banheiro e café','Quero esperar com conforto']){const b=page.getByRole('button',{name:label,exact:true});await b.scrollIntoViewIfNeeded();await expect(b).toBeInViewport();}
 await page.screenshot({path:`/tmp/flui-pr79-combinada-${name}-inicial.png`});row.checks.push('cinco atalhos preservados e alcançáveis');
 await input.fill('O que é autonomia?');await input.press('Enter');await expect(page.getByText(/Autonomia é a distância que o veículo consegue percorrer/)).toBeVisible();
 assert.ok(await input.inputValue()==='');row.checks.push('pergunta programada e envio por Enter');
 await input.fill('Quero carregar rápido');await send.click();const chatRoute=page.getByRole('button',{name:'Ver ponto no mapa',exact:true});await expect(chatRoute).toBeVisible();assert.ok((await chatRoute.boundingBox()).height>=44);
 await page.screenshot({path:`/tmp/flui-pr79-combinada-${name}-chat.png`});row.checks.push('recomendação pelo chat com botão >=44');
 await chatRoute.click();await expect(page).toHaveURL(/point-details.*stationId=station-01/);await page.getByRole('button',{name:'Voltar ao mapa',exact:true}).waitFor();row.checks.push('chat abre ficha Higienópolis station-01');
 await page.getByRole('button',{name:'Voltar ao mapa',exact:true}).click();await open.click();await expect(input).toHaveValue('');assert.equal(await page.getByText('O que é autonomia?',{exact:true}).count(),0);row.checks.push('retorno/reabertura limpa conversa e rascunho');
 const quick=page.getByRole('button',{name:'Quero carregar rápido',exact:true});await quick.click();const quickRoute=page.getByRole('button',{name:'Ver Higienópolis Prime Charge no mapa',exact:true});await quickRoute.scrollIntoViewIfNeeded();await expect(quickRoute).toBeInViewport();
 await page.screenshot({path:`/tmp/flui-pr79-combinada-${name}-atalho.png`});row.checks.push('atalho continua recomendando; ficha alcançável');
 for(let i=0;i<12;i++){await page.keyboard.press('Tab');assert.ok(await page.evaluate(()=>!!document.activeElement.closest('[aria-modal="true"]')));}
 await page.keyboard.press('Escape');await expect(input).toHaveCount(0);row.checks.push('foco contido e Escape fecha');
 results.push(row);await fs.writeFile('/tmp/flui-pr79-combinada-resultados.json',JSON.stringify(results,null,2));await page.close();
}
await browser.close();console.log('APROVADO: experiência combinada em quatro resoluções, fonte maior, dois temas, chat, atalhos, ficha, foco e fechamento.');
})().catch(e=>{console.error(e);process.exit(1)});

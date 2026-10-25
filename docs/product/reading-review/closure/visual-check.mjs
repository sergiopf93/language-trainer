import { chromium, expect } from '../../../../node_modules/@playwright/test/index.mjs';
import { build } from '../../../../node_modules/esbuild/lib/main.js';
import { writeFile } from 'node:fs/promises';
const out='docs/product/reading-review/closure';
const bundled=await build({stdin:{contents:"export { readingCorpus } from './src/reading/corpus'; export { readingEligibility } from './src/reading/engine'; export { italianCourse } from './src/content/italian-a1/course'; export { loadLanguagePack } from './src/content/loader';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm'});
const {readingCorpus,readingEligibility,italianCourse,loadLanguagePack}=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const selected=[...readingCorpus].sort((a,b)=>b.body.length-a.body.length)[0];
const catalog=loadLanguagePack(italianCourse,true).repository;
const browser=await chromium.launch({channel:'chrome'});
const results=[];
try {
for(const width of [320,375,390,768]) {
 const context=await browser.newContext({viewport:{width,height:844},baseURL:'http://localhost:8787'});
 const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const checks=[];
 async function measure(stage){
  const value=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,innerWidth,scrollHeight:document.documentElement.scrollHeight,scrollY}));
  expect(value.scrollWidth).toBeLessThanOrEqual(value.innerWidth);checks.push({stage,...value});
 }
 for(const id of readingEligibility(selected,catalog,[]).missingConcepts){await page.goto('/concept?id='+id);await expect(page.locator('.theory-panel')).toBeVisible();}
 await page.goto('/reading');await page.getByRole('link',{name:'Leggi: '+selected.title,exact:true}).click();
 await page.getByRole('button',{name:'Inizia la lettura',exact:true}).click();
 await expect(page.getByText('Pratica salvata su questo dispositivo',{exact:true})).toBeVisible();
 await expect(page.locator('.reading-text')).toHaveText(selected.body);
 await measure('long text and question');
 await page.screenshot({path:`${out}/visual-long-${width}.png`,fullPage:true});
 const q=selected.questions[0];
 const answer=page.getByLabel(q.accepted[0],{exact:true});await answer.scrollIntoViewIfNeeded();
 await page.screenshot({path:`${out}/visual-question-${width}.png`});
 await answer.check();await expect(page.getByText('Pratica salvata su questo dispositivo',{exact:true})).toBeVisible();
 await page.getByRole('link',{name:'Pausa e torna alla pratica',exact:true}).click();
 await page.goto('/reading');await page.getByRole('link',{name:'Continua: '+selected.title,exact:true}).click();
 await expect(page.getByLabel(q.accepted[0],{exact:true})).toBeChecked();
 await page.getByRole('button',{name:'Vocabolario e aiuto',exact:true}).click();
 await expect(page.locator('.reading-help')).toBeVisible();
 await page.getByRole('button',{name:'Controlla',exact:true}).click();
 await expect(page.locator('.feedback h3')).toHaveText('Corretto!');
 const next=page.getByRole('button',{name:'Continua',exact:true});
 await next.evaluate(el=>el.scrollIntoView({block:'center'}));
 const hit=await next.evaluate(el=>{const b=el.getBoundingClientRect();return el.contains(document.elementFromPoint(b.x+b.width/2,b.y+b.height/2));});expect(hit).toBe(true);
 await measure('resumed feedback and navigation');
 await page.screenshot({path:`${out}/visual-resumed-${width}.png`});
 await next.click();await expect(page.getByRole('button',{name:'Controlla',exact:true})).toBeVisible();
 expect(errors).toEqual([]);
 results.push({width,height:844,text:selected.id,checks,resumeDraft:true,help:true,feedback:true,navigationButtonHitTest:hit,navigationClick:true,pageErrors:errors});
 await context.close();
}
await writeFile(`${out}/visual-browser.json`,JSON.stringify({environment:'Desktop Chrome, viewport emulation; no physical device',results},null,2)+'\n');
console.log(JSON.stringify(results));
}finally{await browser.close();}

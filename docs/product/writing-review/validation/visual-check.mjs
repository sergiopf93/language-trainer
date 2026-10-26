import { chromium } from '@playwright/test';
import { build } from 'esbuild';
import { writeFile } from 'node:fs/promises';
const bundled=await build({stdin:{contents:"export {writingOptions,writingPreparation} from './src/writing/engine';export {italianCourse} from './src/content/italian-a1/course';export {loadLanguagePack} from './src/content/loader';",resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm'});
const m=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const catalog=m.loadLanguagePack(m.italianCourse,true).repository;
const task=m.writingOptions(catalog).find(o=>o.id==='it-a1-writing-presentazione');
const browser=await chromium.launch({channel:'chrome'});
const rows=[];
try {
 for(const width of (process.env.VISUAL_WIDTHS || "320,375,390,768").split(",").map(Number)){
  const page=await browser.newPage({viewport:{width,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const id of m.writingPreparation(task,catalog,[])){await page.goto('http://localhost:8787/concept?id='+id);await page.locator('.theory-panel').waitFor();}
  await page.goto('http://localhost:8787/practice?writing='+task.id);await page.getByRole('button',{name:'Inizia a scrivere',exact:true}).click();
  const input=page.getByLabel('La tua risposta',{exact:true});await input.waitFor();
  if(width===768)await page.evaluate(()=>document.documentElement.style.zoom='2');
  await input.fill('Ciao! Sono María.\nSono di Málaga.\nA presto!');
  await page.getByText('Pratica salvata su questo dispositivo',{exact:true}).waitFor();
  await input.scrollIntoViewIfNeeded();
  const focus=await input.evaluate(e=>document.activeElement===e);
  await page.screenshot({path:`docs/product/writing-review/validation/editor-${width}.png`});
  await page.getByText('Prima di inviare, rileggi',{exact:true}).click();
  await page.screenshot({path:`docs/product/writing-review/validation/rubric-${width}.png`,fullPage:true});
  await page.getByRole('button',{name:'Controlla',exact:true}).click();await page.locator('.feedback').waitFor();
  await page.locator('.feedback').scrollIntoViewIfNeeded();await page.screenshot({path:`docs/product/writing-review/validation/feedback-${width}.png`});
  const preservesLines=await page.locator('.feedback').evaluate(e=>getComputedStyle(e).whiteSpace==='pre-wrap');
  await page.getByRole('button',{name:'Riprova',exact:true}).click();
  await input.fill('È già lunedì.\n'.repeat(260));await page.getByText('Pratica salvata su questo dispositivo',{exact:true}).waitFor({timeout:10000}).catch(async e=>{await page.screenshot({path:'docs/product/writing-review/validation/long-diagnostic.png',fullPage:true});throw e;});
  const value=await input.inputValue();await page.reload();await input.waitFor();
  const resumed=(await input.inputValue())===value;
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  await input.scrollIntoViewIfNeeded();await page.screenshot({path:`docs/product/writing-review/validation/long-resumed-${width}.png`});
  rows.push({width,zoom:width===768?2:1,focusDuringSave:focus,preservesLines,resumed,length:value.length,horizontalOverflow:overflow,errors});await page.close();
 }
 await writeFile('docs/product/writing-review/validation/visual-browser.json',JSON.stringify(rows,null,2)+'\n');
 if(rows.some(r=>!r.focusDuringSave||!r.preservesLines||!r.resumed||r.horizontalOverflow||r.errors.length))process.exitCode=1;
}finally{await browser.close();}

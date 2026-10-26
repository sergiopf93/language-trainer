import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({channel:'chrome'});
const rows=[];
try {
 for (const width of [320,375,390,768]) {
  const page=await browser.newPage({viewport:{width,height:844}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const cdp=await page.context().newCDPSession(page);
  await cdp.send('Performance.enable');
  const start=performance.now();
  await page.goto('http://localhost:8787/');
  await page.locator('main h1').waitFor();
  const startupMs=performance.now()-start;
  const timings=[];
  for (const [name,path] of [['Biblioteca','/library'],['Pratica','/practice'],['Progressi','/progress'],['Home','/']]) {
   const t=performance.now();
   await page.getByRole('link',{name,exact:true}).click();
   await page.waitForURL('**'+path);
   await page.locator('main h1').waitFor();
   timings.push({name,ms:performance.now()-t});
  }
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  const main=await page.locator('main').count();
  const nav=await page.getByRole('navigation',{name:'Navigazione principale'}).count();
  const skip=await page.getByRole('link',{name:'Vai al contenuto'}).count();
  const metrics=await cdp.send('Performance.getMetrics');
  const heap=metrics.metrics.find(m=>m.name==='JSHeapUsedSize')?.value;
  await page.screenshot({path:`docs/product/integration-validation/home-${width}.png`});
  rows.push({width,startupMs,timings,heapBytes:heap,overflow,main,nav,skip,errors});
  await page.close();
 }
 await writeFile('docs/product/integration-validation/browser-check.json',JSON.stringify(rows,null,2)+'\n');
 if(rows.some(r=>r.overflow||r.errors.length||r.main!==1||r.nav!==1||r.skip!==1))process.exitCode=1;
} finally {await browser.close();}

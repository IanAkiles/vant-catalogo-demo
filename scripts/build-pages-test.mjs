import {spawnSync} from 'node:child_process';
import {cpSync,mkdirSync} from 'node:fs';
const result=spawnSync(process.execPath,['node_modules/vite/bin/vite.js','build'],{
 stdio:'inherit',env:{...process.env,VITE_BASE_PATH:'/vant-catalogo-demo/',VITE_SUPABASE_URL:'https://vant-qa.supabase.co',VITE_SUPABASE_PUBLISHABLE_KEY:'sb_publishable_vant_qa_fake_key'},
});
if(result.status!==0)process.exit(result.status||1);
await import('./prepare-pages-build.mjs');
mkdirSync('dist/pages-test/vant-catalogo-demo',{recursive:true});
cpSync('dist/client','dist/pages-test/vant-catalogo-demo',{recursive:true});

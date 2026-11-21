import {copyFileSync,mkdirSync,writeFileSync} from 'node:fs';

// A real directory entry works on Pages without an SPA rewrite or a 404 redirect.
mkdirSync('dist/client/admin',{recursive:true});
copyFileSync('dist/client/index.html','dist/client/admin/index.html');
writeFileSync('dist/client/.nojekyll','');

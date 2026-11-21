import test from 'node:test';
import assert from 'node:assert/strict';
import {isAdminPath} from '../src/routes.js';

test('admin routes respect root and Pages subdirectory without matching storefront',()=>{
 for(const base of ['/','/vant-catalogo-demo/']){
  for(const suffix of ['admin','admin/','admin/index.html'])assert.equal(isAdminPath(base+suffix,base),true);
  for(const suffix of ['','index.html','administrator','admin/other'])assert.equal(isAdminPath(base+suffix,base),false);
 }
 assert.equal(isAdminPath('/admin','/vant-catalogo-demo/'),false);
});

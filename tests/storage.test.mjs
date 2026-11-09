import test from 'node:test';
import assert from 'node:assert/strict';
import {KEY,STORE_PHONE,readProducts,readPhone} from '../src/storage.js';

test('storage denial keeps the catalog usable with the supplied store phone',()=>{
 const previous=globalThis.localStorage;
 try{
  globalThis.localStorage={getItem(){throw new Error('Storage denied');}};
  assert.equal(readProducts().length,4);
  assert.equal(readPhone(),STORE_PHONE);
 }finally{globalThis.localStorage=previous;}
});

test('storefront reads saved admin data, including an empty catalog',()=>{
 const previous=globalThis.localStorage;
 try{
  globalThis.localStorage={getItem(key){return key===KEY?'[]':'5511999999999';}};
  assert.deepEqual(readProducts(),[]);
  assert.equal(readPhone(),'5511999999999');
 }finally{globalThis.localStorage=previous;}
});

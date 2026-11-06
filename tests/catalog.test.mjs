import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialProducts,loadProducts,validateProduct,makeMessage} from '../src/catalog.js';
test('invalid storage falls back, empty catalog remains empty',()=>{assert.equal(loadProducts('invalid').length,4);assert.equal(loadProducts('[{"name":"x"}]').length,4);assert.deepEqual(loadProducts('[]'),[]);});
test('prices and required variations are validated',()=>{assert.equal(validateProduct(initialProducts[0]),'');assert.ok(validateProduct({...initialProducts[0],price:-1}));assert.ok(validateProduct({...initialProducts[0],sizes:[]}));});
test('message preserves variations and integer-money total',()=>{const m=makeMessage({product:initialProducts[0],size:'M',color:'Creme',quantity:2},'https://example.com/#peca-vant-001');for(const s of ['Tamanho: M','Cor: Creme','Quantidade: 2','318,00','Código: vant-001','example.com'])assert.ok(m.includes(s));});

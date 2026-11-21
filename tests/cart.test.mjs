import test from 'node:test';
import assert from 'node:assert/strict';
import {readCart, resolveCart, cartTotal, makeCartMessage} from '../src/cart.js';
import {initialProducts} from '../src/catalog.js';

test('cart storage rejects malformed lines, merges variants and tolerates blocked storage', () => {
  assert.deepEqual(readCart({getItem(){throw Error('denied');}}), []);
  assert.deepEqual(readCart({getItem:()=>'{broken'}), []);
  const row = {id:'vant-001',name:'Camiseta',size:'M',color:'Creme',quantity:2};
  const rows = readCart({getItem:()=>JSON.stringify([null, row, {...row,quantity:1}, {...row,quantity:-1}, {...row,size:'G',quantity:1}])});
  assert.equal(rows.length, 2);
  assert.equal(rows[0].quantity, 3);
});

test('cart uses current catalog prices and blocks removed or unavailable variants', () => {
  const cart = [{id:'vant-001',size:'M',color:'Creme',quantity:2}];
  const lines = resolveCart(cart, [{...initialProducts[0],price:17900}]);
  assert.equal(cartTotal(lines),35800);
  assert.equal(resolveCart(cart,[])[0].available,false);
  assert.equal(resolveCart(cart,[{...initialProducts[0],hidden:true}])[0].available,false);
  assert.equal(resolveCart(cart,[{...initialProducts[0],sizes:['P']}])[0].available,false);
});

test('multi-item message includes variations, quantities, subtotals and integer-money total', () => {
  const lines = resolveCart([
    {id:'vant-001',size:'M',color:'Creme',quantity:2},
    {id:'vant-002',size:'G',color:'Preto',quantity:1},
  ], initialProducts);
  const message = makeCartMessage(lines,'https://example.test/');
  for (const text of ['Camiseta Logo Cream','Moletom Essential Preto','Tamanho: M','Tamanho: G','Quantidade: 2','318,00','319,00','637,00','#peca-vant-002','Frete']) assert.ok(message.includes(text),text);
  assert.throws(()=>makeCartMessage([], 'https://example.test/'));
  assert.throws(()=>makeCartMessage(resolveCart([{id:'gone',size:'M',color:'X',quantity:1}],[]),'https://example.test/'));
});

import {loadProducts} from './catalog.js';
export const KEY='vant-demo-products-v1';
export const STORE_PHONE='556993173172';
function read(key){try{return localStorage.getItem(key);}catch{return null;}}
export const readProducts=()=>loadProducts(read(KEY));
export const readPhone=()=>read('vant-demo-phone')||STORE_PHONE;

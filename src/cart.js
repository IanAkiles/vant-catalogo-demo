import {money} from './catalog.js';

export const CART_KEY='vant-cart-v1';
export const sameVariant=(a,b)=>a.id===b.id&&a.size===b.size&&a.color===b.color;
export function readCart(storage){
 try{
  const rows=JSON.parse((storage||localStorage).getItem(CART_KEY));
  if(!Array.isArray(rows))return [];
  const cart=[];
  for(const row of rows.slice(0,100)){
   if(!row||!['id','size','color'].every(key=>typeof row[key]==='string'&&row[key].trim()&&row[key].length<=160)||!Number.isInteger(row.quantity)||row.quantity<1||row.quantity>10)continue;
   const item={id:row.id,size:row.size,color:row.color,quantity:row.quantity,name:typeof row.name==='string'?row.name.slice(0,100):'Peça'};
   const previous=cart.find(p=>sameVariant(p,item));
   if(previous)previous.quantity=Math.min(10,previous.quantity+item.quantity);else cart.push(item);
  }
  return cart;
 }catch{return [];}
}
export function resolveCart(cart,products){
 return cart.map(item=>{
  const product=products.find(p=>p.id===item.id);
  return {...item,product,available:!!product&&!product.hidden&&product.sizes.includes(item.size)&&product.colors.includes(item.color)};
 });
}
export const cartTotal=lines=>lines.reduce((total,line)=>total+(line.available?line.product.price*line.quantity:0),0);
export function makeCartMessage(lines,url){
 if(!lines.length||lines.some(line=>!line.available))throw Error('Revise as peças da sacola.');
 const items=lines.map((line,index)=>`${index+1}. Produto: ${line.product.name}\nCódigo: ${line.id}\nTamanho: ${line.size}\nCor: ${line.color}\nQuantidade: ${line.quantity}\nValor unitário exibido: ${money(line.product.price)}\nSubtotal: ${money(line.product.price*line.quantity)}\nLink: ${url}#peca-${encodeURIComponent(line.id)}`);
 return `Olá! Vim pelo catálogo da VANT e gostaria de pedir:\n\n${items.join('\n\n')}\n\nTotal das peças: ${money(cartTotal(lines))}\nFrete: a combinar.\n\nPode confirmar a disponibilidade das peças e o valor da entrega?`;
}

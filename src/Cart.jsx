import React,{useState} from 'react';
import {Minus,Plus,WhatsappLogo,ShoppingBag} from '@phosphor-icons/react';
import {Artwork,Modal} from './ui.jsx';
import {money} from './catalog.js';
import {cartTotal,makeCartMessage} from './cart.js';

export default function Cart({lines,onClose,onQuantity,onRemove,phone,loading,error}){
 const [copyStatus,setCopyStatus]=useState('');
 const valid=lines.length>0&&!loading&&!error&&lines.every(line=>line.available);
 const message=valid?makeCartMessage(lines,location.origin+location.pathname):'';
 return <Modal title="SUA SACOLA" onClose={onClose}><div className="order cart">
  <span className="eyebrow">VANT / SUAS ESCOLHAS</span>
  <h2>{lines.length?'Do seu jeito. Tudo junto.':'Sua sacola está vazia.'}</h2>
  {!lines.length?<><ShoppingBag size={42}/><p>Escolha suas peças e reúna tudo em um só pedido.</p></>:<>
   <p>Revise suas peças antes de conversar com a loja.</p>
   <div className="cart-items">{lines.map((line,index)=>{
    const name=line.product?.name||line.name||'Peça indisponível';
    const label=`${name}, ${line.size}, ${line.color}`;
    return <article className="cart-item" key={JSON.stringify([line.id,line.size,line.color])}>
     {line.product?<Artwork type={line.product.art} image={line.product.image} label={name}/>:<div className="cart-missing"><ShoppingBag size={26}/></div>}
     <div className="cart-item-body"><h3>{name}</h3><p>Tamanho: {line.size} · Cor: {line.color}</p>
      {line.available?<><span className="cart-unit">{money(line.product.price)} por unidade</span><strong>{money(line.product.price*line.quantity)}</strong></>:<p className="cart-unavailable">{loading?'Verificando peça…':'Peça ou variação indisponível. Remova para continuar.'}</p>}
      <div className="cart-controls"><div className="quantity"><button className="icon" aria-label={`Diminuir quantidade de ${label}`} disabled={line.quantity===1} onClick={()=>onQuantity(index,line.quantity-1)}><Minus size={16}/></button><span aria-label={`Quantidade de ${label}`}>{line.quantity}</span><button className="icon" aria-label={`Aumentar quantidade de ${label}`} disabled={line.quantity===10||!line.available} onClick={()=>onQuantity(index,line.quantity+1)}><Plus size={16}/></button></div><button className="cart-remove" aria-label={`Remover ${label}`} onClick={()=>onRemove(index)}>Remover</button></div>
     </div>
    </article>;
   })}</div>
   {loading?<p role="status">Atualizando valores…</p>:error?<p role="alert">Não foi possível conferir o catálogo. Atualize a página antes de finalizar.</p>:<div className="order-total" aria-live="polite"><span>{lines.some(line=>!line.available)?'Total das peças disponíveis':'Total das peças'}</span><strong>{money(cartTotal(lines))}</strong></div>}
   <p className="fine">Preços conforme o catálogo atual. Frete, disponibilidade e pagamento serão confirmados pela loja. Até 10 unidades por tamanho e cor.</p>
   {valid&&/^55\d{10,11}$/.test(phone)&&<a className="primary" href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`} target="_blank" rel="noreferrer"><WhatsappLogo size={23}/>Finalizar no WhatsApp</a>}
   {valid&&!/^55\d{10,11}$/.test(phone)&&<p role="alert">WhatsApp da loja ainda não configurado.</p>}
   {valid&&<details className="cart-message"><summary>Ver mensagem do pedido</summary><pre>{message}</pre><button className="secondary" onClick={async()=>{try{await navigator.clipboard.writeText(message);setCopyStatus('Mensagem copiada.');}catch{setCopyStatus('Selecione o texto da mensagem para copiar.');}}}>Copiar mensagem</button>{copyStatus&&<p role="status">{copyStatus}</p>}</details>}
  </>}
  <button className="secondary" onClick={onClose}>Continuar comprando</button>
  {!!lines.length&&<p className="fine">No WhatsApp, revise a mensagem e toque em Enviar. Sua sacola continua aqui; o envio não reserva estoque.</p>}
 </div></Modal>;
}

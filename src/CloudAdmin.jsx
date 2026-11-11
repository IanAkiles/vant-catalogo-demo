import React,{useEffect,useState} from 'react';
import {Plus,Check,PencilSimple,Eye,EyeSlash,Trash,ArrowUpRight,SignOut} from '@phosphor-icons/react';
import {Artwork,Modal} from './ui.jsx';
import {categories,money,validateProduct} from './catalog.js';
import {fetchProducts,saveCloudProduct,setProductHidden,deleteCloudProduct} from './backend.js';
import {STORE_PHONE} from './storage.js';

export default function CloudAdmin({email,onLogout,loggingOut,authMessage}){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[loadError,setLoadError]=useState(false);
 const [editing,setEditing]=useState(null),[file,setFile]=useState(null),[preview,setPreview]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[deleting,setDeleting]=useState(null),[query,setQuery]=useState('');
 useEffect(()=>{let active=true;fetchProducts().then(rows=>{if(active)setProducts(rows);}).catch(()=>{if(active)setLoadError(true);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 useEffect(()=>{if(!file){setPreview('');return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url);},[file]);
 function edit(p){setEditing({...p});setFile(null);setMessage('');}
 async function save(event){event.preventDefault();if(busy)return;const form=new FormData(event.currentTarget);
  const value={...editing,name:form.get('name').trim(),price:Math.round(Number(form.get('price'))*100),category:form.get('category'),sizes:form.get('sizes').split(',').map(v=>v.trim()).filter(Boolean),colors:form.get('colors').split(',').map(v=>v.trim()).filter(Boolean),description:form.get('description').trim(),hidden:form.get('hidden')==='on'};
  const invalid=validateProduct(value);if(invalid){setMessage(invalid);return;}
  if(!file&&!value.image_path){setMessage('Adicione uma foto da peça.');return;}
  setBusy(true);setMessage('');
  try{const saved=await saveCloudProduct(value,file);setProducts(rows=>rows.some(p=>p.id===saved.id)?rows.map(p=>p.id===saved.id?saved:p):[saved,...rows]);setEditing(null);setFile(null);setMessage('Peça salva no catálogo.');}
  catch{setMessage('Não foi possível salvar. Seus campos foram mantidos. Confira a conexão e tente novamente.');}finally{setBusy(false);}
 }
 async function toggle(p){if(busy)return;setBusy(true);setMessage('');try{const saved=await setProductHidden(p.id,!p.hidden);setProducts(rows=>rows.map(row=>row.id===saved.id?saved:row));setMessage(saved.hidden?'Peça ocultada da vitrine.':'Peça publicada na vitrine.');}catch{setMessage('Não foi possível alterar a visibilidade. Tente novamente.');}finally{setBusy(false);}}
 async function remove(){if(busy)return;setBusy(true);setMessage('');try{await deleteCloudProduct(deleting.id);setProducts(rows=>rows.filter(p=>p.id!==deleting.id));setDeleting(null);setMessage('Peça excluída.');}catch{setMessage('Não foi possível excluir. A peça foi mantida.');setDeleting(null);}finally{setBusy(false);}}
 function upload(event){const next=event.target.files?.[0];if(!next)return;if(!['image/jpeg','image/png','image/webp'].includes(next.type)||next.size>1500000){setMessage('Escolha JPG, PNG ou WebP de até 1,5 MB.');event.target.value='';return;}setFile(next);setMessage('');}
 const filtered=products.filter(p=>p.name.toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
 return <div className="owner-page"><header className="owner-header"><a href="/" aria-label="VANT vitrine"><Artwork type="logo" label="VANT"/></a><span>PAINEL DA LOJA</span><a className="secondary" href="/" target="_blank" rel="noopener">Ver vitrine <ArrowUpRight size={18}/></a><button className="icon" aria-label="Sair do painel" disabled={busy||loggingOut} onClick={onLogout}><SignOut size={22}/></button></header>
 <main className="owner-main"><div className="owner-intro"><span className="eyebrow">SUA LOJA / {email}</span><h1>Seu catálogo, atualizado.</h1><p>Organize suas peças e publique quando estiverem prontas.</p></div>
 <section className="owner-stats" aria-label="Resumo do catálogo"><div><strong>{products.length}</strong><span>Peças cadastradas</span></div><div><strong>{products.filter(p=>!p.hidden).length}</strong><span>Na vitrine</span></div><div><strong>{products.filter(p=>p.hidden).length}</strong><span>Ocultas</span></div></section>
 <div className="admin">{authMessage&&<p className="demo-note" role="status">{authMessage}</p>}<div className="admin-title"><div><span className="eyebrow">SEU CATÁLOGO</span><h2>Gerencie suas peças.</h2></div><button className="primary" disabled={busy||loading||loadError} onClick={()=>edit({id:crypto.randomUUID(),name:'',price:0,category:'Camisetas',sizes:['P','M','G'],colors:[],description:'',hidden:true,image_path:null})}><Plus size={19}/>Nova peça</button></div>
 {message&&<p className="demo-note" role="status">{message}</p>}
 {loading?<p role="status">Carregando peças…</p>:loadError?<div role="alert"><p>Não foi possível carregar o catálogo.</p><button className="secondary" onClick={()=>location.reload()}>Tentar novamente</button></div>:editing?
 <form key={editing.id} className="edit-form" onSubmit={save}><h3>{products.some(p=>p.id===editing.id)?'Editar peça':'Cadastrar peça'}</h3><fieldset disabled={busy} className="editor-fields">
 <label>Nome<input name="name" maxLength={100} required defaultValue={editing.name}/></label>
 <div className="form-row"><label>Preço (R$)<input name="price" type="number" min="0.01" max="99999" step="0.01" required defaultValue={editing.price/100||''}/></label><label>Categoria<select name="category" defaultValue={editing.category}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label></div>
 <div className="form-row"><label>Tamanhos, separados por vírgula<input name="sizes" required maxLength={160} defaultValue={editing.sizes.join(', ')}/></label><label>Cores, separadas por vírgula<input name="colors" required maxLength={160} defaultValue={editing.colors.join(', ')}/></label></div>
 <label>Descrição<textarea name="description" maxLength={500} rows={3} defaultValue={editing.description}/></label>
 <label>Foto da peça<input type="file" accept="image/jpeg,image/png,image/webp" onChange={upload}/><small>JPG, PNG ou WebP até 1,5 MB. Prefira foto vertical, proporção 3:4.</small></label>
 {(preview||editing.image)&&<img className="upload-preview" src={preview||editing.image} alt="Prévia da foto da peça"/>}
 <label className="checkbox-label"><input type="checkbox" name="hidden" defaultChecked={editing.hidden}/>Manter oculta na vitrine</label>
 <p className="fine">Desmarque para publicar. Confirme preço, tamanhos e foto antes de salvar.</p>
 <div className="form-actions"><button type="button" className="secondary" onClick={()=>{setEditing(null);setFile(null);}}>Cancelar</button><button type="submit" className="primary"><Check size={19}/>{busy?'Salvando…':'Salvar peça'}</button></div>
 </fieldset></form>:
 <><label>Buscar peça<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nome da peça"/></label><div className="admin-list">{filtered.map(p=><div className="admin-row" key={p.id}><Artwork image={p.image} label={p.name}/><div><strong>{p.name}</strong><span>{money(p.price)} · {p.hidden?'Oculta':'Publicada'}</span></div><button className="icon" disabled={busy} aria-label={`Editar ${p.name}`} onClick={()=>edit(p)}><PencilSimple size={21}/></button><button className="icon" disabled={busy} aria-label={`${p.hidden?'Publicar':'Ocultar'} ${p.name}`} onClick={()=>toggle(p)}>{p.hidden?<EyeSlash size={21}/>:<Eye size={21}/>}</button><button className="icon" disabled={busy} aria-label={`Excluir ${p.name}`} onClick={()=>setDeleting(p)}><Trash size={21}/></button></div>)}</div>{!filtered.length&&<p>{products.length?'Nenhuma peça encontrada.':'Seu catálogo está vazio. Comece cadastrando a primeira peça.'}</p>}</>}
 <p className="fine">Pedidos pelo WhatsApp: +55 69 9317-3172 ({STORE_PHONE}).</p>
 </div></main>
 {deleting&&<Modal title="EXCLUIR PEÇA" onClose={()=>{if(!busy)setDeleting(null);}}><div className="order"><h2>Excluir {deleting.name}?</h2><p>O cadastro será removido. Você também pode cancelar e apenas ocultar a peça.</p><button className="primary" disabled={busy} onClick={remove}>{busy?'Excluindo…':'Excluir peça'}</button><button className="secondary" disabled={busy} onClick={()=>setDeleting(null)}>Cancelar</button></div></Modal>}
 </div>;
}

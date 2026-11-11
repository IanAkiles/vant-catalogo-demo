import {createClient} from '@supabase/supabase-js';
import {backendConfig} from './backend-config.js';
import {validateProduct} from './catalog.js';

export const config=backendConfig(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
export const backend=config.mode==='cloud'?createClient(config.url,config.key):null;
const bucket='product-photos';
const columns='id,name,price,category,sizes,colors,description,hidden,image_path,created_at';
function checked(result){if(result.error)throw result.error;return result.data;}
function product(row){return {...row,image:row.image_path?backend.storage.from(bucket).getPublicUrl(row.image_path).data.publicUrl:'',art:'tee'};}
export async function fetchProducts(publicOnly=false){
 let query=backend.from('products').select(columns).order('created_at',{ascending:false});
 if(publicOnly)query=query.eq('hidden',false);
 return checked(await query).map(product);
}
export async function isOwner(){return checked(await backend.rpc('is_store_owner'))===true;}
export async function saveCloudProduct(value,file){
 const invalid=validateProduct(value);if(invalid)throw Error(invalid);
 let path=value.image_path||null;
 if(file){
  const extensions={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
  if(!extensions[file.type]||file.size>1500000)throw Error('Escolha JPG, PNG ou WebP de até 1,5 MB.');
  path=`${value.id}/${crypto.randomUUID()}.${extensions[file.type]}`;
  checked(await backend.storage.from(bucket).upload(path,file,{upsert:false,contentType:file.type}));
 }
 if(!path)throw Error('Adicione uma foto antes de salvar a peça.');
 const row={id:value.id,name:value.name,price:value.price,category:value.category,sizes:value.sizes,colors:value.colors,description:value.description,hidden:value.hidden,image_path:path};
 try{return product(checked(await backend.from('products').upsert(row).select(columns).single()));}
 catch(error){if(file)await backend.storage.from(bucket).remove([path]);throw error;}
 // Old photos are retained so another open editor cannot lose its referenced image.
}
export async function setProductHidden(id,hidden){return product(checked(await backend.from('products').update({hidden}).eq('id',id).select(columns).single()));}
export async function deleteCloudProduct(id){checked(await backend.from('products').delete().eq('id',id).select('id').single());}

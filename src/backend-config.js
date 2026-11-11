export function backendConfig(url='',key=''){
 if(!url&&!key)return {mode:'demo'};
 try{
  const parsed=new URL(url);
  if(parsed.protocol!=='https:'||parsed.username||parsed.password||parsed.pathname!=='/'||parsed.search||parsed.hash)throw Error();
  let allowed=key.startsWith('sb_publishable_');
  if(!allowed){const payload=JSON.parse(atob(key.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));allowed=payload.role==='anon';}
  if(!allowed)throw Error();
  return {mode:'cloud',url:parsed.origin,key};
 }catch{return {mode:'invalid'};}
}

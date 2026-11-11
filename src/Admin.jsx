import React,{lazy,Suspense,useEffect,useState} from 'react';
import {ArrowUpRight} from '@phosphor-icons/react';
import {Artwork} from './ui.jsx';
import {backend,config,isOwner} from './backend.js';
import CloudAdmin from './CloudAdmin.jsx';
const DemoAdmin=lazy(()=>import('./DemoAdmin.jsx'));

function Shell({children}){return <div className="owner-page"><header className="owner-header"><a href="/" aria-label="VANT vitrine"><Artwork type="logo" label="VANT"/></a><span>PAINEL DA LOJA</span><a className="secondary" href="/">Ver vitrine <ArrowUpRight size={18}/></a></header><main className="owner-main">{children}</main></div>;}
export default function Admin(){
 const [session,setSession]=useState(null),[ready,setReady]=useState(false),[access,setAccess]=useState('checking');
 const [recovery,setRecovery]=useState(false),[reset,setReset]=useState(false),[demo,setDemo]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>{document.title='Painel VANT — Acesso';if(!backend)return;
  let active=true;
  const {data:{subscription}}=backend.auth.onAuthStateChange((event,next)=>{if(!active)return;setSession(next);setAccess('checking');setReady(true);if(event==='PASSWORD_RECOVERY')setRecovery(true);if(event==='SIGNED_OUT')setRecovery(false);});
  backend.auth.getSession().then(({data,error})=>{if(active){setSession(data.session);setReady(true);if(error)setMessage('Não foi possível recuperar sua sessão. Entre novamente.');}}).catch(()=>{if(active){setReady(true);setMessage('Não foi possível conectar. Tente novamente.');}});
  return()=>{active=false;subscription.unsubscribe();};
 },[]);
 useEffect(()=>{let active=true;if(!session){setAccess('checking');return;}isOwner().then(allowed=>{if(active)setAccess(allowed?'owner':'denied');}).catch(()=>{if(active)setAccess('error');});return()=>{active=false;};},[session]);
 async function submit(event){event.preventDefault();setBusy(true);setMessage('');const data=new FormData(event.currentTarget);
  try{
   if(recovery){if(data.get('password')!==data.get('confirm')){setMessage('As senhas precisam ser iguais.');return;}const {error}=await backend.auth.updateUser({password:data.get('password')});if(error)throw error;setRecovery(false);setMessage('Senha atualizada.');}
   else if(reset){const {error}=await backend.auth.resetPasswordForEmail(data.get('email'),{redirectTo:location.origin+'/admin'});if(error)throw error;setMessage('Se o endereço estiver cadastrado, você receberá as instruções por e-mail.');}
   else {const {error}=await backend.auth.signInWithPassword({email:data.get('email'),password:data.get('password')});if(error)throw error;}
  }catch{setMessage(reset?'Não foi possível solicitar a recuperação. Tente novamente mais tarde.':recovery?'Não foi possível atualizar a senha. Solicite um novo link.':'Não foi possível entrar. Confira os dados e sua conexão.');}finally{setBusy(false);}
 }
 async function logout(){setBusy(true);const {error}=await backend.auth.signOut();if(error)setMessage('Não foi possível sair. Tente novamente.');setBusy(false);}
 if(config.mode!=='cloud'){
  if(demo&&config.mode==='demo')return <Suspense fallback={<p>Carregando demonstração…</p>}><DemoAdmin/></Suspense>;
  return <Shell><section className="auth-card"><span className="eyebrow">ADMINISTRAÇÃO VANT</span><h1>{config.mode==='invalid'?'Conexão precisa de revisão.':'Painel aguardando ativação.'}</h1><p>{config.mode==='invalid'?'A configuração do serviço está incompleta ou inválida. O acesso permanece bloqueado.':'O acesso da proprietária será liberado após conectar o serviço de login, fotos e catálogo.'}</p>{config.mode==='demo'&&<><p className="fine">A demonstração abaixo usa somente dados deste navegador. Não altera uma loja publicada.</p><button className="secondary" onClick={()=>setDemo(true)}>Explorar demonstração local</button></>}</section></Shell>;
 }
 if(!ready)return <Shell><p role="status">Verificando sessão…</p></Shell>;
 if(session&&!recovery){
  if(access==='owner')return <CloudAdmin email={session.user.email} onLogout={logout} loggingOut={busy} authMessage={message}/>;
  return <Shell><section className="auth-card"><h1>{access==='checking'?'Verificando acesso…':access==='denied'?'Acesso não autorizado.':'Não foi possível verificar seu acesso.'}</h1><p>{access==='denied'?'Esta conta não está autorizada a administrar a VANT.':access==='error'?'Confira sua conexão e tente novamente.':''}</p>{access==='error'&&<button className="secondary" onClick={()=>location.reload()}>Tentar novamente</button>}<button className="secondary" disabled={busy} onClick={logout}>Sair</button>{message&&<p role="alert">{message}</p>}</section></Shell>;
 }
 return <Shell><section className="auth-card"><span className="eyebrow">ACESSO DA PROPRIETÁRIA</span><h1>{recovery?'Defina sua nova senha.':reset?'Recuperar acesso.':'Sua loja começa aqui.'}</h1><p>{recovery?'Escolha uma senha com pelo menos 12 caracteres.':reset?'Enviaremos as instruções para o e-mail cadastrado.':'Entre para cuidar das peças e atualizar sua vitrine.'}</p><form className="admin auth-form" onSubmit={submit}>
 {!recovery&&<label>E-mail<input type="email" name="email" autoComplete="username" required maxLength={254}/></label>}
 {(!reset||recovery)&&<label>{recovery?'Nova senha':'Senha'}<input type="password" name="password" autoComplete={recovery?'new-password':'current-password'} minLength={recovery?12:undefined} required/></label>}
 {recovery&&<label>Confirme a senha<input type="password" name="confirm" autoComplete="new-password" minLength={12} required/></label>}
 <button className="primary" disabled={busy}>{busy?'Aguarde…':recovery?'Salvar nova senha':reset?'Enviar instruções':'Entrar no painel'}</button>
 </form>{!recovery&&<button className="auth-switch" disabled={busy} onClick={()=>{setReset(!reset);setMessage('');}}>{reset?'Voltar para entrar':'Esqueci minha senha'}</button>}{message&&<p role="status" className="demo-note">{message}</p>}</section></Shell>;
}

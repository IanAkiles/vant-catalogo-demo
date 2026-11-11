import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PGlite} from '@electric-sql/pglite';

test('database enforces owner-only writes and hides unpublished pieces',async()=>{
 const db=new PGlite();
 try{
  // Minimal Auth/Storage schema fixtures; policies run in a real embedded Postgres engine.
  await db.exec(`create role anon; create role authenticated; create schema auth; create schema storage;
   create table auth.users(id uuid primary key);
   create function auth.uid() returns uuid language sql stable as $$select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid$$;
   grant usage on schema auth,storage to anon,authenticated;
   create table storage.buckets(id text primary key,name text,public boolean,file_size_limit bigint,allowed_mime_types text[]);
   create table storage.objects(id uuid default gen_random_uuid(),bucket_id text,name text);
   alter table storage.objects enable row level security;
   grant select,insert,delete on storage.objects to anon,authenticated;`);
  await db.exec(await readFile(new URL('../supabase/migrations/202611110001_catalog.sql',import.meta.url),'utf8'));
  const owner='00000000-0000-0000-0000-000000000001',stranger='00000000-0000-0000-0000-000000000002';
  await db.query('insert into auth.users values ($1),($2)',[owner,stranger]);
  await db.query('insert into private.store_owners values ($1)',[owner]);
  async function as(role,user,fn){await db.exec(`begin; set local role ${role};`);try{await db.query("select set_config('request.jwt.claim.sub',$1,true)",[user]);return await fn();}finally{await db.exec('rollback');}}
  const insert=`insert into public.products(name,price,category,sizes,colors,hidden,image_path) values ('Teste',15900,'Camisetas',array['M'],array['Creme'],false,'00000000-0000-0000-0000-000000000003/00000000-0000-0000-0000-000000000004.jpg') returning id`;
  await assert.rejects(as('anon','',()=>db.query(insert)));
  await assert.rejects(as('authenticated',stranger,()=>db.query(insert)));
  await as('authenticated',owner,async()=>{assert.equal((await db.query(insert)).rows.length,1);});
  const {rows:[row]}=await db.query(insert);
  await db.query(`insert into public.products(name,price,category,sizes,colors,hidden,image_path) select 'Oculta',price,category,sizes,colors,true,image_path from public.products where id=$1`,[row.id]);
  for(const [role,user,expected] of [['anon','',1],['authenticated',stranger,1],['authenticated',owner,2]]){
   await as(role,user,async()=>assert.equal((await db.query('select * from public.products')).rows.length,expected));
  }
  await as('authenticated',stranger,async()=>{
   assert.equal((await db.query('update public.products set price=1 returning id')).rows.length,0);
   assert.equal((await db.query('delete from public.products returning id')).rows.length,0);
  });
  await assert.rejects(as('authenticated',stranger,()=>db.query('insert into private.store_owners values ($1)',[stranger])));
  await as('authenticated',owner,async()=>{assert.equal((await db.query('update public.products set hidden=true returning id')).rows.length,2);assert.equal((await db.query('delete from public.products returning id')).rows.length,2);});
  for(const [role,user] of [['anon',''],['authenticated',stranger]])await assert.rejects(as(role,user,()=>db.query("insert into storage.objects(bucket_id,name) values ('product-photos','test.jpg')")));
  await as('authenticated',owner,async()=>{await db.query("insert into storage.objects(bucket_id,name) values ('product-photos','test.jpg')");});
  await assert.rejects(as('authenticated',owner,()=>db.query("insert into storage.objects(bucket_id,name) values ('another-bucket','test.jpg')")));
  await assert.rejects(as('authenticated',owner,()=>db.query("update public.products set sizes=array['']")));
  await assert.rejects(as('authenticated',owner,()=>db.query('update public.products set price=-1')));
 }finally{await db.close();}
});

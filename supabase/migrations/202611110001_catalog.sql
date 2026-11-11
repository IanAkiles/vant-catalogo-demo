-- Apply once to a new Supabase project. No owner is granted automatically.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.store_owners (
 user_id uuid primary key references auth.users(id) on delete cascade
);
revoke all on private.store_owners from public, anon, authenticated;

create function public.is_store_owner() returns boolean
language sql stable security definer set search_path = '' as $$
 select exists(select 1 from private.store_owners where user_id=(select auth.uid()));
$$;
revoke all on function public.is_store_owner() from public;
grant execute on function public.is_store_owner() to anon, authenticated;

create function public.valid_variants(values_ text[]) returns boolean
language sql immutable set search_path = '' as $$
 select coalesce(cardinality(values_) between 1 and 20 and
 not exists(select 1 from unnest(values_) v where v is null or length(trim(v)) not between 1 and 40),false);
$$;

create table public.products (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 100),
 price integer not null check(price between 1 and 9999900),
 category text not null check(category in ('Camisetas','Moletons','Calças','Acessórios')),
 sizes text[] not null check(public.valid_variants(sizes)),
 colors text[] not null check(public.valid_variants(colors)),
 description text not null default '' check(length(description)<=500),
 hidden boolean not null default true,
 image_path text not null check(image_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp)$'),
 created_at timestamptz not null default now()
);
alter table public.products enable row level security;
revoke all on public.products from anon, authenticated;
grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
create policy "Visitors see published pieces" on public.products for select to anon, authenticated using (not hidden);
create policy "Owners see every piece" on public.products for select to authenticated using ((select public.is_store_owner()));
create policy "Owners create pieces" on public.products for insert to authenticated with check ((select public.is_store_owner()));
create policy "Owners update pieces" on public.products for update to authenticated using ((select public.is_store_owner())) with check ((select public.is_store_owner()));
create policy "Owners delete pieces" on public.products for delete to authenticated using ((select public.is_store_owner()));

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('product-photos','product-photos',true,1500000,array['image/jpeg','image/png','image/webp']);
create policy "Owners upload product photos" on storage.objects for insert to authenticated
with check (bucket_id='product-photos' and (select public.is_store_owner()));
create policy "Owners read photo metadata" on storage.objects for select to authenticated
using (bucket_id='product-photos' and (select public.is_store_owner()));
create policy "Owners remove unused photos" on storage.objects for delete to authenticated
using (bucket_id='product-photos' and (select public.is_store_owner()));
commit;

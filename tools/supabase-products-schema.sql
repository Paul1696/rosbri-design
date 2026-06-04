create table if not exists public.products (
  id integer primary key,
  title text not null,
  category text not null,
  price text not null,
  image text not null,
  description text not null default '',
  is_pack boolean not null default false,
  visible boolean not null default true,
  reviews jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
before update on public.products
for each row execute function public.set_products_updated_at();

alter table public.products enable row level security;

drop policy if exists "Public can read visible products" on public.products;
create policy "Public can read visible products"
on public.products for select
using (visible = true);

drop policy if exists "Authenticated can manage products" on public.products;
create policy "Authenticated can manage products"
on public.products for all
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read product images" on storage.objects;
create policy "Public can read product images"
on storage.objects for select
using (bucket_id = 'product-images');

drop policy if exists "Authenticated can upload product images" on storage.objects;
create policy "Authenticated can upload product images"
on storage.objects for insert
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
);

drop policy if exists "Authenticated can update product images" on storage.objects;
create policy "Authenticated can update product images"
on storage.objects for update
using (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
)
with check (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
);

drop policy if exists "Authenticated can delete product images" on storage.objects;
create policy "Authenticated can delete product images"
on storage.objects for delete
using (
  bucket_id = 'product-images'
  and auth.role() = 'authenticated'
);

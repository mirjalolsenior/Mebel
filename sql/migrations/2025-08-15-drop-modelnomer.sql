do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='products' and column_name in ('modelnomer','model')
  ) then
    execute 'alter table public.products drop column if exists modelnomer';
    execute 'alter table public.products drop column if exists model';
  end if;
end$$;
-- Supabase SQL schema for Mebel Dashboard
create extension if not exists "pgcrypto";

create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  model text,
  purchase_price numeric not null,
  paid_amount numeric default 0,
  quantity integer default 0,
  delivery_date date,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  product_type text,
  model text,
  quantity numeric default 0,
  paid_amount numeric default 0,
  remaining numeric default 0,
  delivery_date date,
  created_at timestamptz default now()
);

create table if not exists clients (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brought_quantity numeric default 0,
  tape_used integer default 0,
  paid_amount numeric default 0,
  remaining_amount numeric default 0,
  created_at timestamptz default now()
);

create table if not exists custom_section (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  brought_quantity numeric default 0,
  tape_used integer default 0,
  paid_amount numeric default 0,
  remaining_amount numeric default 0,
  created_at timestamptz default now()
);

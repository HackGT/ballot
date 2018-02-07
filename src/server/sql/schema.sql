CREATE TABLE public.users (
   email text primary key, 
   name text not null, 
   hash text not null, 
   salt text not null,
   userClass smallint not null default 0,
   created timestamptz default now()
)


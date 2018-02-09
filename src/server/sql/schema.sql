CREATE TABLE public.users (
   userId serial primary key,
   email text not null UNIQUE, 
   name text not null, 
   hash text not null, 
   salt text not null,
   userClass smallint not null default 0,
   created timestamptz default now()
)


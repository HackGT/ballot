CREATE TABLE public.users (
   userId serial primary key,
   email text not null UNIQUE, 
   name text not null, 
   userClass smallint not null default 0,
   hash text, 
   salt text,
   github text,
   google text,
   facebook text,
   created timestamptz default now()
)
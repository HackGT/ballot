CREATE TABLE users (
   user_id serial primary key,
   email text not null UNIQUE, 
   name text not null, 
   user_class smallint not null default 0,
   hash text, 
   salt text,
   github text,
   google text,
   facebook text,
   created timestamptz default now()
)

CREATE TABLE ballots (
    ballot_id serial primary key,
    priority int not null,
    status smallint not null,
    project_id integer references projects not null ,
    criteria_id integer references criteria not null ,
    user_id integer references users not null ,
    score int
)

create TABLE projects (
    project_id serial primary key,
    devpost_id text not null UNIQUE,
    name text not null,
    table_number integer, 
    expo_number integer
)

create TABLE categories (
    category_id serial primary key,
    name text not null,
    isPrimary smallint not null
)

create TABLE criteria (
    criteria_id serial primary key,
    name text not null,
    rubric text,
    min_score smallint,
    max_score smallint,
    category_id integer references categories not null
)

create TABLE projectCategories(
    project_id integer references projects,
    category_id integer references categories
)
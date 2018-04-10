DROP TYPE IF EXISTS userclass CASCADE;
CREATE TYPE userclass AS ENUM ('Pending', 'Judge', 'Admin', 'Owner');

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    user_id serial PRIMARY KEY,
    email character varying(254) NOT NULL UNIQUE,
    name character varying(64) NOT NULL,
    user_class userclass NOT NULL DEFAULT 'Pending',
    salt character varying(64),
    hash character varying(256),
    github text,
    google text,
    facebook text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS projects CASCADE;
CREATE TABLE projects (
    project_id serial PRIMARY KEY,
    devpost_id text NOT NULL UNIQUE,
    name character varying(64) NOT NULL,
    table_number smallint,
    expo_number smallint,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    category_id serial PRIMARY KEY,
    name character varying(64) NOT NULL,
    is_primary boolean NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DROP TABLE IF EXISTS criteria CASCADE;
CREATE TABLE criteria (
    criteria_id serial PRIMARY KEY,
    name character varying(64) NOT NULL,
    rubric character varying(512),
    min_score smallint,
    max_score smallint,
    category_id integer NOT NULL REFERENCES categories,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DROP TYPE IF EXISTS ballotstatus CASCADE;
CREATE TYPE ballotstatus AS ENUM('Pending', 'Assigned', 'Submitted', 'Skipped');

DROP TABLE IF EXISTS ballots;
CREATE TABLE ballots (
    ballot_id serial PRIMARY KEY,
    project_id integer NOT NULL REFERENCES projects,
    criteria_id integer NOT NULL REFERENCES criteria,
    user_id integer NOT NULL REFERENCES users,
    judge_priority integer NOT NULL,
    ballot_status ballotstatus NOT NULL,
    score smallint,
    score_submitted_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DROP FUNCTION IF EXISTS set_score_submit_time();
CREATE FUNCTION set_score_submit_time()
RETURNS TRIGGER AS $$
BEGIN
    NEW.score_submitted_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ballot_score_submit_time
    BEFORE UPDATE 
    ON public.ballots
    FOR EACH ROW
    WHEN (OLD.score IS DISTINCT FROM NEW.score)
    EXECUTE PROCEDURE public.set_score_submit_time();

DROP TABLE IF EXISTS project_categories;
CREATE TABLE project_categories (
    project_id integer NOT NULL REFERENCES projects,
    category_id integer NOT NULL REFERENCES categories,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

DROP trigger if exists modify_updated_at_on_update on projects;
drop function if exists modify_updated_at();
drop table if exists projects;
drop table if exists audios;
drop table if exists users;

CREATE TABLE IF NOT EXISTS users
(
    id SERIAL NOT NULL PRIMARY KEY,
    email VARCHAR(40) UNIQUE NOT NULL,
    lname VARCHAR(40) NOT NULL,
    fname VARCHAR(40) NOT NULL,
    password CHARACTER(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS audios
(
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(40) NOT NULL,
    amplitudeOverTime double precision []
);

CREATE TABLE IF NOT EXISTS projects
(
    id SERIAL NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(40) NOT NULL,
    tracks JSON NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION modify_updated_at()	
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;	
END;
$$ language 'plpgsql';

CREATE TRIGGER modify_updated_at_on_update BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE modify_updated_at();

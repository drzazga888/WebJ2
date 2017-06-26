drop table users;

drop table projects;

drop table samples;

CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    email VARCHAR(40) UNIQUE,
    lname VARCHAR(40),
    fname VARCHAR(40),
    password CHARACTER(40)
);

CREATE TABLE IF NOT EXISTS projects
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(40),
    tracks JSON,
    created_at DATE,
    updated_at DATE
);

CREATE TABLE IF NOT EXISTS samples
(
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(40)
);
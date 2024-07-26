-- +goose Up
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    author_id TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL
);

-- +goose Down
DROP TABLE posts;
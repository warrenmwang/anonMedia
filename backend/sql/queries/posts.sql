-- name: CreatePost :exec
INSERT INTO posts 
(author_id, title, body) VALUES ($1, $2, $3);

-- name: GetPosts :many
SELECT * FROM posts 
LIMIT $1 OFFSET $2;
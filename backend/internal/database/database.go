package database

import (
	"backend/internal/database/sqlc"
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/jackc/pgx/v5/stdlib"
)

type Post struct {
	AuthorId string `json:"authorId"`
	Title    string `json:"title"`
	Body     string `json:"body"`
}

type Service interface {
	CreatePost(post Post) error
	GetPosts(limit, offset int32) ([]Post, error)
}

type service struct {
	db *sqlc.Queries
}

func (s *service) CreatePost(post Post) error {
	ctx := context.Background()
	err := s.db.CreatePost(ctx, sqlc.CreatePostParams{
		AuthorID: post.AuthorId,
		Title:    post.Title,
		Body:     post.Body,
	})
	return err
}

func (s *service) GetPosts(limit, offset int32) ([]Post, error) {
	ctx := context.Background()

	postsSQLC, err := s.db.GetPosts(ctx, sqlc.GetPostsParams{
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		return nil, err
	}

	var posts []Post
	for _, p := range postsSQLC {
		posts = append(posts, Post{
			AuthorId: p.AuthorID,
			Title:    p.Title,
			Body:     p.Body,
		})
	}
	return posts, nil
}

func New() Service {
	database := os.Getenv("DB_DATABASE")
	password := os.Getenv("DB_PASSWORD")
	username := os.Getenv("DB_USERNAME")
	port := os.Getenv("DB_PORT")
	host := os.Getenv("DB_HOST")

	// Raw sql connection
	connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable", username, password, host, port, database)
	db, err := sql.Open("pgx", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Instantiate the sqlc queries object for querying
	db_queries := sqlc.New(db)

	return &service{
		db: db_queries,
	}
}

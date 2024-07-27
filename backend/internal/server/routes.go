package server

import (
	"backend/internal/database"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func (s *Server) corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")

		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		// Handle cors preflight if method is OPTIONS
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		// Otherwise pass to the handler
		next.ServeHTTP(w, r)
	})
}

func (s *Server) RegisterRoutes() http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(s.corsMiddleware)

	r.Get("/posts", s.getPostsHandler)
	r.Put("/posts", s.createPostsHandler)

	return r
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	response, err := json.Marshal(payload)
	if err != nil {
		log.Fatal(err)
	}
	w.Write(response)
}

func respondWithError(w http.ResponseWriter, code int, errStr string) {
	http.Error(w, errors.New(errStr).Error(), code)
}

func (s *Server) getPostsHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	limitStr := query.Get("limit")
	offsetStr := query.Get("offset")
	var limit int32
	var offset int32

	if limitStr == "" {
		limit = 100
	} else {
		tmp, err := strconv.Atoi(limitStr)
		if err != nil {
			respondWithError(w, 400, "limit invalid")
			return
		}
		limit = int32(tmp)
	}

	if offsetStr == "" {
		offset = 0
	} else {
		tmp, err := strconv.Atoi(offsetStr)
		if err != nil {
			respondWithError(w, 400, "offset invalid")
			return
		}
		offset = int32(tmp)
	}

	posts, err := s.db.GetPosts(limit, offset)
	if err != nil {
		respondWithError(w, 500, "couldn't get requested posts")
		return
	}

	respondWithJSON(w, 200, posts)
}

func (s *Server) createPostsHandler(w http.ResponseWriter, r *http.Request) {
	MAX_SIZE := 10 << 10 // 10 KiB
	r.Body = http.MaxBytesReader(w, r.Body, int64(MAX_SIZE))

	err := r.ParseMultipartForm(int64(MAX_SIZE) + 512)
	if err != nil {
		respondWithError(w, 400, "too large input")
		return
	}

	postFormData := r.FormValue("post")
	var postData database.Post
	err = json.Unmarshal([]byte(postFormData), &postData)
	if err != nil {
		respondWithError(w, 500, "problem unmarshaling post data")
		return
	}

	err = s.db.CreatePost(postData)
	if err != nil {
		respondWithError(w, 500, "couldn't create post in db")
		return
	}

	w.WriteHeader(201)
}

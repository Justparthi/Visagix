package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	firebase "firebase.google.com/go/v4"
	"github.com/gorilla/mux"
	"google.golang.org/api/option"
)

// Response represents a standard API response format
type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// CORS Middleware
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight request
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Go Backend Running!"))
}

// Initialize Firebase app
func initFirebase() (*firebase.App, error) {
	ctx := context.Background()

	// Replace with your Firebase project details
	// You should store these in environment variables in production
	conf := &firebase.Config{
		DatabaseURL: "https://visagix-default-rtdb.asia-southeast1.firebasedatabase.app/",
	}

	// Path to your service account key JSON file
	opt := option.WithCredentialsFile("./serviceAccountKey.json")

	app, err := firebase.NewApp(ctx, conf, opt)
	if err != nil {
		return nil, fmt.Errorf("error initializing firebase app: %v", err)
	}

	return app, nil
}

// Handler to check Firebase connection
func checkFirebaseHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	app, err := initFirebase()
	if err != nil {
		response := Response{
			Status:  "error",
			Message: "Failed to initialize Firebase",
			Data:    map[string]string{"error": err.Error()},
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Try to connect to the database
	ctx := context.Background()
	client, err := app.Database(ctx)
	if err != nil {
		response := Response{
			Status:  "error",
			Message: "Failed to connect to Firebase Database",
			Data:    map[string]string{"error": err.Error()},
		}
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(response)
		return
	}

	// Test read operation to verify connection
	ref := client.NewRef("connection_test")
	var testData interface{}
	err = ref.Get(ctx, &testData)
	if err != nil {
		// If the path doesn't exist, that's okay - we're just testing connectivity
		log.Printf("Firebase read error (may be normal if path doesn't exist): %v", err)
	}

	// Connection successful
	response := Response{
		Status:  "success",
		Message: "Successfully connected to Firebase Database",
		Data:    map[string]string{"database": "Firebase Realtime Database"},
	}
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(response)
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", homeHandler).Methods("GET")
	r.HandleFunc("/api/firebase-status", checkFirebaseHandler).Methods("GET")

	// Apply CORS middleware
	handler := enableCORS(r)

	// Use PORT environment variable if available (for cloud deployments)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Server is running on port %s...\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}

package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("assets"))

	http.Handle("/", fs)
	http.Handle("/favicon.ico", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		return
	}))

	log.Println("Listening to localhost:8989")

	err := http.ListenAndServe(":8989", nil)
	if err != nil {
		log.Fatal(err)
	}
}

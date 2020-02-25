package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("assets"))
	http.Handle("/", fs)

	log.Println("Listening to localhost:8888")

	err := http.ListenAndServe(":8888", nil)
	if err != nil {
		log.Fatal(err)
	}

	// err := http.ListenAndServeTLS(":8443", "server.crt", "server.key", nil)
	// if err != nil {
	// 	log.Fatal(err)
	// }
}

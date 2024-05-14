package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var connectedUsers = make(map[*websocket.Conn]string)

func renderTemplate(w http.ResponseWriter, templateFile string, data interface{}) {
	tmpl, err := template.ParseFiles(templateFile)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = tmpl.Execute(w, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

}

var (
	maxConnections     = 4
	currentConnections int
)

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	if currentConnections >= maxConnections {
		log.Println("Too many connections, rejecting new connection")
		http.Error(w, "Too many connections", http.StatusTooManyRequests)
		return
	}

	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	currentConnections++
	defer func() {

		currentConnections--

		// time.Sleep(20 * time.Second)
		// redirectToNewPage(w, r)
	}()

	log.Println("New client connected")

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			log.Println("Read error:", err)
			return
		}

		var data map[string]interface{}
		err = json.Unmarshal(message, &data)
		if err != nil {
			log.Println("JSON parse error:", err)
			continue
		}

		if data["type"].(string) == "playerJoined" {
			playerName := data["playerName"].(string)
			connectedUsers[conn] = playerName
			broadcastUsersUpdate()
			// fmt.Print("broadcast")
		
		}
		if data["type"].(string) == "timer" {
			levelFloat := data["level"].(float64)
		
			
			timer := int(levelFloat)
		
			broadcastTimerLevel(timer)
			fmt.Println(timer)
		}
		
	}
}

func broadcastUsersUpdate() {
	var users []string
	for _, username := range connectedUsers {
		users = append(users, username)
	}

	message := map[string]interface{}{
		"type":  "usersUpdate",
		"users": users,
	
	}

	for conn := range connectedUsers {
		err := conn.WriteJSON(message)
		if err != nil {
			log.Println("Write error:", err)
			conn.Close()
			delete(connectedUsers, conn)
			broadcastUsersUpdate()
		}
	}
}
func broadcastTimerLevel(level int) {
   
    message := map[string]interface{}{
        "type":  "timer",
        "level": level,
    }

   for conn := range connectedUsers {
        err := conn.WriteJSON(message)
        if err != nil {
            log.Println("Write error:", err)
            conn.Close()
            delete(connectedUsers, conn)
        }
    }
}

func main() {
	// http.HandleFunc("/", Home)
	http.Handle("/", http.FileServer(http.Dir("./static/")))
	http.HandleFunc("/ws", handleWebSocket)
	fmt.Println("Server is running on http://localhost:8080")
	http.ListenAndServe(":8080", nil)
}

// func redirectToNewPage(w http.ResponseWriter, r *http.Request) {

// 	http.Redirect(w, r, "/newpage", http.StatusTemporaryRedirect)
// }

// func handleWebSocket(w http.ResponseWriter, r *http.Request) {
// 	conn, err := upgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Println("Upgrade error:", err)
// 		return
// 	}
// 	defer conn.Close()

// 	log.Println("New client connected")

// 	for {
// 		_, message, err := conn.ReadMessage()
// 		if err != nil {
// 			log.Println("Read error:", err)
// 			delete(connectedUsers, conn)
// 			broadcastUsersUpdate()
// 			return
// 		}

// 		var data map[string]interface{}
// 		err = json.Unmarshal(message, &data)
// 		if err != nil {
// 			log.Println("JSON parse error:", err)
// 			continue
// 		}

// 		if data["type"].(string) == "playerJoined" {
// 			playerName := data["playerName"].(string)
// 			connectedUsers[conn] = playerName
// 			broadcastUsersUpdate()
// 		}
// 	}
// }

package ws

type Room struct {
	ID      string             `json:"id"`
	Name    string             `json:"name"`
	Clients map[string]*Client `json:"clients"`
}
type Hub struct {
	Rooms      map[string]*Room
	Register   chan *Client
	Unregister chan *Client
	Broadcast  chan *Message
}

// constructor
func NewHub() *Hub {
	return &Hub{
		// instantiate
		Rooms:      make(map[string]*Room),
		Register:   make(chan *Client),
		Unregister: make(chan *Client),
		Broadcast:  make(chan *Message, 5),
	}
}

// will run on seperate routine
func (h *Hub) Run() {
	for {
		select {
		case cl := <-h.Register: // when hub receive client info thru register chan, room must be exist
			if _, ok := h.Rooms[cl.RoomID]; ok { // room exist
				r := h.Rooms[cl.RoomID]

				if _, ok := r.Clients[cl.ID]; !ok { //client not exist = add client to the room
					r.Clients[cl.ID] = cl
				}
			}
		case cl := <-h.Unregister:
			if _, ok := h.Rooms[cl.RoomID]; ok { // room exist
				if _, ok := h.Rooms[cl.RoomID].Clients[cl.ID]; ok {
					// broadcast a msg: client left room
					if len(h.Rooms[cl.RoomID].Clients) != 0 {
						h.Broadcast <- &Message{
							Content:  "user left the chat",
							RoomID:   cl.RoomID,
							Username: cl.Username,
						}
					}

					delete(h.Rooms[cl.RoomID].Clients, cl.ID)
					close(cl.Message)
				}
			}
		case m := <-h.Broadcast:
			if _, ok := h.Rooms[m.RoomID]; ok { // room exist
				//send msg to each client in the room
				for _, cl := range h.Rooms[m.RoomID].Clients {
					cl.Message <- m
				}
			}
		}
	}
}

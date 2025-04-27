"use client";
import React, { useEffect, useState, useContext } from "react";
import { API_URL, WEBSOCKET_URL } from "../../constant";
import { v4 as uuidv4 } from "uuid";
import { AuthContext, WebSocketContext } from "../../modules/";
import { useRouter } from "next/navigation";

export default function Home() {
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const [roomName, setRoomName] = useState("");
  const { user } = useContext(AuthContext);
  const { setConn } = useContext(WebSocketContext);
  const router = useRouter();

  const submitHandler = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      setRoomName("");
      const res = await fetch(`${API_URL}/ws/createroom`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          id: uuidv4(),
          name: roomName,
        }),
      });
      if (res.ok) {
        getRooms();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getRooms = async () => {
    try {
      setRoomName("");
      const res = await fetch(`${API_URL}/ws/getrooms`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        console.log(data);

        setRooms(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const joinRoom = (roomId: string) => {
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinroom/${roomId}?userId=${user.id}&username=${user.username}`
    );
    if (ws.OPEN) {
      setConn(ws);
      router.push("/app");
      return;
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <>
      <div className="my-8 px-4 md:mx-32 w-full h-full">
        <div className="flex justify-center mt-3 p-5">
          <input
            type="text"
            className="border border-grey p-2 rounded-md focus:outline-none focus:border-blue"
            placeholder="room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className="bg-blue border text-white rounded-md p-2 md:ml-4"
            onClick={submitHandler}
          >
            create room
          </button>
        </div>
        <div className="mt-6 text-slate-secondary">
          <div className="font-bold">Available rooms</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="border border-blue p-4 flex items-center rounded-md w-full bg-zinc-100 shadow-lg"
              >
                <div className="w-full">
                  <div className="text-sm">room</div>
                  <div className="text-blue font-bold text-lg">{room.name}</div>
                </div>
                <div className="">
                  <button
                    className="px-4 text-white bg-blue rounded-md"
                    onClick={() => joinRoom(room.id)}
                  >
                    join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

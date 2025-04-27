"use client";
import { useState, useRef, useContext, useEffect } from "react";
import ChatBody from "../../../components/chat_body";
import { AuthContext, WebSocketContext } from "../../../modules/";
import { useRouter } from "next/navigation";
import { API_URL } from "../../../constant";
import autosize from "autosize";

export type Message = {
  content: string;
  client_id: string;
  username: string;
  room_id: string;
  type: "recv" | "self";
};

export type User = {
  username: string;
};

const App = () => {
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [users, setUsers] = useState<Array<User>>([]);
  const textarea = useRef<HTMLTextAreaElement>(null);
  const { conn } = useContext(WebSocketContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const sendMesage = () => {
    if (!textarea.current?.value) return;

    if (conn == null) {
      router.push("/");
      return;
    }

    conn.send(textarea.current.value);
    textarea.current.value = "";
  };

  // get clients in the room
  useEffect(() => {
    if (conn === null) {
      console.log("fuck");

      router.push("/");
      return;
    }

    const roomId = conn.url.split("/")[5];
    async function getUsers() {
      try {
        const res = await fetch(`${API_URL}/ws/getclients/${roomId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    }
    getUsers();
  }, [conn, router]);

  //handle ws conn
  useEffect(() => {
    if (textarea.current) {
      autosize(textarea.current);
    }

    if (conn === null) {
      router.push("/");
      return;
    }

    conn.onmessage = (message) => {
      const m: Message = JSON.parse(message.data);
      if (m.content == "A new user has joined the room") {
        setUsers([...users, { username: m.username }]);
      }

      if (m.content == "user left the chat") {
        const deleteUser = users.filter((user) => user.username != m.username);
        setUsers([...deleteUser]);
        setMessages([...messages, m]);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      user?.username == m.username ? (m.type = "self") : (m.type = "recv");
      setMessages([...messages, m]);
    };

    conn.onclose = () => {};
    conn.onerror = () => {};
    conn.onopen = () => {};
  }, [textarea, messages, conn, users, router, user?.username]);

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="p-4 md:mx-6 mb-14">
          <ChatBody data={messages} />
        </div>
        <div className="fixed bottom-0 mt-4 w-full">
          <div className="flex md:flex-row px-4 py-2 bg-greywd md:mx-4 rounded-md">
            <div className="flex w-full mr-4 rounded-md border border-blue">
              <textarea
                ref={textarea}
                className="w-full h-10 p-2 rounded-md focus:outline-none"
                placeholder="type your message here"
                style={{ resize: "none" }}
              ></textarea>
            </div>
            <div className="flex items-center">
              <button
                className="p-2 rounded-md bg-blue text-white"
                onClick={sendMesage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;

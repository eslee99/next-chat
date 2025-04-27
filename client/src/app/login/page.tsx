"use client";
import { useContext, useState, useEffect } from "react";
import { API_URL } from "../../../constant";
import { useRouter } from "next/navigation";
import { AuthContext, UserInfo } from "../../../modules/auth_provider";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { authenticated } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    if (authenticated) {
      router.push("/");
      return;
    }
  }, [authenticated, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        const user: UserInfo = {
          username: data.username,
          id: data.id,
        };
        // TODO: dont use localstorage to store sensitive data
        // use localstorage to access from AuthContextProvider / React Context to pass data around
        localStorage.setItem("user_info", JSON.stringify(user));

        return router.push("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-w-full min-h-screen">
      <form className="flex flex-col md:w-1/5" onSubmit={handleSubmit}>
        <div>
          <span className="font-bold text-blue ">welcome ~</span>
        </div>
        <input
          className="p-3 mt-8 border-2 rounded-md border-slate-secondary focus:outline-none focus:border-blue"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
          value={email}
        />
        <input
          className="p-3 mt-4 border-2 rounded-md border-slate-secondary focus:outline-none focus:border-blue"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
        />
        <button
          className="p-3 mt-6 rounded-md bg-blue font-bold text-white"
          type="submit"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

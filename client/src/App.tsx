import { useEffect, useState } from "react";
import { useTheme } from "./components/ThemeContext/ThemeContext";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";
import checkAuthToken from "./utils/checkAuthToken";

function App() {
  const theme = useTheme();
  const [user, setUser] = useState("");
  const [login, setLogin] = useState<"signin" | "signup" | "">("signin");

  useEffect(() => {
    checkAuthToken({ setUser });
  }, []);

  useEffect(() => {
    setLogin(user ? "" : "signin");
  }, [user]);

  const handleLogIn = () => {
    setLogin("signin");
  };

  const handleLogOut = () => {
    document.cookie = "x-auth-token=";
    setUser("");
  };

  return (
    <div
      className={`theme ${theme ? "bg-gray-700" : "bg-gray-800"} flex min-h-screen flex-col items-center`}
    >
      <nav className="flex h-24 w-full items-center justify-between bg-black/20 px-10 shadow-2xl">
        <div className="flex w-44 items-center justify-center bg-white">
          Logo Placeholder
        </div>
        <div className="text py-10 text-7xl font-extrabold uppercase text-red-500 2xl:text-7xl">
          Doable
        </div>
        {user ? (
          <button
            className="flex w-44 items-center justify-center bg-white"
            onClick={handleLogOut}
          >
            Log Out
          </button>
        ) : (
          <button
            className="flex w-44 items-center justify-center bg-white"
            onClick={handleLogIn}
          >
            Log In
          </button>
        )}
      </nav>
      {login === "signin" ? (
        <SignInForm setUser={setUser} setLogin={setLogin} />
      ) : null}
      {login === "signup" ? (
        <SignUpForm setUser={setUser} setLogin={setLogin} />
      ) : null}
    </div>
  );
}

export default App;

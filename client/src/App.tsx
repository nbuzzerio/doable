import { useEffect, useState } from "react";
import { useTheme } from "./components/ThemeContext/ThemeContext";
import SignUpForm from "./components/SignUpForm";
import SignInForm from "./components/SignInForm";
import checkAuthToken from "./utils/checkAuthToken";
import Nav from "./components/Nav";

export type User = { _id: string; name?: string } | null;

function App() {
  const theme = useTheme();
  const [user, setUser] = useState<User>(null);
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
    document.cookie =
      "x-auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(null);
  };

  return (
    <div
      className={`theme ${theme ? "bg-gray-700" : "bg-gray-800"} flex min-h-screen flex-col items-center`}
    >
      <Nav user={user} handleLogOut={handleLogOut} handleLogIn={handleLogIn} />
      {login === "signin" ? <SignInForm setLogin={setLogin} /> : null}
      {login === "signup" ? (
        <SignUpForm setUser={setUser} setLogin={setLogin} />
      ) : null}
    </div>
  );
}

export default App;

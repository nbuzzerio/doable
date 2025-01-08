import { User } from "../App";

interface Props {
  user: User;
  handleLogOut: () => void;
  handleLogIn: () => void;
}

const Nav = ({ user, handleLogIn, handleLogOut }: Props) => {
  return (
    <nav className="flex w-full flex-col items-center justify-between bg-black/20 px-10 pb-10 shadow-2xl md:h-24 md:flex-row md:pb-0">
      <div className="hidden w-44 items-center justify-center bg-white md:flex">
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
  );
};

export default Nav;

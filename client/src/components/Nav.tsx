interface Props {
  user: string;
  handleLogOut: () => void;
  handleLogIn: () => void;
}

const Nav = ({ user, handleLogIn, handleLogOut }: Props) => {
  return (
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
  );
};

export default Nav;

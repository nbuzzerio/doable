interface Props {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

const checkAuthToken = ({ setUser }: Props) => {
  const cookies = document.cookie.split(";");
  cookies.forEach((cookie) => {
    if (cookie.includes("x-auth-token=")) {
      const token = cookie.trim().slice(13);
      if (token) {
        setUser(token);
      }
    }
  });
};

export default checkAuthToken;

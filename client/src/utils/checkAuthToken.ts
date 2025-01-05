import { jwtDecode } from "jwt-decode";

interface Props {
  setUser: React.Dispatch<React.SetStateAction<string>>;
}

const checkAuthToken = ({ setUser }: Props) => {
  const cookies = document.cookie.split(";");

  cookies.forEach((cookie) => {
    if (cookie.trim().startsWith("x-auth-token=")) {
      const token = cookie.trim().split("=")[1];

      if (token) {
        try {
          const decoded = jwtDecode<{
            _id: string;
            email: string;
            iat: number;
          }>(token);

          if (decoded && decoded._id) {
            setUser(decoded._id);
          } else {
            console.error("Invalid token payload:", decoded);
          }
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  });
};

export default checkAuthToken;

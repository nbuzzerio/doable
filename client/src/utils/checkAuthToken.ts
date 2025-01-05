import { jwtDecode } from "jwt-decode";

interface Props {
  setUser: React.Dispatch<
    React.SetStateAction<{ _id: string; name?: string } | null>
  >;
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
            name: string;
            iat: number;
          }>(token);

          if (decoded && decoded._id) {
            setUser({ _id: decoded._id, name: decoded.name });
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

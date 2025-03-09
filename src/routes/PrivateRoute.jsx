import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import { logout, useCurrentToken } from "@/redux/services/auth/authSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/services/auth/authApi";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const token = useSelector(useCurrentToken);

  const decodedToken = jwtDecode(token);

  const { data } = useGetSingleUserQuery(decodedToken?.userId, {
    skip: !token,
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to access this page.");
      dispatch(logout());
      router.push("/sign-in");
      return;
    }

    const decodedToken = jwtDecode(token);

    if (decodedToken?.role !== data?.role) {
      toast.error("You don't have permission to access this page!");
      dispatch(logout());
      router.push("/sign-in");
      return;
    }

    const tokenExpirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    if (tokenExpirationTime > currentTime) {
      const timeUntilExpiration = tokenExpirationTime - currentTime;

      const timer = setTimeout(() => {
        toast.error("Your session expired! Please log in again.");
        dispatch(logout());
        router.push("/sign-in");
      }, timeUntilExpiration);

      return () => clearTimeout(timer);
    } else {
      toast.error("Your session has already expired! Please log in again.");
      dispatch(logout());
      router.push("/sign-in");
    }
  }, [token, dispatch, router, data]);

  if (token) {
    const decodedToken = jwtDecode(token);
    const tokenExpirationTime = decodedToken.exp * 1000;
    const currentTime = Date.now();

    if (tokenExpirationTime > currentTime) {
      return children;
    }
  }

  return <Link href="/sign-in"></Link>;
};

export default PrivateRoute;

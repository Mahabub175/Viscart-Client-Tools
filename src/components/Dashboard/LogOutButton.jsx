import { logout } from "@/redux/services/auth/authSlice";
import { MdLogout } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const LogOutButton = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    dispatch(logout());
  };

  return (
    <div
      className="bg-white p-5 rounded-xl shadow-xl text-base font-bold text-end flex flex-col justify-center lg:justify-around items-center gap-2 hover:text-primary"
      onClick={handleLogout}
    >
      <MdLogout className="text-[40px] lg:text-[50px] text-primary" />
      <p className="text-center text-sm lg:text-xl">Log Out</p>
    </div>
  );
};

export default LogOutButton;

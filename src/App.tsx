// import AppRoutes from './routes/AppRoutes';

// function App() {
//   return (
//     <>
//       <AppRoutes />
//     </>
//   );
// }

// export default App;

import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import Cookies from "js-cookie";
import { logout } from "./redux/slice/auth";
import type { AppDispatch } from "./redux/store/store";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timer);

      timer = setTimeout(
        () => {
          console.log("Auto logout due to inactivity>>>>>");

          // Cookies.remove("token");

          dispatch(logout());

          window.location.href = "/login";
        },
        15 * 60 * 1000,
        // 10 * 1000,
      );
    };

    // user activity detect
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);
    window.addEventListener("click", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timer);

      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
    };
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;

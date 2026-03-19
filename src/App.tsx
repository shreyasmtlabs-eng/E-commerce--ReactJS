import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "./redux/slice/auth";
import type { AppDispatch } from "./redux/store/store";
import AppRoutes from "./routes/AppRoutes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { requestPermissionAndGetToken } from "./firebase/notification";
import { getMessaging, onMessage } from "firebase/messaging";
import app from "./firebase/firebase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NotificationToast from "./component/notifiucationtoast";

const queryClient = new QueryClient();

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

  useEffect(() => {
    requestPermissionAndGetToken();
  }, []);

  useEffect(() => {
    const messaging = getMessaging(app);
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      if (payload.notification) {
        toast(
          <NotificationToast
            title={payload.notification?.title}
            body={payload.notification?.body}
          />,
          {
            position: "top-right",
            autoClose: 4000,
            style: {
              borderRadius: "12px",
              background: "#1e293b",
              color: "#fff",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            },
          },
        );

        if (Notification.permission === "granted") {
          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification(
              payload.notification?.title || "New Notification",
              {
                body: payload.notification?.body || "You have a new message",
                icon: "/icon.png",
                badge: "/icon.png",
                vibrate: [200, 100, 200],
              },
            );
          });
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </QueryClientProvider>
  );
}

export default App;

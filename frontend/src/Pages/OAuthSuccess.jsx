import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const role = params.get("role");
    const isNew = params.get("new");
    console.log("Token from URL:", token);
    console.log("Is new user:", isNew);

    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Handle new user onboarding
      if (isNew === "true") {
        // You can show a welcome page, onboarding, or redirect to a setup page
        navigate("/welcome"); // <-- create this route/page if you want onboarding
      } else if (role === "organizer") {
        navigate("/Organizer_Dashboard");
      } else {
        navigate("/Attendee");
      }
    } else {
      navigate("/login");
    }
  }, [location, navigate]);

  return <div>Logging you in...</div>;
}
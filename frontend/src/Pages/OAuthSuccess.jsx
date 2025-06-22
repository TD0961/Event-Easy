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
    if (token) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;    // Redirect based on role
    if (role === "organizer") {
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
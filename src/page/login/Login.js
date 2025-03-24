import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInFunction } from "../../firebase";
import "./styles.css";
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInFunction(email, password);
      setEmail("");
      setPassword("");
      setError("");
      setLoading(false);
      navigate("/donor");
    }
    catch(error){
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    
    <div>
      <div class = "navbar">
          <a class = "navhome" href="/">Crimson</a>
          <a class = "navlogin" href="/login">Login</a>
          <a class = "navregister" href="/signup">Register</a>
      </div> 
      <div className="wrapper">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="remember-forgot">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
               />{" "}
              Remember Me
            </label>
          </div>
          <button type="submit" className="loginbtn" disabled={loading}>
            {loading ? "Creating Account..." : "Login!"}
          </button>
          {error && (
            <p
              style={{
                textAlign: "center",
                marginTop: "10px",
                color: error === "" ? "green" : "red",
              }}
            >
              {error}
            </p>
          )}
          <div className="register-link">
            <p>
              Don't have an account?{" "}
              <a href="/" onClick={() => navigate("signup")}>
                Register Here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>

  );
};

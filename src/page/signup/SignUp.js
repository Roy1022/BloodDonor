import React, { useState } from "react";
import { signUpFunction } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

export const SignUp = () => {
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationType, setOrganizationType] = useState("donor");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUpFunction(organizationName, email,password,organizationType);
      setOrganizationName("");
      setEmail("");
      setPassword("");
      setOrganizationType("donor");
      setError("Success");
      navigate("/donor");
    } catch (err) {
      setError(err.message);
    } finally {
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
        <h1>Register!</h1>
        <form onSubmit={handleSignUp}>
          <div className="input-box">
            <input
              type="text"
              placeholder="Organization Name"
              required
              value={organizationName}
              onChange={(e) => setOrganizationName(e.target.value)}
            />
          </div>
          <div>
            <select
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
            >
              <option value="" disabled>
                Organization Type
              </option>
              <option value="donor">Donor</option>
              <option value="hospital">Hospital</option>
            </select>
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Re-enter Password" required />
          </div>
          <div className="input-box">
            <input
              type="email"
              placeholder="Contact Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <select defaultValue="">
              <option value="" disabled>
                State
              </option>
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          </div>
          <div className="input-box">
            <input type="text" placeholder="Town" required />
          </div>
          <div className="terms">
            <label>
              <input type="checkbox" /> I accept the terms and conditions
            </label>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account!"}
          </button>
        </form>
        {error && (
          <p className={error === "Success" ? "success-message" : "error-message"}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
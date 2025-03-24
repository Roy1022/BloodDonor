import React from "react";
import "./Home3.css";
export const Home3 = () => {
  return (
    <div>
      <div class="navbar">
        <a class="navhome" href="/">
          Crimson
        </a>
        <a class="navlogin" href="/login">
          Login
        </a>
        <a class="navregister" href="/signup">
          Register
        </a>
      </div>
      <header>
        <h1>Crimson</h1>
        <p>Saving Lives, One Drop at a Time</p>
      </header>

      <section>
        <div class="title-container">
          <h2>Our mission</h2>
          <h2>How it works</h2>
        </div>

        <div class="blurb-container">
          <div class="blurb">
            <p>
              Crimson is dedicated to reducing the amount of spoiled donated
              blood by quickly connecting blood donor organizations and local
              hospitals. Every drop saved has the potential to save a life.
            </p>
          </div>

          <div class="blurb">
            <p>
              Go through our minimalistic process by putting your blood supply
              in our system. Our quick and efficient algorithm then takes care
              of the rest by quickly conencting the best local hospitals with
              you.
            </p>
          </div>
        </div>
      </section>

      <section>
        <div class="stats-container">
          <div class="stat-item">
            <h3 class="stat-number">150+</h3>
            <p class="stat-label">Hospitals</p>
          </div>
          <div class="stat-item">
            <h3 class="stat-number">300+</h3>
            <p class="stat-label">Donor Organizations</p>
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2025 Crimson - Connecting Donors with Hospitals</p>
        <p>
          <a href="mailto:contact@crimson.com">
            Contact Us
          </a>
        </p>
      </footer>
    </div>
  );
};

import { Link } from "react-router-dom";

import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <section className="not-found">
      <div className="not-found__content">
        <h1>404</h1>
        <h2>Oops! The page you are looking for does not exist.</h2>
        <p>
          But don't worry, you can find plenty of other things on our homepage.
        </p>
      </div>

      <Link to="/" className="home-link">
        Go back to Home
      </Link>
    </section>
  );
};

export default NotFoundPage;

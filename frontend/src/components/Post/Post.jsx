import { Link } from "react-router-dom";
import { format } from "date-fns";

import "./Post.css";

const Post = ({ _id, author, title, summary, content, cover, createdAt }) => {
  return (
    <div className="post">
      <Link to={`/post/${_id}`}>
        <div className="post__image">
          <img src={`${process.env.REACT_APP_BASE_URL}/` + cover} alt={title} />
        </div>
      </Link>

      <Link
        to={`/post/${_id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="post__content">
          <h2 className="post__title">{title}</h2>
          <div className="post__info">
            <span className="post__author">{author.username}</span>
            <time className="post__date">
              {format(new Date(createdAt), "MMM d, yyyy HH:mm")}
            </time>
          </div>
          <p className="post__description">{summary}</p>
        </div>
      </Link>
    </div>
  );
};

export default Post;

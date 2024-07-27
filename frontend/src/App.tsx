import React from "react";
import anonMediaImg from "./assets/anonMedia.png";
import CreateReviewForm from "./CreateReviewForm";
import DisplayReviews from "./DisplayReviews";
import "./App.css";

const App: React.FC<{ authorId: string }> = ({ authorId }) => {
  return (
    <div>
      <div className="vert">
        <h1>AnonMedia</h1>
        <h2>Post anonymous media reviews 📚🚀.</h2>
        <img alt="logo" src={anonMediaImg} className="img" />
        <h3>
          From books, movies, video games, to poems, whatever you want.
          Completely anonymous.
        </h3>
      </div>
      <div className="empty"></div>
      <div className="vert">
        <CreateReviewForm authorId={authorId} />
        <div className="empty"></div>
        <DisplayReviews authorId={authorId} />
      </div>
    </div>
  );
};

export default App;

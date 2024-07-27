import React from "react";
import { Post } from "./CreateReviewForm";
import "./App.css";

type CardProps = {
  post: Post;
};

// Styles taken from flowbite: https://flowbite.com/docs/components/card/
const Card: React.FC<CardProps> = ({ post }) => {
  return (
    <div className="card card__outer">
      <h5 className="card__title">{post.title}</h5>
      <p className="card__body">{post.body}</p>
    </div>
  );
};

export default Card;

import React from "react";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Card from "./Card";
import { Post } from "./CreateReviewForm";

const DisplayReviews: React.FC<{ authorId: string }> = ({ authorId }) => {
  const [posts, setPosts] = React.useState<Post[]>([]);

  const query = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios.get("http://localhost:3001/posts").then((res) => res.data),
  });

  React.useEffect(() => {
    if (query.status === "success") {
      setPosts(query.data as Post[]);
    }
  }, [query]); // listen to changes in query (like if refetching caused by invalidation from create form)

  return (
    <>
      <h2>All User Posts</h2>
      {query.status === "pending" && <p>Loading...</p>}
      {query.status === "error" && (
        <p>Unable to show posts now. {JSON.stringify(query.error.message)}</p>
      )}
      <div className="vert">
        <div className="container__posts">
          {posts.map((value: any) => {
            return <Card post={value} />;
          })}
        </div>
        <div className="empty"></div>
        {posts.length > 0 && <h2>Posts By You</h2>}
        <div className="container__posts">
          {posts.map((value: any) => {
            return value.authorId === authorId ? <Card post={value} /> : null;
          })}
        </div>
      </div>
    </>
  );
};

export default DisplayReviews;

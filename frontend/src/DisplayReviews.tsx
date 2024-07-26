import React from "react";
import "./App.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const DisplayReviews: React.FC<{ authorId: string }> = ({ authorId }) => {
  const query = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      axios.get("http://localhost:3001/posts").then((res) => res.data),
  });

  // <p>be the first to make a post!</p>

  return (
    <>
      <h2>All User Posts</h2>
      {query.status === "pending" && <p>Loading...</p>}
      <div className="vert">
        {query.status === "success" &&
          query.data.map((value: any) => {
            return (
              <div>
                <h2>{value.title}</h2>
                <p>{value.body}</p>
                <p>{value.authorId}</p>
              </div>
            );
          })}
      </div>
      {query.status === "error" && <p>Unable to show posts now.</p>}
    </>
  );
};

export default DisplayReviews;

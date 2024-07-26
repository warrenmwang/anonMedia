import React from "react";
import "./App.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type Post = {
  authorId: string;
  title: string;
  body: string;
};

const createNewPost = (post: Post): Promise<any> => {
  const formData: FormData = new FormData();
  formData.append("post", JSON.stringify(post))
  return axios.put("http://localhost:3001/posts", formData).then(res => res.data);
};

const CreateReviewForm: React.FC<{ authorId: string }> = ({ authorId }) => {
  const [post, setPost] = React.useState<Post | undefined>(undefined);

  const mutation = useMutation({
    mutationKey: ["posts"],
    mutationFn: (post: Post) => createNewPost(post),
  });

  const handleTextInput = (
    e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const text: string = e.currentTarget.value;
    const id: string = e.currentTarget.id;
    setPost((prevState: any) => ({
      ...prevState,
      [id]: text,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (post === undefined) {
      alert("Unable to create an empty post.");
      return;
    }

    // insert author id
    setPost((prevState: any) => ({
      ...prevState,
      authorId: authorId,
    }));

    // run mutation
    mutation.mutate(post as Post);
  };

  return (
    <div className="vert">
      <h2>Create a post!</h2>
      <form className="form__create" onSubmit={handleSubmit}>
        <label className="label">
          Title (e.g. "Back to the Future Got me Like ...")
        </label>
        <input
          id="title"
          type="text"
          className="input__text"
          required={true}
          onChange={handleTextInput}
        />
        <label className="label">
          Content (e.g. Just start yapping, and don't stop. Let it out and lube
          yourself with coconut oil.)
        </label>
        <textarea
          id="body"
          className="input__text"
          rows={5}
          cols={80}
          required={true}
          onChange={handleTextInput}
        />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateReviewForm;

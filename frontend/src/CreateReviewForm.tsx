import React from "react";
import "./App.css";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export type Post = {
  authorId: string;
  title: string;
  body: string;
};

const createNewPost = (post: Post): Promise<any> => {
  const formData: FormData = new FormData();
  formData.append("post", JSON.stringify(post));
  return axios
    .put("http://localhost:3001/posts", formData)
    .then((res) => res.data);
};

const CreateReviewForm: React.FC<{ authorId: string }> = ({ authorId }) => {
  const emptyPost: Post = {
    authorId: "",
    title: "",
    body: "",
  };

  const [post, setPost] = React.useState<Post>(emptyPost);

  const queryClient = useQueryClient();
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
    if (post?.authorId === "" || post?.title === "" || post?.body === "") {
      alert("Unable to create post with any missing fields.");
      return;
    }

    // run mutation
    mutation.mutate(post as Post, {
      onSuccess: () => {
        setPost((prevState) => ({
          ...prevState,
          title: "",
          body: "",
        })); // clear form
        // invalidate the posts query
        queryClient.invalidateQueries({
          queryKey: ["posts"],
        });
      },
      onError: () => {
        alert("Couldn't create post, try again.");
      },
    });
  };

  React.useEffect(() => {
    // insert author id once
    setPost((prevState: any) => ({
      ...prevState,
      authorId: authorId,
    }));
  }, []);

  return (
    <div className="vert">
      <h2>Create a post!</h2>
      <form className="form__create" onSubmit={handleSubmit}>
        <label className="label">Title</label>
        <input
          id="title"
          type="text"
          className="input__text"
          placeholder="The GodFather (1972)"
          value={post.title}
          required={true}
          onChange={handleTextInput}
        />
        <label className="label">Content</label>
        <textarea
          id="body"
          className="input__text"
          placeholder="Great, I can't believe they threw in such a useless character like Apollonia whose only purpose was to illustrate the furthering corruption of Michael."
          value={post.body}
          rows={5}
          cols={80}
          required={true}
          onChange={handleTextInput}
          maxLength={1500}
        />
        <button type="submit" className="submit-btn">
          Submit
        </button>
      </form>
    </div>
  );
};

export default CreateReviewForm;

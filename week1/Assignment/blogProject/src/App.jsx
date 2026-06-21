import { useState } from "react";

import posts from "./data/posts.json";

import BlogCard from "./components/BlogCard";

import "./App.css";
import "./components/BlogCard.css";

function App() {

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

  const filteredPosts =
    posts.filter((post) => {

      const matchesSearch =
        post.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesCategory =
        category === "All" ||
        post.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });

  return (
    <div className="app">

      <h1>
        React Blog UI
      </h1>

      <p>
        Search and filter blog posts
      </p>

      <div className="controls">

        <input
          type="text"
          placeholder="Search blogs..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >

          <option>
            All
          </option>

          <option>
            React
          </option>

          <option>
            JavaScript
          </option>

          <option>
            CSS
          </option>

        </select>

      </div>

      <div className="cards">

        {filteredPosts.map(
          (post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              category={post.category}
              description={
                post.description
              }
            />
          )
        )}

      </div>

    </div>
  );
}

export default App;
// check if the user is logged in, if not redirect to login page
const user = await setUserId();
if (user === null) {
  window.location.href = "./../Login/Login.html";
}

import { Post } from "./../../assets/classes/Post.js";

// get the id from the url
const id = new URLSearchParams(window.location.search).get("id");
if (isNaN(id) || isNaN(parseInt(id))) {
  // if the id isn't a number, redirect to error page
  window.location.href = "./../error404/error404.html";
}
// get the post from the data base
const postResponse = await fetch(`${api}/posts/${id}`);
if (postResponse.status !== 200) {
  window.location.href = "./../error404/error404.html";
}
const postData = await postResponse.json();
const originalPost = new Post();
originalPost.objectValues(postData);
// if the logged user isn't the author then redirect to error page
if (originalPost.author !== user.id) {
  window.location.href = "./../error404/error404.html";
}
// fill the inputs with the original post data
document.querySelector(`input[aria-label="title"]`).value = unescape(
  originalPost.title
);
document.querySelector(`textarea`).value = unescape(originalPost.content);

// the rest is almost the same with the CreatePost.js

document
  .querySelector(".btn-submit")
  .addEventListener("click", async function (e) {
    const title = document
      .querySelector(`input[aria-label="title"]`)
      .value.trim();
    const content = document.querySelector(`textarea`).value.trim();
    if (title === "" || content === "") {
      alert("Please fill the title and the content");
      return;
    }
    let article = document.querySelector("article");
    if (!article) {
      article = document.createElement("article");
      document.querySelector("main").appendChild(article);
    }
    const user_data = await setUserId();
    const post = new Post();
    post.defaultValues(title, content, user_data.id);
    article.innerHTML = `
      <div class="d-flex justify-content-between">
          <h5 style="color: var(--mainGreen)">${user_data.firstName} ${user_data.lastName}</h5>
          <h5 style="color: var(--mainGreen); margin-bottom: 30px">${originalPost.date}</h5>
      </div>
      <h2 style="font-family: var(--h1-font); overflow-wrap: break-word">${post.title}</h2>
      <div class="line"></div>
      <p style="font-family: var(--content-font); overflow-wrap: break-word">${post.content}</p>
      `;
  });

document
  .querySelector(".btn-success")
  .addEventListener("click", async function (e) {
    const title = document
      .querySelector(`input[aria-label="title"]`)
      .value.trim();
    const content = document.querySelector(`textarea`).value.trim();
    if (title === "" || content === "") {
      alert("Please fill the title and the content");
      return;
    }
    try {
      const post = new Post();
      const response = await fetch(`${api}/posts/` + id, {
        method: "PATCH",
        body: JSON.stringify({
          title: escape(title),
          content: escape(content),
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error();
      }
      window.onbeforeunload = null;
      window.location.href = "./../Post/Post.html?id=" + id;
    } catch (error) {
      window.onbeforeunload = null;
      window.location.href = "./../error404/error404.html";
    }
  });

document.querySelector(".btn-danger").addEventListener("click", function (e) {
  window.onbeforeunload = null;
  window.location.href = "./../Post/Post.html?id=" + id;
});

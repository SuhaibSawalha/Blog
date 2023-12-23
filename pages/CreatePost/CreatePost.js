if ((await setUserId()) === null) {
  window.location.href = "./../Login/Login.html";
}

window.onbeforeunload = function (event) {
  const title = this.document.querySelector(`input[aria-label="title"]`).value;
  const content = this.document.querySelector(`textarea`).value;
  if (title !== "" || content !== "") {
    const confirmationMessage = "Are you sure you want to leave the page?";
    event.returnValue = confirmationMessage;
    return confirmationMessage;
  }
};

import { Post } from "./../../assets/classes/Post.js";

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
        <h5 style="color: var(--mainGreen); margin-bottom: 30px">${post.fullDate}</h5>
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
      const user_data = await setUserId();
      post.defaultValues(title, content, user_data.id);
      const response = await fetch(`${api}/posts`, {
        method: "POST",
        body: post.toDataBase(),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 201) {
        throw new Error();
      }
      const data = await response.json();
      await addPostToUser(user_data.id, data.id);
    } catch (error) {
      window.onbeforeunload = null;
      window.location.href = "./../error404/error404.html";
    }
  });

async function addPostToUser(user_id, post_id) {
  try {
    const response = await fetch(`${api}/users/${user_id}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    data.posts.push(post_id);
    const response2 = await fetch(`${api}/users/${user_id}`, {
      method: "PATCH",
      body: JSON.stringify({
        posts: data.posts,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response2.status !== 200) {
      throw new Error();
    }
    window.onbeforeunload = null;
    window.location.href = "./../Post/Post.html?id=" + post_id;
  } catch (error) {
    window.onbeforeunload = null;
    window.location.href = "./../error404/error404.html";
  }
}

document.querySelector(".btn-danger").addEventListener("click", function (e) {
  document.querySelector(`input[aria-label="title"]`).value = "";
  document.querySelector(`textarea`).value = "";
  let article = document.querySelector("article");
  if (article) {
    article.remove();
  }
});

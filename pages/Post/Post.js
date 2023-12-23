if ((await setUserId()) === null) {
  window.location.href = "./../Login/Login.html";
}

import { Post } from "./../../assets/classes/Post.js";

async function displayPost() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (isNaN(id) || isNaN(parseInt(id))) {
    window.location.href = "./../error404/error404.html";
  }
  try {
    const response = await fetch(`${api}/posts/${id}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const data = await response.json();
    const user_data = await setUserId();
    const author = await getProfile(data.author);
    const post = new Post();
    post.objectValues(data);
    document.title = post.title;
    document.querySelector("article").innerHTML = `
        <div class="d-flex justify-content-between">
            <a href="./../Account/Account.html?id=${author.id}">${author.firstName} ${author.lastName}</a>
            <h5 style="color: var(--mainGreen); margin-bottom: 30px">${post.date}</h5>
        </div>
        <h2 style="font-family: var(--h1-font); overflow-wrap: break-word">${post.title}</h2>
        <div class="line"></div>
        <p style="font-family: var(--content-font); overflow-wrap: break-word">${post.content}</p>
    `;
    await displayLikes(data, user_data);
    await displaySaves(data, user_data);
    await displayComments(data, user_data);
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}
displayPost();

async function getProfile(id) {
  try {
    const response = await fetch(`${api}/users/?id=${id}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    if (data.length === 0) {
      throw new Error();
    }
    return data[0];
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

async function displayLikes(post, user) {
  document.getElementById("numberOfLikes").innerHTML = post.likes.length;
  if (post.likes.includes(user.id)) {
    const button = document.getElementById("likeButton");
    const icon = document.getElementById("likeIcon");
    icon.classList.remove("bi-hand-thumbs-up");
    icon.classList.add("bi-hand-thumbs-up-fill");
    button.style.color = "var(--mainGreen)";
  }
  const button = document.getElementById("likeButton");
  button.addEventListener("click", async () => {
    const icon = document.getElementById("likeIcon");
    if (icon.classList.contains("bi-hand-thumbs-up")) {
      icon.classList.remove("bi-hand-thumbs-up");
      icon.classList.add("bi-hand-thumbs-up-fill");
      button.style.color = "var(--mainGreen)";
      post.likes.push(user.id);
      user.likes.push(post.id);
    } else {
      icon.classList.remove("bi-hand-thumbs-up-fill");
      icon.classList.add("bi-hand-thumbs-up");
      button.style.color = "white";
      post.likes.splice(post.likes.indexOf(user.id), 1);
      user.likes.splice(user.likes.indexOf(post.id), 1);
    }
    document.getElementById("numberOfLikes").innerHTML = post.likes.length;
    try {
      await fetch(`${api}/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: post.likes,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      await fetch(`${api}/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          likes: user.likes,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      window.location.href = "./../error404/error404.html";
    }
  });
}

async function displaySaves(post, user) {
  if (post.saves.includes(user.id)) {
    const button = document.getElementById("saveButton");
    const icon = document.getElementById("saveIcon");
    icon.classList.remove("bi-file-earmark");
    icon.classList.add("bi-file-earmark-fill");
    button.style.color = "var(--mainGreen)";
  }
  const button = document.getElementById("saveButton");
  button.addEventListener("click", async () => {
    const icon = document.getElementById("saveIcon");
    if (icon.classList.contains("bi-file-earmark")) {
      icon.classList.remove("bi-file-earmark");
      icon.classList.add("bi-file-earmark-fill");
      button.style.color = "var(--mainGreen)";
      post.saves.push(user.id);
      user.saves.push(post.id);
    } else {
      icon.classList.remove("bi-file-earmark-fill");
      icon.classList.add("bi-file-earmark");
      button.style.color = "white";
      post.saves.splice(post.saves.indexOf(user.id), 1);
      user.saves.splice(user.saves.indexOf(post.id), 1);
    }
    try {
      await fetch(`${api}/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          saves: post.saves,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      await fetch(`${api}/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          saves: user.saves,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
    } catch (error) {
      window.location.href = "./../error404/error404.html";
    }
  });
}

import { Comment } from "./../../assets/classes/Comment.js";

async function displayComments(post, user) {
  document.getElementById("numberOfComments").innerHTML = post.comments.length;

  try {
    const commentsResponse = await fetch(`${api}/comments?post=${post.id}`);
    if (commentsResponse.status !== 200) {
      throw new Error();
    }
    const commentsData = await commentsResponse.json();
    const commentsComponent = document.getElementById("comments");
    commentsComponent.innerHTML = ``;
    for (const comment of commentsData) {
      const userResponse = await fetch(`${api}/users/${comment.author}`);
      if (userResponse.status !== 200) {
        throw new Error();
      }
      const userData = await userResponse.json();

      commentsComponent.innerHTML += `
        <div class="comment d-flex justify-content-between" style="overflow-wrap: break-word">
          <img src="${userData.photo}" alt="user's photo"/>
          <div>
            <a href="./../Account/Account.html?id=${userData.id}">${userData.firstName} ${userData.lastName}</a>
            <p>
              ${comment.content}
            </p>
          </div>
        </div>
      `;
    }
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }

  document.getElementById("commentButton").addEventListener("click", () => {
    document.querySelector("textarea").focus();
  });

  const button = document.querySelector("form button");
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const content = document.querySelector("textarea").value.trim();
    if (content === "") {
      alert("Please enter your comment");
      return;
    }

    const comment = new Comment();
    comment.setValues(user.id, post.id, content);

    const response = await fetch(`${api}/comments`, {
      method: "POST",
      body: comment.toDataBase(),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status !== 201) {
      throw new Error();
    }
    const data = await response.json();

    post.comments.push(data.id);
    user.comments.push(data.id);

    try {
      await fetch(`${api}/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          comments: post.comments,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      await fetch(`${api}/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          comments: user.comments,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      window.location.reload();
    } catch (error) {
      window.location.href = "./../error404/error404.html";
    }
  });
}

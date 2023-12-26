// get the logged user, if there's no user logged, redirect to login page
const logged_user = await setUserId();
if (logged_user === null) {
  window.location.href = "./../Login/Login.html";
}

import { Post } from "./../../assets/classes/Post.js";

// display the post
async function displayPost() {
  // get the id from the url
  const id = new URLSearchParams(window.location.search).get("id");
  if (isNaN(id) || isNaN(parseInt(id))) {
    // if the id isn't a number, redirect to error page
    window.location.href = "./../error404/error404.html";
  }
  try {
    // get the post and display it
    const response = await fetch(`${api}/posts/${id}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const data = await response.json();
    const user_data = await setUserId();
    const author = await getProfile(data.author);
    // if the user logged is the author of the post, display the edit and delete buttons
    if (user_data.id === author.id) {
      document.getElementById("edit").innerHTML = `
        <div class = "d-flex text-white mb-2">
          <a href="./../EditPost/EditPost.html?id=${data.id}" style="color: var(--mainPurple)">edit post</a>
          <p style="margin: 0 10px">|</p>
          <a class="text-danger" id="delete" style="decoration: underline">delete post</a>
        </div>
      `;
      document.getElementById("delete").addEventListener("click", async () => {
        if (confirm("Are you sure you want to delete this post?")) {
          try {
            await fetch(`${api}/posts/${data.id}`, {
              method: "DELETE",
            });
            user_data.posts.splice(user_data.posts.indexOf(data.id), 1);
            await fetch(`${api}/users/${user_data.id}`, {
              method: "PATCH",
              body: JSON.stringify({
                posts: user_data.posts,
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            });
            window.location.href = "./../Account/Account.html";
          } catch (error) {
            window.location.href = "./../error404/error404.html";
          }
        }
      });
    }
    const post = new Post();
    post.objectValues(data);
    document.title = unescape(post.title);
    document.querySelector("article").innerHTML = `
        <div class="d-flex justify-content-between">
            <a href="./../Account/Account.html?id=${author.id}">${author.firstName} ${author.lastName}</a>
            <h5 style="color: var(--mainGreen); margin-bottom: 30px">${post.date}</h5>
        </div>
        <h2 style="font-family: var(--h1-font); overflow-wrap: break-word">${post.title}</h2>
        <div class="line"></div>
        <p style="font-family: var(--content-font); overflow-wrap: break-word">${post.content}</p>
    `;
    // display the likes, saves and comments of the post
    await displayLikes(data, user_data);
    await displaySaves(data, user_data);
    await displayComments(data, user_data);
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}
displayPost();

// get the profile of the user with the given id
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

// display the number of likes and the like button
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

// display the number of saves and the save button
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

// display the comments and the comment form
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
      // display the comments, and if the logged user is the author of the comment, display the edit and delete buttons
      commentsComponent.innerHTML += `
        <div id="comment-${
          comment.id
        }" class="comment d-flex justify-content-between" style="overflow-wrap: break-word">
          <img src="${userData.photo}" alt="user's photo"/>
          <div>
            <div class="d-flex justify-content-between" style="width: 100%">
              <a href="./../Account/Account.html?id=${userData.id}">${
        userData.firstName
      } ${userData.lastName}</a>
              ${
                comment.author == logged_user.id
                  ? `
                    <div class="d-flex justify-content-center align-items-center">
                      <a id="edit-${comment.id}" style="color: var(--mainPurple); cursor: pointer; font-size: 0.8rem">edit</a>
                      <p style="margin: 0 5px 5px 5px; font-size: 1rem">|</p>
                      <a id="delete-${comment.id}" class="text-danger" style="cursor: pointer; font-size: 0.8rem">delete</a>
                    </div>
                  `
                  : ""
              }
            </div>
            <p>
              ${comment.content}
            </p>
          </div>
        </div>
      `;
      if (comment.author == logged_user.id) {
        setTimeout(() => {
          document
            .getElementById(`edit-${comment.id}`)
            .addEventListener("click", async () => {
              await editComment(comment, logged_user, post, userData);
            });
          document
            .getElementById(`delete-${comment.id}`)
            .addEventListener("click", async () => {
              await deleteComment(comment, logged_user, post);
            });
        }, 1000);
      }
    }
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }

  document.getElementById("commentButton").addEventListener("click", () => {
    document.querySelector("textarea").focus();
  });

  // when click the button to add new comment
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

// edit the comment
async function editComment(comment, logged_user, post, userData) {
  const commentHTML = document.getElementById(`comment-${comment.id}`);
  commentHTML.children[1].innerHTML = `
    <textarea id="editComment" class="form-control" rows="3" style="resize: none; overflow-wrap: break-word">${comment.content}</textarea>
    <button id="saveEdit-${comment.id}" class="btn btn-success mt-2">Save</button>
    <button id="cancelEdit-${comment.id}" class="btn btn-danger mt-2">Cancel</button>
  `;
  document
    .getElementById(`saveEdit-${comment.id}`)
    .addEventListener("click", async () => {
      const content = document.getElementById("editComment").value.trim();
      if (content === "") {
        alert("Please enter your comment");
        return;
      }
      comment.content = escape(content);
      try {
        await fetch(`${api}/comments/${comment.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            content: comment.content,
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
  document
    .getElementById(`cancelEdit-${comment.id}`)
    .addEventListener("click", () => {
      commentHTML.children[1].innerHTML = `
      <div class="d-flex justify-content-between" style="width: 100%">
      <a href="./../Account/Account.html?id=${userData.id}">${
        userData.firstName
      } ${userData.lastName}</a>
      ${
        comment.author == logged_user.id
          ? `
            <div class="d-flex justify-content-center align-items-center">
              <a id="edit-${comment.id}" style="color: var(--mainPurple); cursor: pointer; font-size: 0.8rem">edit</a>
              <p style="margin: 0 5px 5px 5px; font-size: 1rem">|</p>
              <a id="delete-${comment.id}" class="text-danger" style="cursor: pointer; font-size: 0.8rem">delete</a>
            </div>
          `
          : ""
      }
    </div>
    <p>
      ${comment.content}
    </p>
    `;
      if (comment.author == logged_user.id) {
        setTimeout(() => {
          document
            .getElementById(`edit-${comment.id}`)
            .addEventListener("click", async () => {
              await editComment(comment, logged_user, post, userData);
            });
          document
            .getElementById(`delete-${comment.id}`)
            .addEventListener("click", async () => {
              await deleteComment(comment, logged_user, post);
            });
        }, 1000);
      }
    });
}

// delete the comment
async function deleteComment(comment, logged_user, post) {
  // delete the comment from posts, users, comments data base
  if (confirm("Are you sure you want to delete this comment?")) {
    try {
      await fetch(`${api}/comments/${comment.id}`, {
        method: "DELETE",
      });
      logged_user.comments.splice(logged_user.comments.indexOf(comment.id), 1);
      post.comments.splice(post.comments.indexOf(comment.id), 1);
      await fetch(`${api}/users/${logged_user.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          comments: logged_user.comments,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      await fetch(`${api}/posts/${post.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          comments: post.comments,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      window.location.reload();
    } catch (error) {
      window.location.href = "./../error404/error404.html";
    }
  }
}

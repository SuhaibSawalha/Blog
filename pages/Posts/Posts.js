// get the type from the url
const type = new URLSearchParams(window.location.search).get("type");

// if there's a type and it's not one of the 4 types, redirect to posts page
if (
  type !== null &&
  type != "posts" &&
  type != "likes" &&
  type != "saves" &&
  type != "comments"
) {
  window.location.href = "./../Posts/Posts.html";
}

// get the logged user or null if there's no logged user and display the message according to that
const user_data = await setUserId();
if (user_data) {
  document.getElementById("message").className = "d-flex align-items-center";
  document.getElementById("message").innerHTML = `
        <i class="bi bi-file-post"><span><p>+</p></span></i> 
        <button class="btn btn-submit">Create Your Own Post</button>
    `;
  document.querySelector("#message button").onclick = () =>
    (window.location.href = "./../CreatePost/CreatePost.html");
} else {
  document.getElementById("message").innerHTML = `
        <h2 style="color: var(--mainPurple); font-family: var(--h1-font)">Please login to create your own posts!</h2>
    `;
}

// get all posts
async function getPosts() {
  try {
    const response = await fetch(`${api}/posts`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    return data;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

const all_posts = await getPosts();
let posts = [];
// if no user logged or no type is given, display all posts
if (!user_data || type === null) {
  posts = all_posts;
}
// if there's a user logged and a type is given, display the posts posted by the user
if (type === "posts") {
  for (const post of all_posts) {
    if (post.author === user_data.id) {
      posts.push(post);
    }
  }
}
// if there's a user logged and a type is given, display the posts liked by the user
if (type === "likes") {
  for (const post of all_posts) {
    if (post.likes.includes(user_data.id)) {
      posts.push(post);
    }
  }
}
// if there's a user logged and a type is given, display the posts saved by the user
if (type === "saves") {
  for (const post of all_posts) {
    if (post.saves.includes(user_data.id)) {
      posts.push(post);
    }
  }
}
// if there's a user logged and a type is given, display the posts commented by the user
if (type === "comments") {
  for (const post of all_posts) {
    console.log(post.comments, user_data.comments);
    for (const comment of user_data.comments) {
      if (post.comments.includes(comment)) {
        posts.push(post);
        break;
      }
    }
  }
}

// get the author name for each post
for (const post of posts) {
  try {
    const user = await fetch(`${api}/users/?id=${post.author}`);
    if (user.status !== 200) {
      throw new Error();
    }
    const userData = await user.json();
    post.authorName = `${userData[0].firstName} ${userData[0].lastName}`;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

// display the posts
function displayPosts() {
  // get at most 6 posts in the same page
  const start = document.getElementById("slide").innerHTML;
  document.getElementById("previous").classList.remove("disabled");
  document.getElementById("next").classList.remove("disabled");
  if (start == 1) {
    // disable the previous button if it's the first page
    document.getElementById("previous").classList.add("disabled");
  }
  if (start == Math.ceil(posts.length / 6)) {
    // disable the next button if it's the last page
    document.getElementById("next").classList.add("disabled");
  }
  const article = document.querySelector("article");
  article.innerHTML = ``;
  for (let i = (start - 1) * 6; i < Math.min(6 * start, posts.length); i++) {
    article.innerHTML += Card(posts[i]);
  }
}

displayPosts();

// build the card for each post
function Card(post) {
  return `
      <div class="post-card">
        <div class="post-card-header">
            <a href="./../Account/Account.html?id=${post.author}"><h5>${
    post.authorName
  }</h5></a>
        </div>
        <div class="post-card-title" style="overflow-wrap: break-word">
          <h5>${post.title.substr(0, 120)}${
    post.title.length > 120 ? "..." : ""
  }</h5>
        </div>
        <div class=line></div>
        <p class="post-card-text" style="overflow-wrap: break-word">${post.content.substr(
          0,
          200
        )}${post.content.length > 200 ? "..." : ""}</p>
  <div style="width: 1px; height: 100px"></div>
  <div class="post-card-info">
    <div>
        <p>${post.likes.length} like${post.likes.length === 1 ? "" : "s"}</p>
        <p>${post.comments.length} comment${
    post.comments.length === 1 ? "" : "s"
  }</p>
    </div>
    <a href="./../Post/Post.html?id=${
      post.id
    }" class="btn btn-outline-submit">Read More</a>
    </div>
    </div>
    `;
}

// change the page when clicking on the previous or next button

document.getElementById("previous").onclick = () => {
  const slide = document.getElementById("slide");
  slide.innerHTML = parseInt(slide.innerHTML) - 1;
  displayPosts();
};

document.getElementById("next").onclick = () => {
  const slide = document.getElementById("slide");
  slide.innerHTML = parseInt(slide.innerHTML) + 1;
  displayPosts();
};

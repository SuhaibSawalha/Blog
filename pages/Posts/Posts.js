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

const posts = await getPosts();
for (const post of posts) {
  try {
    const user = await fetch(`${api}/users/?id=${post.author}`);
    if (user.status !== 200) {
      throw new Error();
    }
    const userData = await user.json();
    post.author = `${userData[0].firstName} ${userData[0].lastName}`;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

function displayPosts() {
  const start = document.getElementById("slide").innerHTML;
  document.getElementById("previous").classList.remove("disabled");
  document.getElementById("next").classList.remove("disabled");
  if (start == 1) {
    document.getElementById("previous").classList.add("disabled");
  }
  if (start == Math.ceil(posts.length / 6)) {
    document.getElementById("next").classList.add("disabled");
  }
  const article = document.querySelector("article");
  article.innerHTML = ``;
  for (let i = (start - 1) * 6; i < Math.min(6 * start, posts.length); i++) {
    article.innerHTML += Card(posts[i]);
  }
}

displayPosts();

function Card(post) {
  return `
      <div class="post-card">
        <div class="post-card-header">
            <h5>${post.author}</h5>
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

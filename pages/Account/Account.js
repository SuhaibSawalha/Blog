import { User } from "./../../assets/classes/User.js";

async function displayPage() {
  const id = new URLSearchParams(window.location.search).get("id");

  const user_data = await setUserId();

  let myProfile = 0;
  if (window.location.search !== "") {
    if (isNaN(id) || isNaN(parseInt(id))) {
      window.location.href = "./Account.html";
    }
  } else if (user_data === null) {
    window.location.href = "./../Login/Login.html";
  } else {
    myProfile = true;
  }

  let profile, user_id;
  if (myProfile) {
    profile = new User();
    profile.objectValues(user_data);
    user_id = user_data.id;
  } else {
    const profile_data = await getProfile(id);
    profile = new User();
    profile.objectValues(profile_data);
    if (user_data) {
      const user = new User();
      user.objectValues(user_data);
      user_id = user_data.id;
      if (user.email === profile.email) {
        window.location.href = "./Account.html";
      } else {
        user_id = id;
      }
    } else {
      user_id = id;
    }
  }

  document.title = profile.fullName;
  document.querySelector("aside img").src = profile.photo;

  if (myProfile) {
    const p = document.createElement("p");
    p.className = "text-white mt-1 mb-0";
    p.innerHTML = `<span for="fileInput">change photo</span> | <span>unset photo</span>
                  <input type="file" id="fileInput" accept="image/*" capture="camera" style="display: none;">
    `;
    document.querySelector("aside").appendChild(p);
    document.querySelector("aside p span:first-child").onclick = () =>
      document.querySelector("#fileInput").click();
    document
      .getElementById("fileInput")
      .addEventListener("change", function () {
        const selectedFile = this.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
          changePhoto(user_id, event.target.result);
        };
        reader.readAsDataURL(selectedFile);
      });
    document.querySelector("aside p span:nth-child(2)").onclick = () =>
      resetPhoto(user_id);
  }

  const h2 = document.createElement("h2");
  h2.style.color = "var(--mainGreen)";
  h2.className = `text-center mt-${myProfile ? 2 : 3}`;
  h2.innerHTML = profile.fullName;
  document.querySelector("aside").appendChild(h2);

  if (myProfile) {
    const section = document.createElement("section");
    section.innerHTML = `
        <button class="btn btn-outline-submit">
          <i class="bi bi-file-post"></i> Posts
        </button>
        <button class="btn btn-outline-submit">
          <i class="bi bi-hand-thumbs-up"></i> Likes
        </button>
        <button class="btn btn-outline-submit">
          <i class="bi bi-chat-dots"></i> Comments
        </button>
        <button class="btn btn-outline-submit">
          <i class="bi bi-file-earmark"></i> Saves
        </button>
    `;
    document.querySelector("aside").appendChild(section);
  }

  window.addEventListener("scroll", function () {
    this.document.querySelector("aside").style.marginTop = `${this.scrollY}px`;
  });

  if (myProfile) {
    const div = document.createElement("div");
    div.id = "createPost";
    div.className = "d-flex justify-content-center align-items-center";
    div.innerHTML = `
      <i class="bi bi-file-post"><span><p>+</p></span></i> 
      <button class="btn btn-submit">Create New Post</button>
    `;
    document.getElementById("posts").appendChild(div);
    setTimeout(() => {
      document.querySelector("#createPost button").onclick = () =>
        (window.location.href = "./../CreatePost/CreatePost.html");
    }, 1000);
  }
  const posts = await getPosts(user_id);
  const article = document.createElement("article");
  for (const post of posts) {
    article.innerHTML += Card(post);
  }
  document.getElementById("posts").appendChild(article);
}

displayPage();

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

async function changePhoto(id, photo) {
  await setPhoto(id, photo);
}

async function resetPhoto(id) {
  await setPhoto(id, "./../../assets/img/profile.jpg");
}

async function setPhoto(id, photo) {
  try {
    const response = await fetch(`${api}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photo }),
    });
    if (response.status !== 200) {
      throw new Error();
    }
    window.location.reload();
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

async function getPosts(id) {
  try {
    const response = await fetch(`${api}/posts/?author=${id}`);
    if (response.status !== 200) {
      throw new Error();
    }
    const data = await response.json();
    return data;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

function Card(post) {
  return `
    <div class="post-card">
      <div class="post-card-title">
        <h5>${post.title.substr(0, 120)}${
    post.title.length > 120 ? "..." : ""
  }</h5>
      </div>
      <div class=line></div>
      <p class="post-card-text">${post.content.substr(0, 200)}${
    post.content.length > 200 ? "..." : ""
  }</p>
    <div style="width: 1px; height: 40px"></div>
      <a href="./../Post/Post.html?id=${
        post.id
      }" class="btn btn-outline-submit">Read More</a>
    </div>
  `;
}

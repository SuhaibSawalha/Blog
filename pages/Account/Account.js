import { User } from "./../../assets/classes/User.js";

// build a function to display the page
async function displayPage() {
  // get the id in the url query string if it exists
  const id = new URLSearchParams(window.location.search).get("id");

  // get the current user logged in or null if no user is logged in
  const user_data = await setUserId();

  // set a boolean to check if the profile belongs to the current user logged in
  let myProfile = 0;

  if (window.location.search !== "") {
    // if the url query string is not empty
    if (isNaN(id) || isNaN(parseInt(id))) {
      // if the id is not a number, redirect to this page without the query string
      window.location.href = "./Account.html";
    }
  } else if (user_data === null) {
    // if the url query string is empty and no user is logged in, redirect to login page
    window.location.href = "./../Login/Login.html";
  } else {
    // if the url query string is empty and a user is logged in, then this page is his profile
    myProfile = true;
  }

  // create a variable to store the profile data and another one to store the user id
  let profile, user_id;

  if (myProfile) {
    // if this page is the current user profile, then profile will be equal to user_data
    profile = new User();
    profile.objectValues(user_data);
    user_id = user_data.id;
  } else {
    // if this page is not the current user profile yet, we need to check again and set the values

    // set profile to the profile_data getting from the id taken from the url query string
    const profile_data = await getProfile(id);
    profile = new User();
    profile.objectValues(profile_data);
    if (user_data) {
      const user = new User();
      user.objectValues(user_data);
      user_id = user_data.id;
      if (user.email === profile.email) {
        // if the current user is the same as the profile, redirect to this page without the query string
        window.location.href = "./Account.html";
      } else {
        user_id = id;
      }
    } else {
      user_id = id;
    }
  }

  document.title = unescape(profile.fullName); // add the title of the page to the profile name and it should be unescaped
  document.querySelector("aside img").src = profile.photo; // set the profile photo

  // if the profile is the current user profile, then add the change photo and reset photo buttons
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

  // add the profile name
  const h2 = document.createElement("h2");
  h2.style.color = "var(--mainGreen)";
  h2.className = `text-center mt-${myProfile ? 2 : 3}`;
  h2.innerHTML = profile.fullName;
  document.querySelector("aside").appendChild(h2);

  // if the profile is the current user profile, then add the personal actions buttons
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
        <button class="btn btn-outline-submit">
          <i class="bi bi-journal-album"></i> Albums
        </button>
    `;
    document.querySelector("aside").appendChild(section);
    setTimeout(() => {
      document.querySelector("aside section button:first-child").onclick = () =>
        (window.location.href = "./../Posts/Posts.html?type=posts");
      document.querySelector("aside section button:nth-child(2)").onclick =
        () => (window.location.href = "./../Posts/Posts.html?type=likes");
      document.querySelector("aside section button:nth-child(3)").onclick =
        () => (window.location.href = "./../Posts/Posts.html?type=comments");
      document.querySelector("aside section button:nth-child(4)").onclick =
        () => (window.location.href = "./../Posts/Posts.html?type=saves");
      document.querySelector("aside section button:last-child").onclick = () =>
        (window.location.href = "./../Albums/Albums.html?id=" + user_id);
    }, 1000);
  }

  window.addEventListener("scroll", function () {
    if (this.window.innerWidth > 1199.5) {
      this.document.querySelector(
        "aside"
      ).style.marginTop = `${this.scrollY}px`;
    }
  });

  // if the profile is the current user profile, then add the create post button
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
  // display the posts of the profile in cards
  const posts = await getPosts(user_id);
  const article = document.createElement("article");
  for (const post of posts) {
    article.innerHTML += Card(post);
  }
  document.getElementById("posts").appendChild(article);
}

displayPage();

// build a function to get the profile data from it's id
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

// build a function to change the profile photo
async function changePhoto(id, photo) {
  await setPhoto(id, photo);
}

// build a function to reset the profile photo
async function resetPhoto(id) {
  await setPhoto(id, "./../../assets/img/profile.jpg");
}

// build a function to set the profile photo
async function setPhoto(id, photo) {
  // PATCH users table with the given id to change the photo
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

// build a function to get the posts of the profile
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

// build a function to create a card for each post
function Card(post) {
  return `
    <div class="post-card">
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
    <div style="width: 1px; height: 40px"></div>
      <a href="./../Post/Post.html?id=${
        post.id
      }" class="btn btn-outline-submit">Read More</a>
    </div>
  `;
}

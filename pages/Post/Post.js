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
    console.log(await setUserId());
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
            <h5 style="color: var(--mainGreen)">${author.firstName} ${author.lastName}</h5>
            <h5 style="color: var(--mainGreen); margin-bottom: 30px">${post.date}</h5>
        </div>
        <h2 style="font-family: var(--h1-font)">${post.title}</h2>
        <div class="line"></div>
        <p style="font-family: var(--content-font)">${post.content}</p>
    `;
    // await displayLikes();
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

// async function displayLikes() {
//   const id = new URLSearchParams(window.location.search).get("id");
//   try {
//     const response = await fetch(`${api}/posts/${id}`);
//     if (response.status !== 200) {
//       throw new Error();
//     }
//     const data = await response.json();
//   } catch (error) {
//     window.location.href = "./../error404/error404.html";
//   }
// }

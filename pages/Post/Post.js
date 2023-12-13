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
    const post = new Post();
    post.objectValues(data);
    console.log(post.content);
    document.querySelector("article").innerHTML = `
        <div class="d-flex justify-content-between">
            <h5 style="color: var(--mainGreen)">${post.author}</h5>
            <h5 style="color: var(--mainGreen); margin-bottom: 30px">${post.date}</h5>
        </div>
        <h2 style="font-family: var(--h1-font)">${post.title}</h2>
        <div class="line"></div>
        <p style="font-family: var(--content-font)">${post.content}</p>
    `;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}
displayPost();

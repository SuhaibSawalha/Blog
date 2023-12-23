let users;
try {
  const usersResponse = await fetch(`${api}/users`);
  if (usersResponse.status !== 200) {
    throw new Error();
  }
  const usersData = await usersResponse.json();
  users = usersData;
} catch (error) {
  window.location.href = "./../error404/error404.html";
}

const id = new URLSearchParams(window.location.search).get("id");
if (window.location.search !== "") {
  if (isNaN(id) || isNaN(parseInt(id))) {
    window.location.href = "./../Albums/Albums.html";
  }
  try {
    const user = users.find((user) => {
      return user.id == id;
    });
    document.querySelector(
      "input"
    ).value = `${user.firstName} ${user.lastName}`;

    const albumsResponse = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}/albums`
    );
    if (albumsResponse.status !== 200) {
      throw new Error();
    }

    const albumsData = await albumsResponse.json();
    const albumsContainer = document.getElementById("Albums");
    albumsContainer.innerHTML = "";
    let innerAlbums = "";
    for (const album of albumsData) {
      innerAlbums += `
        <div class="card">
            <img src=${user.photo} alt="users photo" class="card-img-top"/>
            <div class="card-body">
                <h5>${album.title}</h5>
                <a href="./../Album/Album.html?id=${album.id}" class="btn btn-submit">Show Album</a>
            </div>
        </div>
      `;
    }
    document.getElementById("loading").style.display = "none";
    setTimeout(() => {
      albumsContainer.innerHTML = innerAlbums;
    }, 100);
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
} else {
  document.getElementById("loading").style.display = "none";
}

function Search() {
  const search = this.value;
  const results = users.filter((user) => {
    let j = 0;
    const userName = `${user.firstName} ${user.lastName}`;
    for (let i = 0; i < userName.length; ++i) {
      if (userName.toLowerCase()[i] === search.toLowerCase()[j]) {
        j++;
      }
      if (j === search.length) {
        return true;
      }
    }
    return false;
  });
  const resultsContainer = document.getElementById("results");
  const rect = this.getBoundingClientRect();
  resultsContainer.style.top = `${rect.bottom - 5}px`;
  resultsContainer.style.left = `${rect.left}px`;
  resultsContainer.style.display = "block";
  resultsContainer.style.width = `${rect.width}px`;
  resultsContainer.innerHTML = "";
  for (let i = 0; i < Math.min(results.length, 5); ++i) {
    resultsContainer.innerHTML += `<li><a href="./../Albums/Albums.html?id=${results[i].id}">${results[i].firstName} ${results[i].lastName}</a></li>`;
  }
}

document.querySelector("input").addEventListener("input", Search);
document.querySelector("input").addEventListener("click", Search);
document.querySelector("input").addEventListener("blur", () =>
  setTimeout(() => {
    document.getElementById("results").style.display = "none";
  }, 500)
);

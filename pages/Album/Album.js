const id = new URLSearchParams(window.location.search).get("id");
if (window.location.search !== "") {
  if (isNaN(id) || isNaN(parseInt(id))) {
    window.location.href = "./../error404/error404.html";
  }
  try {
    const albumResponse = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}`
    );
    if (albumResponse.status !== 200) {
      throw new Error();
    }
    const albumData = await albumResponse.json();
    const user_id = albumData.userId;
    const userResponse = await fetch(
      `https://jsonplaceholder.typicode.com/users/${user_id}`
    );
    if (userResponse.status !== 200) {
      throw new Error();
    }
    const userData = await userResponse.json();

    const photosResponse = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}/photos`
    );
    if (photosResponse.status !== 200) {
      throw new Error();
    }
    const photosData = await photosResponse.json();

    const photosContainer = document.querySelector("article");
    photosContainer.innerHTML = "";
    let innerAlbums = "";
    for (const photo of photosData) {
      const image_response = await fetch("https://picsum.photos/150/150");
      const image_data = await image_response.blob();
      const image = URL.createObjectURL(image_data);
      console.log(photo);
      photosContainer.innerHTML += `
        <div class="card">
            <img src=${image} alt="users photo" class="card-img-top"/>
            <div class="card-body">
                <h5>${photo.title}</h5>
            </div>
        </div>
      `;
    }
    document.getElementById("loading").style.display = "none";
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

// get the id from the url
const id = new URLSearchParams(window.location.search).get("id");
if (window.location.search !== "") {
  if (isNaN(id) || isNaN(parseInt(id))) {
    // check if the id isn't a number, then redirect to error page
    window.location.href = "./../error404/error404.html";
  }
  try {
    // get the album from the api
    const albumResponse = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}`
    );
    if (albumResponse.status !== 200) {
      throw new Error();
    }

    // get the photos of the album from the api
    const photosResponse = await fetch(
      `https://jsonplaceholder.typicode.com/albums/${id}/photos`
    );
    if (photosResponse.status !== 200) {
      throw new Error();
    }
    const photosData = await photosResponse.json();

    // fill the photos container with the photos
    const photosContainer = document.querySelector("article");
    photosContainer.innerHTML = "";
    for (const photo of photosData) {
      // get a random image from the api
      const image_response = await fetch("https://picsum.photos/150/150");
      const image_data = await image_response.blob();
      const image = URL.createObjectURL(image_data);
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

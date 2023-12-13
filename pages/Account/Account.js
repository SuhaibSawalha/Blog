import { User } from "./../../assets/classes/User.js";

async function displayPage() {
  await setUserId();
  if (!getCookie("user_id")) {
    window.location.href = "./../Login/Login.html";
  }
  const response = await fetch(`${api}/users/${getCookie("user_id")}`);
  const data = await response.json();
  const user = new User();
  user.objectValues(data);
  document.title = user.fullName;
}

displayPage();

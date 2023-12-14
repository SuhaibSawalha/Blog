import { User } from "./../../assets/classes/User.js";

async function displayPage() {
  const user_data = await setUserId();
  if (user_data === null) {
    window.location.href = "./../Login/Login.html";
  }
  const user = new User();
  user.objectValues(user_data);
  document.title = user.fullName;
}

displayPage();

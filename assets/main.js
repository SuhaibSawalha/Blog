const api = "http://localhost:3000";

function setCookie(name, value, daysToExpire) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

async function createSession(session_id, user_id) {
  setCookie("session_id", session_id, 365);
  try {
    const response = await fetch(`${api}/sessions`, {
      method: "POST",
      body: JSON.stringify({
        session_id: session_id,
        user_id: user_id,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status !== 201) {
      throw new Error();
    }
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

async function setUserId() {
  const session_id = getCookie("session_id");
  if (!session_id) {
    setCookie("user_id", "", 0);
    return;
  }
  try {
    const response = await fetch(`${api}/sessions/?session_id=${session_id}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    if (data.length !== 0) {
      setCookie("user_id", data[0].user_id, 365);
      return;
    }
    setCookie("user_id", "", 0);
    setCookie("session_id", "", 0);
  } catch (error) {
    setCookie("user_id", "", 0);
    setCookie("session_id", "", 0);
  }
}

async function setUserName() {
  await setUserId();
  if (!getCookie("user_id")) {
    return;
  }
  try {
    const response = await fetch(`${api}/users/${getCookie("user_id")}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    setCookie("UserName", `${data.firstName} ${data.lastName}`, 365);
    return;
  } catch (error) {
    setCookie("UserName", "", 0);
  }
}

function Logout() {
  setCookie("session_id", "", 0);
  window.location.href = "./../Home/Home.html";
}

function escape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

async function getPosts() {
  const response = await fetch(`${api}/users`);
  const data = await response.json();
  console.log(data);
}
// getPosts();

// document.getElementById("myForm").addEventListener("submit", function (e) {
//   event.preventDefault();
//   fetch(`${api}/posts`, {
//     method: "POST",
//     body: JSON.stringify({
//       author: "John Doe",
//       title: "My new post",
//       content:
//         "Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo, quia.",
//       comments: [],
//     }),
//     headers: {
//       "Content-type": "application/json; charset=UTF-8",
//     },
//   });
//   window.location.href = "./test.html";
// });

// var bcrypt = require("bcrypt");

// import bcrypt from "./../node_modules/bcryptjs/dist/bcrypt.js";

// the link of the api used to store the data
// the data are: users, sessions, posts, comments
const api = "http://localhost:3000";

// build a function to create a cookie or set the value of it if it already exists
function setCookie(name, value, daysToExpire) {
  const date = new Date();
  date.setTime(date.getTime() + daysToExpire * 24 * 60 * 60 * 1000); // date object deals with milliseconds so we user daysToExpire * 24 * 60 * 60 * 1000 to convert days to milliseconds
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// build a function to get the value of a cookie
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

// build a function to create a session for a user
async function createSession(session_id, user_id) {
  // set the cookie with the session_id and it expires after a year
  setCookie("session_id", session_id, 365);
  // add the session to sessions table
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

// build a function to get the user logged in or null if no user is logged in
// this function will get the user id from the session_id cookie
async function setUserId() {
  const session_id = getCookie("session_id");
  if (session_id === null) {
    return null;
  }
  try {
    const response = await fetch(`${api}/sessions/?session_id=${session_id}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    if (data.length !== 0) {
      const user_response = await fetch(`${api}/users/${data[0].user_id}`);
      if (user_response.status !== 200) {
        throw new Error();
      }
      const user_data = await user_response.json();
      return user_data;
    }
    throw new Error();
  } catch (error) {
    setCookie("session_id", "", 0);
    return null;
  }
}

// build a function to logout a user by setting the session_id cookie to empty
function Logout() {
  setCookie("session_id", "", 0);
  window.location.href = "./../Home/Home.html";
}

// build a function to escapse a string to render in HTML safely
function escape(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/'/g, "&#39;")
    .replace(/`/g, "&#96;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

// build a function to unescape a string when use it without HTML
function unescape(str) {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&#39;/g, "'")
    .replace(/&#96;/g, "`")
    .replace(/&quot;/g, '"')
    .replace(/<br>/g, "\n")
    .replace(/&amp;/g, "&");
}

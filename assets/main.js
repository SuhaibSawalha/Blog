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

if ((await setUserId()) !== null) {
  window.location.href = "./../Home/Home.html";
}

document.getElementsByTagName("i")[0].addEventListener("click", function () {
  if (this.classList.contains("bi-eye")) {
    this.classList.remove("bi-eye");
    this.classList.add("bi-eye-slash");
    document.querySelector(`input[aria-label="password"`).type = "text";
  } else {
    this.classList.remove("bi-eye-slash");
    this.classList.add("bi-eye");
    document.querySelector(`input[aria-label="password"`).type = "password";
  }
});

function writeWarning(input, message) {
  input.previousElementSibling.previousElementSibling.querySelector(
    "span"
  ).innerHTML = message ? `&nbsp;&nbsp;&nbsp;*${message}` : ``;
}

let usedEmail;
document
  .getElementsByTagName("form")[0]
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const firstName = document.querySelector(`input[aria-label="first-name"`);
    const lastName = document.querySelector(`input[aria-label="last-name"`);
    const email = document.querySelector(`input[aria-label="email"`);
    const password = document.querySelector(`input[aria-label="password"`);
    const confirmPassword = document.querySelector(
      `input[aria-label="confirm-password"`
    );
    let ok = true;
    if (firstName.value.trim() === "") {
      writeWarning(firstName, "can't be empty");
      ok = false;
    } else {
      writeWarning(firstName, "");
    }
    if (lastName.value.trim() === "") {
      writeWarning(lastName, "can't be empty");
      ok = false;
    } else {
      writeWarning(lastName, "");
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) === false) {
      writeWarning(email, "invalid email");
      ok = false;
    }
    await checkEmail(email.value);
    if (usedEmail === true) {
      writeWarning(email, "this email is used");
      ok = false;
    } else {
      writeWarning(email, "");
    }
    if (password.value.length < 8) {
      writeWarning(password, "8 characters at least");
      ok = false;
    } else {
      writeWarning(password, "");
    }
    if (password.value !== confirmPassword.value) {
      writeWarning(confirmPassword, "passwords don't match");
      ok = false;
    } else {
      writeWarning(confirmPassword, "");
    }
    if (!ok) {
      return;
    }
    await createUser(
      firstName.value,
      lastName.value,
      email.value,
      password.value
    );
  });

import { User } from "./../../assets/classes/User.js";

async function createUser(firstName, lastName, email, password) {
  try {
    const user = new User();
    user.defalutValues(firstName, lastName, email, password);
    const response = await fetch(`${api}/signup`, {
      method: "POST",
      body: user.toDataBase(),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status !== 201) {
      throw new Error();
    }
    const data = await response.json();
    await createSession(data.accessToken, data.user.id);
    window.location.href = "./../Account/Account.html";
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

async function checkEmail(email) {
  try {
    const response = await fetch(`${api}/users?email=${email}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    if (data.length !== 0) {
      usedEmail = true;
    } else {
      usedEmail = false;
    }
    return response;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

const firstName = document.querySelector(`input[aria-label="first-name"`);
const lastName = document.querySelector(`input[aria-label="last-name"`);
const email = document.querySelector(`input[aria-label="email"`);
const password = document.querySelector(`input[aria-label="password"`);
const confirmPassword = document.querySelector(
  `input[aria-label="confirm-password"`
);
firstName.value = "Suhaib";
lastName.value = "Sawalha";
email.value = "suhaib@suhaib.com";
password.value = "suhaibsuhaib";
confirmPassword.value = "suhaibsuhaib";

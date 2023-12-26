// if a user is logged in, redirect him to home page
if ((await setUserId()) !== null) {
  window.location.href = "./../Home/Home.html";
}

// show and hide password
document.getElementsByTagName("i")[0].addEventListener("click", function () {
  if (this.classList.contains("bi-eye")) {
    this.classList.remove("bi-eye");
    this.classList.add("bi-eye-slash");
    document.querySelector(`input[aria-label="password"`).type = "password";
  } else {
    this.classList.remove("bi-eye-slash");
    this.classList.add("bi-eye");
    document.querySelector(`input[aria-label="password"`).type = "text";
  }
});

// write warning message
function writeWarning(input, message) {
  input.previousElementSibling.previousElementSibling.querySelector(
    "span"
  ).innerHTML = message ? `&nbsp;&nbsp;&nbsp;*${message}` : ``;
}

// submit the form
document
  .getElementsByTagName("form")[0]
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    // check the first name, last name, email, password and confirm password
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
    if ((await checkEmail(email.value)) === true) {
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
    // create the user
    await createUser(
      firstName.value,
      lastName.value,
      email.value,
      password.value
    );
  });

import { User } from "./../../assets/classes/User.js";

// build a function to create a user and save it in the databases
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
    // create a session for the user
    await createSession(data.accessToken, data.user.id);
    window.location.href = "./../Account/Account.html";
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

// build a function to check if the email is used before
async function checkEmail(email) {
  try {
    const response = await fetch(`${api}/users?email=${email}`);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error();
    }
    if (data.length !== 0) {
      return true;
    }
    return false;
  } catch (error) {
    window.location.href = "./../error404/error404.html";
  }
}

// if a user is logged in, redirect him to the home page
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
    // check the email, password and confirm password
    const email = document.querySelector(`input[aria-label="email"`);
    const password = document.querySelector(`input[aria-label="password"`);
    const confirmPassword = document.querySelector(
      `input[aria-label="confirm-password"`
    );
    let ok = true,
      id;
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) === false) {
      writeWarning(email, "invalid email");
      ok = false;
    } else {
      const resp = await checkEmail(email, ok);
      if (resp === null) {
        ok = false;
      } else {
        id = resp.id;
      }
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
    try {
      // change the password in the data base
      const response = await fetch(`${api}/users/` + id, {
        method: "PATCH",
        body: JSON.stringify({
          password: password.value,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });
      if (response.status !== 200) {
        throw new Error();
      }
      window.location.href = "./../Account/Account.html";
    } catch (error) {
      window.location.href = "./../error404/error404.html";
    }
  });

// build a function to check if the email exists and return the user data
async function checkEmail(email, ok) {
  try {
    const response = await fetch(`${api}/users?email=` + email.value, {
      method: "GET",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status !== 200) {
      throw new Error();
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error();
    }
    writeWarning(email, "");
    return data[0];
  } catch (error) {
    writeWarning(email, "email doesn't exist");
    return null;
  }
}

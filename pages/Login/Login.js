// if a user is logged in, redirect to home page
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
function writeMessage() {
  if (document.getElementById("incorrect")) {
    return;
  }
  const incorrect = document.createElement("p");
  incorrect.id = "incorrect";
  incorrect.innerHTML = "* email or password is incorrect";
  incorrect.style.color = "#dc3545";
  incorrect.style.marginBottom = "10px";
  document
    .querySelector("form a")
    .parentElement.insertBefore(incorrect, document.querySelector("form a"));
}

// submit the form
document
  .getElementsByTagName("form")[0]
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    // check the email and password
    const email = document.querySelector(`input[aria-label="email"`);
    const password = document.querySelector(`input[aria-label="password"`);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) === false) {
      writeMessage();
      return;
    }
    await checkLogin(email.value, password.value);
  });

// build a function to check if the email and the password are correct for some user to log him
async function checkLogin(email, password) {
  try {
    const response = await fetch(`${api}/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (response.status !== 200) {
      throw new Error();
    }
    const data = await response.json();
    if (data.length === 0) {
      writeMessage();
      return;
    }
    // create a session for the user
    await createSession(data.accessToken, data.user.id);
    window.location.href = "./../Account/Account.html";
  } catch (error) {
    writeMessage();
  }
}

await setUserId();
if (getCookie("user_id")) {
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

//.parentElement.insertBefore

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

document
  .getElementsByTagName("form")[0]
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.querySelector(`input[aria-label="email"`);
    const password = document.querySelector(`input[aria-label="password"`);
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) === false) {
      writeMessage();
      return;
    }
    await checkLogin(email.value, password.value);
  });

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
    await createSession(data.accessToken, data.user.id);
    window.location.href = "./../Account/Account.html";
  } catch (error) {
    writeMessage();
  }
}

const email = document.querySelector(`input[aria-label="email"`);
const password = document.querySelector(`input[aria-label="password"`);
email.value = "suhaib@suhaib.com";
password.value = "suhaibsuhaib";

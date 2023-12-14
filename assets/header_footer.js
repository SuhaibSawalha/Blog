await setUserId();
const header = (document.getElementsByTagName("header")[0].innerHTML = `
<nav class="navbar fixed-top navbar-expand-lg">
    <div class="container">
    <a class="navbar-brand text-white" href="./../Home/Home.html">
        <img
        src="./../../assets/img/logo.png"
        alt="Logo"
        width="30"
        height="24"
        class="d-inline-block align-text-top"
        />
        Blog
    </a>
    <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
    >
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <div>
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item ${
          window.location.href.endsWith("Home.html") ? "nav-active" : ""
        }">
            <a class="nav-link" aria-current="page" href="./../Home/Home.html">Home</a>
        </li>
        <li class="nav-item ${
          window.location.href.endsWith("Account.html") ? "nav-active" : ""
        }">
            <a class="nav-link" href="./../Account/Account.html">Account</a>
        </li>
        <li class="nav-item ${
          window.location.href.endsWith("Posts.html") ? "nav-active" : ""
        }">
            <a class="nav-link" href="./../Posts/Posts.html">Posts</a>
        </li>
        <li class="nav-item ${
          window.location.href.endsWith("Albums.html") ? "nav-active" : ""
        }">
            <a class="nav-link" href="./../Albums/Albums.html">Albums</a>
        </li>
      </div>
        <div class="logs">
        ${
          (await setUserId()) !== null
            ? `<li class="nav-item">
            <a class="nav-link" href="#" onclick="Logout()">Logout</a>
            </li>`
            : `<li class="nav-item ${
                window.location.href.endsWith("Login.html")
                  ? "nav-active-logs"
                  : ""
              }">
            <a class="nav-link" href="./../Login/Login.html">Login</a>
            </li>
            <h3 class="text-white">|</h3>
            <li class="nav-item ${
              window.location.href.endsWith("Signup.html")
                ? "nav-active-logs"
                : ""
            }">
            <a class="nav-link" href="./../Signup/Signup.html">Signup</a>
            </li>`
        }
        </div>
        </ul>
    </div>
    </div>
</nav>
`);

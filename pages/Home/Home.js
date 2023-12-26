const overlay = document.createElement("button");
const rect = document.querySelector("iframe").getBoundingClientRect();
const rect2 = document.querySelector("main").getBoundingClientRect();
overlay.style.width = `${rect.width}px`;
overlay.style.height = `${rect.height}px`;
overlay.style.position = "absolute";
overlay.style.top = `${rect.top}px`;
overlay.style.left = `${rect.left}px`;
window.addEventListener("resize", () => {
  const rect = document.querySelector("iframe").getBoundingClientRect();
  overlay.style.width = `${rect.width}px`;
  overlay.style.left = `${rect.left}px`;
});
overlay.style.backgroundColor = "white";
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = 1000;
overlay.style.cursor = "pointer";
overlay.innerHTML = `
    <h1>CLICK ME</h1>
`;
document.body.appendChild(overlay);
overlay.addEventListener("click", () => {
  overlay.remove();
});

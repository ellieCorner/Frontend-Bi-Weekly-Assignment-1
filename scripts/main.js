const container = document.getElementById("extensions");
const filterButtons = document.querySelectorAll(".filter-btn");

let extensionsData = [];
let currentFilter = "all";

fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    extensionsData = data;
    renderExtensions(currentFilter);
  });

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderExtensions(currentFilter);
  });
});

function renderExtensions(filter) {
  container.innerHTML = "";
  const filtered = extensionsData.filter((ext) => {
    if (filter === "active") return ext.isActive;
    if (filter === "inactive") return !ext.isActive;
    return true;
  });

  filtered.forEach(({ logo, name, description, isActive }) => {
    const card = document.createElement("div");
    card.className = "extension-card";
    card.innerHTML = `
      <div class="top">
        <img src="${logo}" alt="${name}" />
        <div class="text">
          <h3>${name}</h3>
          <p>${description}</p>
        </div>
      </div>
      <div class="actions">
        <button class="remove-btn">Remove</button>
        <input type="checkbox" class="toggle" ${isActive ? "checked" : ""}>
      </div>
    `;

    card.querySelector(".remove-btn").addEventListener("click", () => {
      extensionsData = extensionsData.filter((ext) => ext.name !== name);
      renderExtensions(currentFilter);
    });

    card.querySelector(".toggle").addEventListener("change", (e) => {
      const target = extensionsData.find((ext) => ext.name === name);
      if (target) {
        target.isActive = e.target.checked;
        renderExtensions(currentFilter);
      }
    });

    container.appendChild(card);
  });
}

const themeToggleBtn = document.getElementById("theme-toggle");
const body = document.body;

themeToggleBtn.addEventListener("click", () => {
  body.classList.toggle("light");
  body.classList.toggle("dark");

  const currentTheme = body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("theme", currentTheme);
});

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    body.classList.remove("dark");
    body.classList.add("light");
  }
});

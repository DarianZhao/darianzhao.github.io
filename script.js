const yearElement = document.querySelector("#copyrightYear");

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

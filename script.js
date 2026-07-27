const root = document.documentElement;
const timeElement = document.querySelector("#localTime");
const yearElement = document.querySelector("#copyrightYear");
const revealElements = document.querySelectorAll(".reveal");

const updateLondonTime = () => {
  if (!timeElement) return;

  const now = new Date();
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);

  timeElement.textContent = time;
  timeElement.dateTime = now.toISOString();
};

const updateScrollProgress = () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  root.style.setProperty("--scroll-progress", `${progress}%`);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("isVisible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
);

revealElements.forEach((element) => revealObserver.observe(element));

window.addEventListener("pointermove", (event) => {
  root.style.setProperty("--cursor-x", `${event.clientX}px`);
  root.style.setProperty("--cursor-y", `${event.clientY}px`);
});

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);

if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

updateLondonTime();
updateScrollProgress();
window.setInterval(updateLondonTime, 30_000);

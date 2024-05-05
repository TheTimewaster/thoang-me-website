import { debounce } from "throttle-debounce";

const header = document.querySelector(".header");
const onScroll = debounce(25, () => {
  if (header == null) return;

  if (window.scrollY > 0) {
    header.classList.add(
      "bg-peach/20",
      "[backdrop-filter:blur(40px)]",
      "dark:bg-lavender-900/20"
    );
  } else {
    header.classList.remove(
      "bg-peach/20",
      "[backdrop-filter:blur(40px)]",
      "dark:bg-lavender-900/20"
    );
  }
});

window.addEventListener("scroll", () => {
  onScroll();
});

import { debounce } from "throttle-debounce";

const navigation = document.getElementById("navigation");
const links = document.querySelectorAll(".navigation__link");
let isMenuOpen = false;

const openMenu = () => {
  if (navigation == null) return;
  // now we are opening the menu
  navigation.classList.add("translate-x-0");

  // show links
  setTimeout(() => {
    links.forEach((link, index) => {
      link.classList.remove("opacity-0");
      // delay transition
      (link as HTMLElement).style.transitionDelay = `${index * 100
        }ms`;
    });
  }, 300);

  // cleanup to make sure, that hover effect works without delay
  setTimeout(() => {
    links.forEach((link) => {
      // cleanup
      (link as HTMLElement).style.transitionDelay = "";
    });
  }, 300 + links.length * 100);

  isMenuOpen = true;
};

const closeMenu = () => {
  if (navigation == null) return;

  // now we are closing the menu
  navigation.classList.remove("translate-x-0");

  // hide links
  setTimeout(() => {
    links.forEach((link) => {
      link.classList.add("opacity-0");
      // cleanup
      (link as HTMLElement).style.transitionDelay = "";
    });
  }, 300);

  isMenuOpen = false;
};

links.forEach((link) => {
  link.addEventListener("click", ($event) => {
    $event.preventDefault();
    const target = ($event.currentTarget as HTMLAnchorElement).href.replace(
      window.location.origin + "/",
      ""
    );
    window.scrollTo({
      top: (document.querySelector(target) as HTMLElement).offsetTop - 100,
      behavior: "smooth",
    });

    closeMenu();
  });
});

const toggleBtn = document.querySelector("#menu-toggle");
if (toggleBtn != null) {
  toggleBtn.addEventListener("click", () => toggleMenu());
}
const toggleMenu = (forceClosing = false) => {
  if (forceClosing) {
    isMenuOpen = false;
    closeMenu();
    return;
  }

  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
};

const menuCloseBtn = document.querySelector("#menu-close");
if (menuCloseBtn != null) {
  menuCloseBtn.addEventListener("click", closeMenu);
}

const handleResize = debounce(100, () => {
  if (window.innerWidth > 1024) {
    toggleMenu(true);
  }
});
window.addEventListener("resize", handleResize);
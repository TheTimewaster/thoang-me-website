document.addEventListener("DOMContentLoaded", async () => {
  const doc = document.documentElement;
  const { switchColor, stop, resume, isPlaying } = await import("./pixi");
  const initalDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  const getIsDarkMode = () => doc.classList.contains("dark");
  const getIsLightMode = () => getIsDarkMode() === false;

  // control icons
  const moonIcon = document.querySelector(".theme-toggle__moon");
  const sunIcon = document.querySelector(".theme-toggle__sun");

  if (initalDark) {
    doc.classList.add("dark");
  } else {
    doc.classList.add("light");
  }

  if (moonIcon != null && sunIcon != null) {
    if (initalDark) {
      sunIcon.classList.add("hidden");
    } else {
      moonIcon.classList.add("hidden");
    }

    // now prepare transition events
    moonIcon.addEventListener("transitionend", () => {
      if (getIsLightMode()) {
        // moon is about to disappear, so hide it
        moonIcon.classList.add("hidden");
        // once the transition is done, show the other icon
        sunIcon.classList.remove(
          "translate-y-full",
          "hidden",
          "absolute"
        );
      } else {
        sunIcon.classList.remove("absolute");
        sunIcon.classList.add("hidden");
      }
    });

    sunIcon.addEventListener("transitionend", () => {
      if (getIsDarkMode()) {
        // sun is about to disappear, so hide it
        sunIcon.classList.add("hidden");
        // once the transition is done, show the other icon
        moonIcon.classList.remove(
          "translate-y-full",
          "hidden",
          "absolute"
        );
      } else {
        moonIcon.classList.remove("absolute");
        moonIcon.classList.add("hidden");
      }
    });
  }

  const switchTheme = (event: MediaQueryListEvent | boolean) => {
    const preferDarkMode =
      typeof event === "boolean" ? event : event.matches;

    if (preferDarkMode) {
      doc.classList.add("dark");
      doc.classList.remove("light");
    } else {
      doc.classList.add("light");
      doc.classList.remove("dark");
    }

    if (moonIcon != null && sunIcon != null) {
      if (preferDarkMode) {
        // now transition sun icon down
        sunIcon.classList.add("translate-y-full");
        moonIcon.classList.add("absolute", "translate-y-full");
        moonIcon.classList.remove("hidden");
      } else {
        // now transition moon icon down
        moonIcon.classList.add("translate-y-full");
        sunIcon.classList.add("absolute", "translate-y-full");
        sunIcon.classList.remove("hidden");
      }
    }

    switchColor(preferDarkMode);
  };

  // respect user preference for dark mode
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      switchTheme(event);
    });

  // respect user preference for reduced motion
  window
    .matchMedia("(prefers-reduced-motion)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        stop();
      } else {
        resume();
      }
    });


  const animationToggle = document.querySelector(".animation-toggle");
  const animationIcon = document.querySelector(".animation-toggle__icon");
  if (animationToggle != null) {
    animationToggle.addEventListener("click", () => {
      if (isPlaying.get()) {
        stop();
        animationIcon?.classList.remove("animate-spin");
      } else {
        resume();
        animationIcon?.classList.add("animate-spin");
      }
    });
  }

  const themeBtn = document.querySelector(".theme-toggle");
  const toggleTheme = () => {
    const preferDarkMode = !doc.classList.contains("dark");
    switchTheme(preferDarkMode);
  };

  if (themeBtn != null) {
    themeBtn.addEventListener("click", toggleTheme);
  }

});

const embedCode = `<iframe style="border-radius:12px"
src="https://open.spotify.com/embed/playlist/37i9dQZF1EpxRLUadGtqxr?utm_source=generator&theme=0" width="100%"
height="600" frameBorder="0" allowfullscreen=""
allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy">
</iframe>`

const spotifyToggleBtn = document.querySelector("#spotify-toggle");
const spotifyPlaceholder = document.querySelector("#spotify-widget-placeholder");  
const toggleSpotify = () => {
  const spotifyContainer = document.querySelector("#spotify-widget");
  if (spotifyContainer == null) return;
  spotifyContainer.classList.remove("hidden");
  console.log(spotifyContainer.innerHTML)

  if (spotifyContainer.innerHTML.trim() === "") {
    spotifyContainer.innerHTML = embedCode;
  } else {
    spotifyContainer.innerHTML = "";
  }

  spotifyPlaceholder?.classList.toggle("hidden");
}
if (spotifyToggleBtn != null) {
  spotifyToggleBtn.addEventListener("click", () => toggleSpotify());
}
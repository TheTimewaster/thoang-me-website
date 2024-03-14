import "./style.css";

const toggleMenu = ($event: Event) => {
    $event.stopPropagation();
    const parent = ($event.target as HTMLButtonElement).parentElement as HTMLDivElement

    parent.classList.add('fixed', 'top-0', 'left-0', '!h-screen', '!w-screen', '!bg-white', '!rounded-none', '!text-black')
}

document.addEventListener("DOMContentLoaded", async () => {
    const { switchColor } = await import("./pixi");

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.add("light");
    }

    window
        .matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", (event) => {
            if (event.matches) {
                document.documentElement.classList.add("dark");
                document.documentElement.classList.remove("light");
            } else {
                document.documentElement.classList.add("light");
                document.documentElement.classList.remove("dark");
            }

            switchColor(event.matches);
        });


    const toggleBtn = document.querySelector('#menu-toggle');
    if(toggleBtn != null) 
    {
        toggleBtn.addEventListener('click',toggleMenu)
    }
});

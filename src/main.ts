import './style.css';
import 'virtual:windi.css';

document.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.add('dark')
  else
    document.documentElement.classList.add('light')
});
// Get the different icons
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');

// Change the icons inside the button based on previous settings
if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
   ) {
    document.documentElement.classList.add("dark");
    themeToggleLightIcon.classList.remove('hidden');
}
else
    themeToggleDarkIcon.classList.remove('hidden');

// Light & Dark mode toggle
const themeToggleBtn = document.getElementById('theme-toggle');

function LightModeToggle() {
    // toggle icons inside button
    themeToggleDarkIcon.classList.toggle('hidden');
    themeToggleLightIcon.classList.toggle('hidden');

    const globalClassList = document.documentElement.classList;

    const wasDarkMode = globalClassList.contains('dark');

    const newMode = 
        wasDarkMode ?
            "light" : "dark";
    localStorage.setItem("color-theme", newMode);

    const swapOp = 
        wasDarkMode ?
            () => globalClassList.remove("dark") :
            () => globalClassList.add("dark");
    swapOp();
};
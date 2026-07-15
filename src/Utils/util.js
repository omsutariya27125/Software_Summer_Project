const THEME_KEY = 'mathGeniusTheme';

export default function ChangeTheme(){
    localStorage.setItem('mathGeniusTheme', localStorage.getItem('mathGeniusTheme') === 'dark' ? 'light' : 'dark');
}
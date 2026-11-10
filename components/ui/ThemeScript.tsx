/**
 * Applies the stored theme before first paint so there is no flash of the
 * wrong colour scheme. Rendered inline in `<head>` so it runs before the
 * browser paints the first frame.
 */
const script = `(function(){try{var s=localStorage.getItem('eh-theme');if(s==='dark'||s==='light'){document.documentElement.setAttribute('data-theme',s);}}catch(e){}})();`;

export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

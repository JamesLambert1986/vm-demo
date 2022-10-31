/**
 * The CSS works on relative units and sized according to the root font size. The root font size is calculated by assuming the default font size is 16px. If the user changes the font size via the browsers settings this calculation needs to be corrected.
 * @param {number} overrideSize Force the font size to be a specific px size.
 * @param {HTMLElement} bodyElement Body dom element
 */
const vmScale = (overrideSize = 0, bodyElement = document.body) => {

  // Override the font-size so that we can pick up browser setting font-size
  document.documentElement.style.fontSize = 'initial';
  let browserFontSize = parseInt(window.getComputedStyle(document.documentElement).fontSize);
  document.documentElement.removeAttribute('style');
  
  if(overrideSize != 0)
    browserFontSize = overrideSize;

  if(browserFontSize == 16)
    return false;

  const fontSize = ((browserFontSize / 375) * 100).toFixed(4);
  const SMfontSize = ((browserFontSize / 768) * 100).toFixed(4);
  const MDfontSize = ((browserFontSize / 1440) * 100).toFixed(4);

  // Create a new set of CSS with media queries to change the base font
  if(document.getElementById("fontsize-fix") != null){

    var element = document.getElementById("fontsize-fix");
    bodyElement.removeChild(element);
  }

  const newCSS = `<style id="fontsize-fix">html{ font-size: ${fontSize}vw;} @media (min-width: 36em) {html{ font-size: ${SMfontSize}vw;}} @media (min-width: 62em) {html{ font-size: ${MDfontSize}vw;}} @media (min-width: 90em) {html{ font-size: 100%;}}</style>`;

  bodyElement.innerHTML += newCSS;

  return true;
}

export default vmScale
/**
 * An article feed requires a set height so that the CSS masonary layout works, without a height being set the columns collapse breaking the layout.
 * 
 * In the future CSS property grid-template-rows with the value of masonary may depreciate this JavaScipt Class.
 */
class vmArticleFeed {
  /**
   * Within the constructor the setMasonaryHeight function is launched and event listeners are created to reset the height on load, resize and when element gets given the .inview class.
   * Another event lisener is created to load more article cards on click of a button with the selector button[data-load="feed"]
   * 
   * @constructs vmArticleFeed
   * @param {HTMLElement} feed - The dom element with the class of .article-deck--feed.
   */
  constructor(feed){
    const feedContainer = feed.parentNode;
    const setMasonaryHeight = this.setMasonaryHeight;
    const loadMoreCards = this.loadMoreCards;
    let cardsTimeout;
    let cardsInterval;

    setMasonaryHeight(feed);
    
    /**
     * Set masonary height function is triggered when the feed is given the class of inview.
     * @event observe
     * @memberof vmArticleFeed
     */
    var observer = new MutationObserver(function(){
      
      if(feedContainer.classList.contains('inview')){
        setMasonaryHeight(feed);
      }
    });
    observer.observe(feedContainer, { attributes: true});

    /**
     * Set masonary height function is triggered when the window is loaded.
     * @event load
     * @memberof vmArticleFeed
     */
    window.addEventListener('load', function(){
      setMasonaryHeight(feed);
      cardsInterval = setInterval(function(){ setMasonaryHeight(feed) }, 500);

      clearTimeout(cardsTimeout);
      cardsTimeout = setTimeout(function(){ clearInterval(cardsInterval); }, 5000);
    });

    /**
     * Set masonary height function is triggered when the window is resized.
     * @event resize
     * @memberof vmArticleFeed
     */
    window.addEventListener('resize', function() {
      
      clearInterval(cardsInterval);
      cardsInterval = setInterval(function(){ setMasonaryHeight(feed) }, 500);

      clearTimeout(cardsTimeout);
      cardsTimeout = setTimeout(function(){ clearInterval(cardsInterval); }, 3000);
    });

    /**
     * When the load more button is clicked the load more cards function is triggered.
     * @event click
     * @memberof vmArticleFeed
     */
    feedContainer.addEventListener('click', function(e){
      // loop parent nodes from the target to the delegation node
      for (var target = e.target; target && target != this; target = target.parentNode) {
        if (target.matches('button[data-load="feed"]')) {
          loadMoreCards(feed,target,setMasonaryHeight);
          break;
        }
      }
    }, false);
  }

  /**
   * This function sets the height of the feed by working out what the height of the largest column would be and applying it.
   * 
   * @param {HTMLElement} feed Dom element
   */
  setMasonaryHeight(feed){

    const browserFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    const minHeight = getComputedStyle(feed).getPropertyValue('min-height'); // #999999

    let colHeight1 = (browserFontSize * 3);
    let colHeight2 = (browserFontSize * 3);
    let colHeight3 = (browserFontSize * 3);

    if(minHeight == "2px"){ // Tablet

      const col1 = feed.querySelectorAll(".card:not(.js-hide):nth-child(odd)");
      col1.forEach((arrayElement, index) => {
        colHeight1 += arrayElement.offsetHeight + (browserFontSize*1);
      });
      const col2 = feed.querySelectorAll(".card:not(.js-hide):nth-child(even)");
      col2.forEach((arrayElement, index) => {
        colHeight2 += arrayElement.offsetHeight + (browserFontSize*1);
      });
    }
    else if(minHeight == "3px"){ // Desktop

      const col1 = feed.querySelectorAll(".card:not(.js-hide):nth-child(3n+1)");
      col1.forEach((arrayElement, index) => {
        colHeight1 += arrayElement.offsetHeight + (browserFontSize*1.5);
      });
  
      const col2 = feed.querySelectorAll(".card:not(.js-hide):nth-child(3n+2)");
      col2.forEach((arrayElement, index) => {
        colHeight2 += arrayElement.offsetHeight + (browserFontSize*1.5);
      });
  
      const col3 = feed.querySelectorAll(".card:not(.js-hide):nth-child(3n)");
      col3.forEach((arrayElement, index) => {
        colHeight3 += arrayElement.offsetHeight + (browserFontSize*1.5);
      });
    }
    
    let maxHeight = Math.max(colHeight1, colHeight2, colHeight3);
    feed.style.height = (maxHeight/browserFontSize) + 3 + "rem";
    feed.classList.add("js-processed");
  }
  
  /**
   * This function removes the **.js-hide** class on a set number of cards, this number is defined by using the **[data-feed-display]** attribute on the feed element.
   * 
   * @param {HTMLElement} feed Article feed element we are loading more cards into.
   * @param {HTMLElement} btn Button element that triggers the function is passed so that the focus can be removed from it and possibly removed if the end of the feed is reached.
   * @param {function} setMasonaryHeight This function needs to be passed through to this function so that it can be launched at the correct point.
   */
  loadMoreCards(feed,btn,setMasonaryHeight){

    const count = parseInt(feed.getAttribute('data-feed-display'));
    const minHeight = parseInt(getComputedStyle(feed).getPropertyValue('height'));
    let cardsTimeout;
    let cardsInterval;

    // Remove focus from button so the page doesn't move down with button
    btn.blur();

    // Set a large height so that the coumns don't break
    feed.style.height = (minHeight * 3) + "px";

    const hiddenCards = feed.querySelectorAll(".card.js-hide");
    
    hiddenCards.forEach((arrayElement, index) => {
      if(index < count){
        

        // Animaton delay
        let animationDelay = (index*0.25)+"s";
        arrayElement.style['animation-delay'] = animationDelay;

        const displayCard = function(arrayElement){

          arrayElement.classList.remove('js-hide')
          arrayElement.classList.add('js-trans');

          // Clear timeouts and intervals so we can reset the interval
          clearInterval(cardsInterval);
          clearTimeout(cardsTimeout);
          cardsTimeout = setTimeout(function(){ 
            
            setMasonaryHeight(feed); 

            const hiddenCardsNow = feed.querySelectorAll(".card.js-hide");
            if(hiddenCardsNow.length == 0){
              btn.parentNode.removeChild(btn);
            }

          }, 500);
        }

        let cardImage = arrayElement.querySelector('.card-image img');

        if(cardImage != null){ // If we need to load an image then lets load it before displaying the card

          let src = cardImage.getAttribute('data-src');
          var image = new Image();
          image.src = src;
          image.onload = function () {

            cardImage.setAttribute('src',src);
            displayCard(arrayElement);
          };
        }
        else {
          displayCard(arrayElement);
        }
      }
    });
  }
}

export default vmArticleFeed;
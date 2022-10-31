/**
 * Create a Data Layer JavaScript object if one has not already been created. A couple of events are created too; page load and JavaScript loaded.
 */
const vmDataLayer = () => {

  var pageData;

  if(typeof window.dataLayer === "undefined"){ window.dataLayer = []; }

  if(dataLayer.length == 0 || typeof dataLayer[0].page == "undefined"){

    const pageTitle = document.title;

    pageData = {
      "pageTitle": pageTitle
    }

    dataLayer.push({
      "event": "Page data set by JavaScript",
      "page": pageData
    });
  }
  else {
    pageData = dataLayer[0].page;
  }

  // Push page data to DLM
  dataLayer.push({
    "event": "JS Loaded",
    "data": {
      "page": pageData
    }
  });
}

export default vmDataLayer;
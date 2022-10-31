(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory() :
  typeof define === 'function' && define.amd ? define('vmstrapTests', factory) :
  (factory());
}(this, (function () { 'use strict';

  /** 
   * Integration tests
   * @module vmTests 
   */

  /**
   * Run tests
   * @param {HTMLElement} body Dom element, this doesn't have to be the body but it is recommended.
   */
  var vmTests = function vmTests(body) {
    var errorTable = [];
    var test = {};
    var intro = "These tests run against mark-up and content meant to test how a component or element has been integrated. Making sure that guidance setout in the design system is being followed.";
    window.integrationTestsIntro = intro;
    console.log("%cVirgin Money Framework Tests", "color: #E10A0A; font-size: 24px; font-weight: bold; margin-top: 20px; margin-bottom: 10px;");
    console.log("%c" + intro, "font-size: 14px; margin-bottom: 20px;");
    console.log("%cKey", "font-size: 16px;font-weight:bold;");
    console.log('%c   %c' + 'Successfully implemented', 'background-color: green; margin-right: 10px', 'background-color: transparent');
    console.log('%c   %c' + 'NOT implemented correctly', 'background-color: red; margin-right: 10px', 'background-color: transparent');
    console.log('%c   %c' + 'N/A', 'background-color: grey; margin-right: 10px', 'background-color: transparent');
    console.log('%c   %c' + 'Warning - No action needed', 'background-color: orange; margin-right: 10px', 'background-color: transparent');
    console.log('%c ? %c' + 'Warning - Action needed', 'background-color: orange; margin-right: 10px', 'background-color: transparent'); // #region Card deck Footer test

    test = {
      'Test': 'Each card with in a card deck has a footer with some CTA text via a button link',
      'Total': 0,
      'Passes': 0,
      'Fails': 0
    };
    Array.from(document.querySelectorAll('.card-deck .card')).forEach(function (card, index) {
      if (card.closest('.navbar') == null) {
        var btnLink = card.querySelector('.btn-link');
        if (btnLink != null && btnLink.textContent.length) test['Passes']++;else test['Fails']++;
      }
    });
    test['Total'] = test['Passes'] + test['Fails'];
    errorTable.push(test); // #endregion
    // #region Article deck background colour

    test = {
      'Test': 'Article Decks need to have a background colour applied',
      'Total': 0,
      'Passes': 0,
      'Fails': 0
    };
    Array.from(document.querySelectorAll('.article-deck')).forEach(function (deck, index) {
      var container = deck.closest('.container');
      if (container != null && container.matches('[class*="bg-"]')) test['Passes']++;else test['Fails']++;
    });
    test['Total'] = test['Passes'] + test['Fails'];
    errorTable.push(test); // #endregion
    // #region Tabs Carousel title test

    test = {
      'Test': 'Tabs Carousel has a h2 title with a display-4 class. It should always have a strapline next to it also.',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': 'The site nav contains cards without a footer by design.'
    };
    Array.from(document.querySelectorAll('.tabs__container--carousel')).forEach(function (tabs, index) {
      var title = tabs.querySelector('h2.display-4:first-child');
      var strapline = tabs.querySelector('h2.display-4:first-child + .strapline');
      if (title != null && strapline != null) test['Passes']++;else test['Fails']++;
    });
    test['Total'] = test['Passes'] + test['Fails'];
    errorTable.push(test); // #endregion
    // #region Split Container tests

    test = {
      'Test': 'Split Containers can only have multiple of two columns. So either 2, 4, 6 and so on.',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': ''
    };
    Array.from(document.querySelectorAll('.container.container--split')).forEach(function (container, index) {
      if (container.querySelectorAll(':scope > .row > [class*="col"]').length % 2 === 0) test['Passes']++;else test['Fails']++;
    });
    test['Total'] = test['Passes'] + test['Fails'];
    errorTable.push(test); // #endregion
    // #region Statement Container tests

    test = {
      'Test': 'Statement Containers with only one paragraph or text element should have the class of .h6',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': ''
    };
    Array.from(document.querySelectorAll('.container.container--statement')).forEach(function (container, index) {
      if (container.querySelectorAll(':scope > *').length == 1 && container.querySelectorAll(':scope > .h6:first-child').length == 1) test['Passes']++;else if (container.querySelectorAll(':scope > *').length == 1) test['Fails']++;
    });
    test['Total'] = test['Passes'] + test['Fails'];
    errorTable.push(test); // #endregion
    // #region CTA Container tests

    test = {
      'Test': 'CTA Containers title should always have the class of .h1',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': ''
    };
    Array.from(document.querySelectorAll('.container.container--cta')).forEach(function (container, index) {
      if (container.querySelectorAll('h2.h1:first-child').length == 1) test['Passes']++;else test['Fails']++;
    });
    test['Total'] = test['Passes'] + test['Fails'];
    errorTable.push(test); // #endregion
    // Print Implementation tests

    console.log("%cImplementation Tests", "font-size: 16px;font-weight:bold; margin-top: 20px;");
    errorTable.forEach(function (entry) {
      var color = 'green';

      if (entry['Total'] === 0) {
        color = 'grey';
      } else if (entry['Fails'] != 0) {
        color = 'red';
      }

      if (entry['Type'] == 'warning') {
        color = 'orange';
      }

      console.groupCollapsed('%c   %c' + entry.Test, 'background-color: ' + color + '; margin-right: 10px', 'background-color: transparent');
      console.table({
        Passed: {
          value: entry['Passes']
        },
        Failed: {
          value: entry['Fails']
        },
        Total: {
          value: entry['Total']
        }
      });

      if (entry['Notes'] != '') {
        console.log(entry['Notes']);
      }

      console.groupEnd();
    });
    window.integrationTests = errorTable; // Resest table

    var errorTableUtility = []; // #region Padding classes 

    test = {
      'Test': 'There are XX padding classes being used on this page',
      'Type': 'warning',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': ''
    };
    Array.from(document.querySelectorAll('[class*="p-"],[class*="pt-"],[class*="pb-"],[class*="pl-"],[class*="pr-"],[class*="px-"],[class*="py-"]')).forEach(function (element, index) {
      test['Total']++;
    });
    test['Test'] = test['Test'].replace('XX', test['Total']);
    errorTableUtility.push(test); // #endregion
    // #region Margin classes 

    test = {
      'Test': 'There are XX margin classes being used on this page',
      'Type': 'warning',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': ''
    };
    Array.from(document.querySelectorAll('[class*="m-"],[class*="mt-"],[class*="mb-"],[class*="ml-"],[class*="mr-"],[class*="mx-"],[class*="my-"]')).forEach(function (element, index) {
      test['Total']++;
    });
    test['Test'] = test['Test'].replace('XX', test['Total']);
    errorTableUtility.push(test); // #endregion
    // #region Text modifier classes

    test = {
      'Test': 'There are XX text modifier classes being used on this page',
      'Type': 'warning',
      'Total': 0,
      'Passes': 0,
      'Fails': 0,
      'Notes': ''
    };
    Array.from(document.querySelectorAll('[class*="text-"]')).forEach(function (element, index) {
      test['Total']++;
    });
    test['Test'] = test['Test'].replace('XX', test['Total']);
    errorTableUtility.push(test); // #endregion
    // Print the utility classes tests

    console.log("%cUtility classes", "font-size: 16px;font-weight:bold;");
    console.log("The use of certain utility classes is necessary at times but the over use of these classes will lead to design/layout inconsistencies.");
    errorTableUtility.forEach(function (entry) {
      var color = 'green';
      if (entry['Total'] === 0) color = 'grey';else if (entry['Fails'] != 0) color = 'red';
      if (entry['Type'] == 'warning') color = 'orange';
      console.groupCollapsed('%c   %c' + entry.Test, 'background-color: ' + color + '; margin-right: 10px', 'background-color: transparent');
      console.table({
        Total: {
          value: entry['Total']
        }
      });

      if (entry['Notes'] != '') {
        console.log(entry['Notes']);
      }

      console.groupEnd();
    }); // #region Headings out of context tests

    console.log("%cAccessibility and Best practice Tests", "font-size: 16px;font-weight:bold;");
    var color = 'green';
    var contextLevel = 1;
    var headingTable = {};
    Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).forEach(function (heading, index) {
      var level = 1;
      var text = heading.textContent;
      if (heading.matches("h2")) level = 2;else if (heading.matches("h3")) level = 3;else if (heading.matches("h4")) level = 4;else if (heading.matches("h5")) level = 5;else if (heading.matches("h6")) level = 6;
      var inOrder = level - contextLevel <= 1;

      if (index == 0 && level != 1) {
        inOrder = false;
      }

      var test = {
        "Heading Level": level,
        "In order": inOrder
      };

      if (inOrder) {
        contextLevel = level;
      } else {
        color = 'red';
      }

      headingTable[text] = test;
    });
    console.groupCollapsed('%c   %c' + 'Headings are in the correct order', 'background-color: ' + color + '; margin-right: 10px', 'background-color: transparent');
    console.table(headingTable);
    console.groupEnd();
    console.groupCollapsed('%c ? %c' + 'Do all of the headings make sense out of context and do they introduce the content that follows?', 'background-color: ' + 'orange' + '; margin-right: 10px', 'background-color: transparent');
    console.log("You should be able to read the below table and get an understanding of what the page content consists of. The titles should make sense when read in order and child titles should be relevant to the parent title.");
    console.table(headingTable);
    console.groupEnd(); // #endregion
    // #region Links out of context tests

    var linksTable = {};
    Array.from(document.querySelectorAll('a')).forEach(function (link, index) {
      var url = link.getAttribute('href');
      var text = link.textContent;
      var title = link.getAttribute('title');
      var test = {
        "Text": text,
        "Title": title
      };
      linksTable[url] = test;
    });
    console.groupCollapsed('%c ? %c' + 'Do all of the links make sense out of context and do they describe the page/section that it links to?', 'background-color: ' + 'orange' + '; margin-right: 10px', 'background-color: transparent');
    console.table(linksTable);
    console.groupEnd(); // #endregion
    // #region Image alt tags out of context tests

    var imgTable = {};
    var imgNoAltTable = {};
    Array.from(document.querySelectorAll('img[alt]')).forEach(function (image, index) {
      var url = image.getAttribute('src');
      var alt = image.getAttribute('alt');

      if (alt != "") {
        var _test = {
          "Alt": alt
        };
        imgTable[url] = _test;
      } else {
        var url = image.getAttribute('src');
        var _test2 = {};
        imgNoAltTable[url] = _test2;
      }
    });
    console.groupCollapsed('%c ? %c' + 'Do all of the images with an alt tag make sense out of context and describes the image appropriately?', 'background-color: ' + 'orange' + '; margin-right: 10px', 'background-color: transparent');
    console.table(imgTable);
    console.log('%cImages with an empty alt tag:', 'font-weight: bold;');
    console.table(imgNoAltTable);
    console.groupEnd(); // #endregion
    // #region Keyboard user messages

    console.groupCollapsed('%c ? %c' + 'Can you navigation the page links by tabbing through the page?', 'background-color: ' + 'orange' + '; margin-right: 10px', 'background-color: transparent');
    console.log('Are all of the links, input fields and buttons accessible through using the keyboard only?');
    console.groupEnd(); // #endregion

    console.log("%cLighthouse", "font-size: 16px;font-weight:bold;"); // #region Lighthouse

    console.groupCollapsed('%c ? %c' + 'Have you ran a lighthouse report on this page', 'background-color: ' + 'orange' + '; margin-right: 10px', 'background-color: transparent');
    console.log('If you are in a modern version of chrome you can a lighthouse report by opening the lighthouse window within the devtools. This should appear as a tab link above.');
    console.log('This report will give you more detail about the above the tests aswell as extra tests. ');
    console.groupEnd(); // #endregion

    console.log("%cImage sizes", "font-size: 16px;font-weight:bold;");
    console.log("The below tests work from the current screen size, so if you have your screen at a mobile viewport the scaling and sizes of images will reflect that. It is worth running the image tests in both mobile and desktop views. Simply change the screen size and refresh the page.");
    Array.from(document.querySelectorAll('img')).forEach(function (imgElem, index) {
      if (!imgElem.matches("[src*='http']") && !imgElem.matches("[src$='.svg']")) {
        var src = imgElem.getAttribute('src');
        var xhr = new XMLHttpRequest();
        xhr.open('HEAD', src, true);

        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              var imgFSize = xhr.getResponseHeader('Content-Length');

              if (imgFSize > 1024) {
                //ignore images under 1Kb
                var imgW = imgElem.naturalWidth;
                var imgH = imgElem.naturalHeight;
                var imgW2 = imgElem.clientWidth;
                var imgH2 = imgElem.clientHeight;
                var imgScl = (imgW2 / imgW).toFixed(2) == "0.00" ? "Hidden" : (imgW2 / imgW).toFixed(2);
                var imgFSize2 = Math.floor(imgFSize / 1024);
                var imgBPP = (imgFSize / (imgW * imgH)).toFixed(2);
                var cssColor = "green";
                var bppColor = "green";
                var scaleColor = "green";
                var bppError = "";
                var scaleError = "";

                if (imgBPP > 0.5) {
                  cssColor = "red";
                  bppColor = "red";
                  bppError = "The image has a VERY large \'Bytes per pixel\' score, trying optimising the image using https://tinypng.com/.";
                } else if (imgBPP > 0.2) {
                  cssColor = "orange";
                  bppColor = "orange";
                  bppError = "The image has a large \'Bytes per pixel\' score, trying optimising the image using https://tinypng.com/.";
                }

                if (imgScl > 1.2) {
                  cssColor = "red";
                  scaleColor = "red";
                  scaleError = "The image size is smaller than the size shown on screen this may cause the image to appear blurry and low quality.";
                } else if (imgScl < 0.5) {
                  cssColor = "red";
                  scaleColor = "red";
                  scaleError = "The image size is VERY large compared to the size shown on screen, this means unnecessary kb's are being downloaded. Try resizing the image in photoshop or other image editing software.";
                } else if (imgScl < 0.8) {
                  cssColor = "orange";
                  scaleColor = "orange";
                  scaleError = "The image size is large compared to the size shown on screen, this means unnecessary kb's are being downloaded. Try resizing the image in photoshop or other image editing software.";
                }

                console.groupCollapsed("%c     %c " + imgElem.src, 'background: url(' + imgElem.src + '); border: 3px solid ' + cssColor + '; line-height: 30px; width: 30px; background-size: cover;', 'background-color: transparent');

                if (bppError != "") {
                  console.log('%c   %c' + bppError, 'background-color: ' + bppColor + '; margin-right: 10px', 'background-color: transparent');
                }

                if (scaleError != "") {
                  console.log('%c   %c' + scaleError, 'background-color: ' + scaleColor + '; margin-right: 10px', 'background-color: transparent');
                }

                console.table({
                  Image: {
                    "Dimensions": imgW + "x" + imgH,
                    "Scaled to": imgW2 + "x" + imgH2,
                    "Scale": imgScl,
                    "Filesize": imgFSize2 + "Kb",
                    "Bytes per pixel": imgBPP
                  }
                });
                console.groupEnd();
              }
            } else {
              console.log('%c   %c' + imgElem.src + ' not loaded', 'background-color: red; margin-right: 10px', 'background-color: transparent');
            }
          }
        };

        xhr.send(null);
      }
    }); // Add to dom here

    var integrationTestsArr = [];

    if (typeof window.integrationTests != "undefined") {
      window.integrationTests.forEach(function (entry) {
        if (entry['Total'] != 0 && entry['Type'] != "warning") {
          integrationTestsArr.push(entry['Test']);
        }
      });
    }

    if (integrationTestsArr.length != 0) {
      var displayComp = document.querySelector('#vmtests-display');

      if (displayComp != null) {
        displayComp.innerHTML = "<div class=\"container\">\n      <h2>Integration notes</h2>\n      <ul id=\"integrationTests\"></ul>\n      </div>";
        var integrationTests = document.getElementById('integrationTests');

        if (integrationTests != null) {
          integrationTestsArr.forEach(function (test) {
            integrationTests.innerHTML += '<li>' + test + '</li>';
          });
        }
      }
    }

    return null;
  };

  document.addEventListener("DOMContentLoaded", function () {
    var isIE = false;
    if (navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > 0) isIE = true;

    if (!isIE) {
      window.vmTests = function () {
        vmTests();
      };

      setTimeout(function () {
        if (!document.body.classList.contains('ie')) {
          // The below code does not work in IE11
          var liveURLs = ["www.virginmoneyukplc.com", "uk.virginmoney.com", "uk.virginmoneygiving.com"];

          if (!liveURLs.includes(window.location.host) || navigator.userAgent.indexOf("Chrome-Lighthouse") > -1) {
            vmTests();
          }
        }
      }, 1000); // #region Apply some lintint CSS

      window.lint = function () {
        document.body.innerHTML += "\n      <style type=\"text/css\">\n      html:not([lang]):after,  \n      html[lang=\"\"]:after {\n        content: \"No language tag\";\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 999999;\n        background: red!important;\n      } \n      \n      meta[charset]:not([charset=\"UTF-8\"]):after {\n        content: \"Incorrect character set defined\";\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 999999;\n        background: red!important;\n      } \n      \n      meta[name=\"viewport\"][content*=\"user-scalable=no\"]:after,  \n      meta[name=\"viewport\"][content*=\"maximum-scale\"]:after,  \n      meta[name=\"viewport\"][content*=\"minimum-scale\"]:after {\n        content: \"Unaccessible viewport attributes\";\n        position: absolute;\n        top: 0;\n        left: 0;\n        z-index: 999999;\n        background: red!important;\n      }  \n      \n      a:not([href]),\n      a[href=\"#\"],  \n      a[href=\"\"],  \n      a[href*=\"javascript:void(0)\"],\n      button:empty,  \n      a:empty {\n        content: \"lint\";\n        outline: 3px dashed red!important;\n        outline-offset: -3px!important;\n      }  \n      \n      img:not([alt]) { \n        outline: 3px dashed red!important;\n        outline-offset: -3px!important;\n      }  \n      \n      input:not([id]),  \n      select:not([id]),  \n      textarea:not([id]) { \n        outline: 3px dashed red!important;\n        outline-offset: -3px!important;\n      }\n      \n      label:not([for]) {\n        outline: 3px dashed red!important;\n        outline-offset: -3px!important;\n      }  \n      </style>\n      ";
        return "Lintint CSS added";
      }; // #endregion

    }
  });

})));

//# sourceMappingURL=maps/vmstrap-tests.js.map

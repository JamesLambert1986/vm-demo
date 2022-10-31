hljs.initHighlightingOnLoad();

document.addEventListener("DOMContentLoaded", function() {

  clipboardHTML = new ClipboardJS('#copy-html');
  clipboardNunjucks = new ClipboardJS('#copy-nunjucks');

  clipboardHTML.on('success', function(e) {

    e.trigger.textContent = 'Copied HTML'
    e.clearSelection()
    setTimeout(function() {
        e.trigger.textContent = 'Copy HTML'
    }, 5000)
  });

  clipboardNunjucks.on('success', function(e) {

    e.trigger.textContent = 'Copied Nunjucks'
    e.clearSelection()
    setTimeout(function() {
        e.trigger.textContent = 'Copy Nunjucks'
    }, 5000)
  });

});
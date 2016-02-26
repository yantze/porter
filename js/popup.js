(function() {
  var g_nodes = null;
  var g_current_format = 'markdown';
  var g_output_notes = false;
  var g_output_toc = false;
  var g_title, g_url;

  // change option
  function changeOption(type) {
    g_output_notes = document.getElementById("outputNotes").checked;
    g_output_toc = document.getElementById("outputToc").checked;
    changeFormat(g_current_format);
  };

  // change export Mode
  function changeFormat(type) {
    var text;

    g_current_format = type;
    switch (type) {
      case "markdown":
        text = exportLib.toMarkdown(g_nodes, g_output_notes);
        break;
      case "html":
        text = exportLib.toHtml(g_nodes, g_output_notes, g_output_toc);
        break;
    };
    document.getElementById('textArea').innerText = text;
    document.getElementById("popupTitle").innerHTML = makeTitleLabel(g_current_format, g_title, g_url);
    textarea_select();
  };

  function textarea_select() {
    var t = document.getElementById('textArea');
    t.focus();
    t.select();
    setTimeout(function() { document.execCommand("copy") }, 200);
  };

  function setEventListers(){
    document.getElementById("close").addEventListener("click",  function() { window.close(); }, false);
    document.getElementById("markDown").addEventListener("click",  function() { changeFormat('markdown'); }, false);
    document.getElementById("html").addEventListener("click",  function() { changeFormat('html'); }, false);
    document.getElementById("outputNotes").addEventListener("click",  function() { changeOption('notes'); }, false);
    document.getElementById("outputToc").addEventListener("click",  function() { changeOption('toc'); }, false);
  }

  function makeTitleLabel(format, title, url) {
    return (format == "markdown") ? '[' + title + '](' + url + ')' : title + ' - ' + url;
  }

  function main() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: 'getTopic'}, function(response) {
        g_nodes = response.content;
        g_title = response.title;
        g_url = response.url;
        changeFormat('markdown');
      });
    });
    setEventListers();
    textarea_select();
  }

  window.onload = main;
}());

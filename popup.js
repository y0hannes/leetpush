document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('pushBtn').addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      })
    })
  })
})

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.title) {
      console.log("Title:", request.title)
      console.log("URL:", request.url)
      console.log("Code:", request.code)
      document.getElementById('title').textContent = request.title
    }
  }
)

document.addEventListener('DOMContentLoaded', () => {

  const keysToGet = ['githubUsername', 'githubReponame', 'accessToken']

  chrome.storage.local.get(keysToGet, (result) => {
    if (result.githubUsername) {
      document.getElementById('git-username').value = result.githubUsername;
    }
    if (result.githubReponame) {
      document.getElementById('git-repo').value = result.githubReponame;
    }
    if (result.accessToken) {
      document.getElementById('git-token').value = result.accessToken;
    }
  })

  document.getElementById('pushBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      })
    })
  })

  document.getElementById('save-btn').addEventListener('click', () => {
    const githubUsername = document.getElementById('git-username').value
    const githubReponame = document.getElementById('git-repo').value
    const accessToken = document.getElementById('git-token').value
    chrome.storage.local.set({
      githubUsername, githubReponame, accessToken
    }, () => {
      console.log('GitHub credentials saved. ')
    })
  })
})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.title) {
      console.log("Title:", request.title)
      console.log("URL:", request.url)
      console.log("Code:", request.code)
      document.getElementById('title').textContent = request.title
    }
  }
)


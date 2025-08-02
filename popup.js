document.addEventListener('DOMContentLoaded', () => {

  const configView = document.getElementById('config-view')
  const mainView = document.getElementById('main-view')
  const repoNameDisplay = document.getElementById('repo-name-display')

  const keysToGet = ['githubUsername', 'githubReponame', 'accessToken']
  chrome.storage.local.get(keysToGet, (result) => {
    if (accessToken && githubReponame) {
      mainView.style.display = 'block'
      configView.style.display = 'none'
      repoNameDisplay.textContent = result.githubReponame
    } else {
      mainView.style.display = 'none'
      configView.style.display = 'block'
    }
  })

  document.getElementById('pushBtn').addEventListener('click', () => {
    chrome.storage.local.get(keysToGet, (result) => {
      const { githubUsername, githubReponame, accessToken } = result

      if (!githubUsername || !githubReponame || !accessToken) {
        console.log('GitHub credentials are not set')
        mainView.style.display = 'none'
        configView.style.display = 'block'
        return
      }
      console.log('Ready to push')

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ['content.js']
        })
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
    mainView.style.display = 'block'
    configView.style.display = 'none'
  })

  document.getElementById('change-settings-btn').addEventListener('click', () => {
    mainView.style.display = 'none'
    configView.style.display = 'block'
    document.getElementById('git-token').value = ''
  })

})

chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.title) {
      console.log("Title:", request.title)
      console.log("URL:", request.url)
      console.log("Code:", request.code)
    }
  }
)

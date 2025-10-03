document.addEventListener('DOMContentLoaded', () => {

  const configView = document.getElementById('config-view')
  const mainView = document.getElementById('main-view')
  const repoNameDisplay = document.getElementById('repo-name-display')

  const keysToGet = ['githubUsername', 'githubReponame', 'accessToken'];

  chrome.storage.local.get(keysToGet, (result) => {
    const { githubUsername, githubReponame, accessToken } = result;

    if (githubUsername && githubReponame && accessToken) {
      mainView.style.display = 'block';
      configView.style.display = 'none';
      repoNameDisplay.textContent = githubReponame;
    } else {
      mainView.style.display = 'none';
      configView.style.display = 'block';
    }
  });

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

  document.getElementById('save-btn').addEventListener('click', (event) => {
    event.preventDefault()

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


  chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
      if (request.title) {
        console.log("Title:", request.title)
        console.log("URL:", request.url)
        console.log("Code:", request.code)
      }
    }
  )

  document.getElementById('github-login-btn').addEventListener('click', () => {
    console.log('reading envent')
    const clientId = 'Ov23liaXlwEUylxBjzey'
    const redirectUri = 'https://overnumerously-pavid-donette.ngrok-free.app/oauth/callback'

    const scope = 'repo'

    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`

    chrome.identity.launchWebAuthFlow({
      url: authUrl,
      interactive: true
    }, (redirectUrl) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message)
        return
      }

      console.log('Redirect URL received:', redirectUrl);

      const url = new URL(redirectUrl)
      const accessToken = url.searchParams.get('token')

      if (accessToken) {
        chrome.storage.local.set({ accessToken }, () => {
          console.log('Access token saved')
          location.reload()
        })
      } else {
        console.error('No token found in redirect')
      }
    })
  })

})
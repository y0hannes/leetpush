(function () {
  const titleElement = document.querySelector('.text-title-large a')
  const title = titleElement ? titleElement.innerText : 'Title not found'

  const codeLines = document.querySelectorAll('.view-lines .view-line')
  const code = Array.from(codeLines).map(line => line.innerText).join('\n')

  const url = window.location.href

  chrome.runtime.sendMessage({
    title: title,
    code: code,
    url: url
  })

})()


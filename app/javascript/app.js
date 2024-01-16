// Entry point for the build script in your package.json
import "@hotwired/turbo-rails"
import "./controllers"
import {toHtml} from 'hast-util-to-html'

// import "trix"
// import "@rails/actiontext"
import "rhino-editor"
import "rhino-editor/exports/styles/trix.css"

// This loads all languages
import {common, createLowlight} from 'lowlight'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'

const lowlight = createLowlight(common)

const syntaxHighlight = CodeBlockLowlight.configure({
  lowlight,
})

function extendRhinoEditor (event) {
  const rhinoEditor = event.target

  console.log(rhinoEditor)
  if (rhinoEditor == null) return

  rhinoEditor.starterKitOptions = {
    ...rhinoEditor.starterKitOptions,
    // We disable codeBlock from the starterkit to be able to use CodeBlockLowlight's extension.
    codeBlock: false
  }

  rhinoEditor.extensions = [syntaxHighlight]

  rhinoEditor.rebuildEditor()
}

document.addEventListener("rhino-initialize", extendRhinoEditor)

const highlightCodeblocks = (content) => {
  const doc = new DOMParser().parseFromString(content, 'text/html');
  doc.querySelectorAll('pre > code:not(.hljs)').forEach((el) => {
    const html = toHtml(lowlight.highlightAuto(el.innerHTML).children)
    // Add a `"hljs"` class
    el.classList.add("hljs")
    el.innerHTML = html
  });
  let finalStr = doc.body.innerHTML;

  return finalStr
};


document.addEventListener("submit", (e) => {
  const inputElement = document.getElementById(e.target.querySelector("rhino-editor").getAttribute("input"))

  if (!inputElement) return

  inputElement.value = highlightCodeblocks(inputElement.value)
})

import * as vscode from "vscode"
import { Decorator } from "./highlighter"
import { getVarRangeList } from "./utils"
import { log } from "util"

interface ColorMap {
  [key: string]: number
}

export function activate(context: vscode.ExtensionContext) {
  let highlightList: string[] = []
  let colorMap: ColorMap = {}
  const decorator = Decorator.getInstance()

  const highlightOn = (editors: vscode.TextEditor[], variable: string) => {
    if (highlightList.indexOf(variable) < 0) {
      highlightList.push(variable)
    }
    editors.forEach(editor => {
      const rangeList = getVarRangeList(editor, variable)
      if (!(variable in colorMap)) {
        colorMap[variable] = decorator.getNewColor(Object.values(colorMap))
      }
      decorator.highlightRange(
        editor,
        rangeList,
        variable,
        colorMap[variable]
      )
    })
  }

  const highlightOff = (editors: vscode.TextEditor[], variable: string) => {
    highlightList = highlightList.filter(x => x !== variable)
    decorator.removeHighlight(editors, variable)
  }

  const toggleHighlight = () => {
    const currentEditor = vscode.window.activeTextEditor
    if (!currentEditor) {
      return
    }
    const selection = currentEditor.selection
    //const regex = /[\d\w_]+/;
    const regex = undefined
    const range = currentEditor.document.getWordRangeAtPosition(
      selection.anchor,
      regex
    )
    if (!range) {
      return
    }
    const selectedText = currentEditor.document.getText(range)
    const turnOff = highlightList.indexOf(selectedText) > -1

    const editors = vscode.window.visibleTextEditors
    if (turnOff) {
      highlightOff(editors, selectedText)
    } else {
      highlightOn(editors, selectedText)
    }
    if (turnOff) {
      delete colorMap[selectedText]
      decorator.clearVariable(selectedText)
    }
  }

  const removeAllHighlight = () => {
    highlightList = []
    colorMap = {}
    const editors = vscode.window.visibleTextEditors
    decorator.removeHighlights(editors)
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rainbow-highlighter.toggleHighlight",
      toggleHighlight
    )
  )

  const renewHighlight = (editors: vscode.TextEditor[]) => {
    editors.forEach(editor => {
      highlightList.forEach(text => {
        const rangeList = getVarRangeList(editor, text)
        const color = colorMap[text]
        decorator.highlightRange(
          editor,
          rangeList,
          text,
          color
        )
      })
    })
  }

  const updateHighlight = (event: vscode.TextDocumentChangeEvent) => {
    const editors = vscode.window.visibleTextEditors
      .filter(editor => editor.document === event.document)

    highlightList.forEach(v => {
      decorator.removeHighlight(editors, v)
      highlightOn(editors, v)
    })
  }

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rainbow-highlighter.removeHighlight",
      removeAllHighlight
    )
  )

  vscode.window.onDidChangeVisibleTextEditors(
    renewHighlight,
    null,
    context.subscriptions
  )

  vscode.workspace.onDidChangeTextDocument(updateHighlight)
}

export function deactivate() { }

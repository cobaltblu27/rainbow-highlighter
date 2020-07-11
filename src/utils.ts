import * as vscode from "vscode"

export const getVarRangeList = (
  editor: vscode.TextEditor,
  name: string
): vscode.Range[] => {
  const getAllIndexes = (str: string, substr: string) => {
    var indexes: number[] = [],
      i = -1
    while ((i = str.indexOf(substr, i)) !== -1) {
      indexes.push(i)
      i = i + substr.length
    }
    return indexes
  }
  const textByLines = editor.document.getText().split("\n")
  let ranges: vscode.Range[] = []
  for (let i = 0;i < textByLines.length;i++) {
    const indexArr = getAllIndexes(textByLines[i], name)
      .map(j => {
        const position = new vscode.Position(i, j)
        return editor.document.getWordRangeAtPosition(position)
      })
      .filter(range => range && editor.document.getText(range) === name)
      .map(range => {
        if (range) {
          ranges.push(range)
        }
      })
  }
  return ranges
}

export const log = vscode.window.showInformationMessage

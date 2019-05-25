import * as vscode from "vscode";
import { Decorator } from "./highlighter";
import { getVarRangeList } from "./utils";
import { log } from "util";

interface ColorMap {
  [key: string]: number;
}

export function activate(context: vscode.ExtensionContext) {
  let highlightList: string[] = [];
  let colorMap: ColorMap = {};
  const decorator = Decorator.getInstance();

  const highlightOn = (editor: vscode.TextEditor, variable: string) => {
    if (highlightList.indexOf(variable) < 0) {
      highlightList.push(variable);
    }
    const rangeList = getVarRangeList(editor, variable);
    const color = variable in colorMap ? colorMap[variable] : undefined;
    colorMap[variable] = decorator.highlightRange(
      editor,
      rangeList,
      variable,
      color
    );
  };

  const highlightOff = (editor: vscode.TextEditor, variable: string) => {
    highlightList = highlightList.filter(x => x !== variable);
    decorator.removeHighlight(editor, variable);
  };

  const toggleHighlight = () => {
    const currentEditor = vscode.window.activeTextEditor;
    if (!currentEditor) {
      return;
    }
    const selection = currentEditor.selection;
    //const regex = /[\d\w_]+/;
    const regex = undefined;
    const range = currentEditor.document.getWordRangeAtPosition(
      selection.anchor,
      regex
    );
    if (!range) {
      return;
    }
    const selectedText = currentEditor.document.getText(range);
    const turnOff = highlightList.indexOf(selectedText) > -1;

    vscode.window.visibleTextEditors.forEach(editor => {
      if (turnOff) {
        highlightOff(editor, selectedText);
      } else {
        highlightOn(editor, selectedText);
      }
    });
    if (turnOff) {
      delete colorMap[selectedText];
    }
  };

  const removeAllHighlight = () => {
    highlightList = [];
    colorMap = {};
    vscode.window.visibleTextEditors.forEach(editor => {
      decorator.removeHighlights(editor);
    });
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rainbow-highlighter.toggleHighlight",
      toggleHighlight
    )
  );

  const renewHighlight = (editors: vscode.TextEditor[]) => {
    log("renew");
    editors.forEach(editor => {
      highlightList.forEach(text => {
        const rangeList = getVarRangeList(editor, text);
        const color = text in colorMap ? colorMap[text] : undefined;
        colorMap[text] = decorator.highlightRange(
          editor,
          rangeList,
          text,
          color
        );
      });
    });
  };

  const updateHighlight = (e: vscode.TextDocumentChangeEvent) => {
    vscode.window.visibleTextEditors.forEach(editor => {
      highlightList.forEach(v => {
        //TODO: removeHighlight not working in updateHighlight
        decorator.removeHighlight(editor!, v);
        highlightOn(editor!, v);
      });
    });
  };

  /*
  const updateHighlight = (e: vscode.TextDocumentChangeEvent) => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    highlightList.forEach(v => {
      log(v);
      decorator.removeHighlight(editor!, v);
      highlightOn(editor!, v);
    });
  };
  */

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rainbow-highlighter.removeHighlight",
      removeAllHighlight
    )
  );

  vscode.window.onDidChangeVisibleTextEditors(
    renewHighlight,
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(updateHighlight);
}

export function deactivate() {}

import * as vscode from "vscode";
import { listenerCount } from "cluster";
import { Decorator } from "./highlighter";
import { getVarRangeList } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let highlightList: string[] = [];
  const decorator = Decorator.getInstance();

  const toggleHighlight = () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    const selection = editor.selection;

    //const regex = /[\d\w_]+/;
    const regex = undefined;

    const range = editor.document.getWordRangeAtPosition(
      selection.anchor,
      regex
    );
    if (!range) {
      return;
    }

    const selectedText = editor.document.getText(range);

    if (highlightList.indexOf(selectedText) > -1) {
      highlightList = highlightList.filter(x => x !== selectedText);
      decorator.removeHighlight(editor, selectedText);
      return;
    } else {
      highlightList.push(selectedText);
    }

    const rangeList = getVarRangeList(editor, selectedText);

    decorator.highlightRange(editor, rangeList, selectedText);
  };

  const removeHighlight = () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }
    highlightList = [];
    decorator.removeHighlights(editor);
  };

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rainbow-highlighter.toggleHighlight",
      toggleHighlight
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "rainbow-highlighter.removeHighlight",
      removeHighlight
    )
  );
}

export function deactivate() {}

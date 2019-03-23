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
    } else {
      highlightList.push(selectedText);
    }

    const rangeList = getVarRangeList(editor, selectedText);

    vscode.window.showInformationMessage(highlightList.join());
    decorator.highlightRange(editor, rangeList);
  };

  const removeHighlight = () => {
    highlightList = [];
    decorator.removeHighlights();
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

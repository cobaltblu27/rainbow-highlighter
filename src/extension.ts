import * as vscode from "vscode";
import { listenerCount } from "cluster";
import { Decorator } from "./highlighter";

export function activate(context: vscode.ExtensionContext) {
  let highlightList: string[] = [];
  let decorator = Decorator.getInstance();

  let toggleHighlight = () => {
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

    vscode.window.showInformationMessage(highlightList.join());
    //decorator.highlight(editor, highlightList);
    decorator.highlightRange(editor, range);
  };

  let removeHighlight = () => {
    highlightList = [];
    //decorator.highlight(highlightList);
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

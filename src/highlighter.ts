import * as vscode from "vscode";
import { configure } from "vscode/lib/testrunner";

//TODO add options
//TODO editor is undefined
class DecoratorClass {
  private editor: vscode.TextEditor | undefined;
  public DecoratorClass() {
    this.editor = vscode.window.activeTextEditor;
  }

  private getRanges(words: string[]): vscode.Range[] {
    const ranges: vscode.Range[] = [];
    return ranges;
  }

  public highlight(words: string[]) {
    const decorationType = vscode.window.createTextEditorDecorationType({});
    if (!this.editor) {
      return;
    }
    this.editor.setDecorations(decorationType, this.getRanges(words));
  }
  public highlightRange(range: vscode.Range) {
    const decorationType = vscode.window.createTextEditorDecorationType({});
    if (!this.editor) {
        vscode.window.showInformationMessage("return");
      return;
    }
    this.editor.setDecorations(decorationType, [range]);
  }
}

//use with Decorator.getInstance(); This will return decorator singleton.
export var Decorator = (function() {
  let instance: DecoratorClass;
  function createInstance() {
    return new DecoratorClass();
  }
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

import * as vscode from "vscode";
import { configure } from "vscode/lib/testrunner";

//TODO add options
//TODO editor is undefined
class DecoratorClass {
  private yellowDecoration = {
    overviewRulerColor: "yellow",
    backgroundColor: "yellow"
  };
  public DecoratorClass() {}

  private getRanges(words: string[]): vscode.Range[] {
    const ranges: vscode.Range[] = [];
    return ranges;
  }

  public highlight(editor: vscode.TextEditor, words: string[]) {
    const decorationType = vscode.window.createTextEditorDecorationType(
      this.yellowDecoration
    );
    editor.setDecorations(decorationType, this.getRanges(words));
  }
  public highlightRange(editor: vscode.TextEditor, range: vscode.Range[]) {
    const decorationType = vscode.window.createTextEditorDecorationType(
      this.yellowDecoration
    );
    editor.setDecorations(decorationType, range);
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

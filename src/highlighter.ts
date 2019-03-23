import * as vscode from "vscode";
import { configure } from "vscode/lib/testrunner";

//TODO add options
class DecoratorClass {
  private decorationVarList : {[id: string]: vscode.TextEditorDecorationType | undefined }= {};
  private useBorder = vscode.workspace.getConfiguration("rainbow-highlighter")[
    "use-border"
  ];
  private colorPalette: ((varName: string) => vscode.TextEditorDecorationType)[] = vscode.workspace
    .getConfiguration("rainbow-highlighter")
    ["palette"].map((color: string) => {
      return (varName: string) => {
        const decoration = vscode.window.createTextEditorDecorationType({
          //TODO: borderColor doesn't work,
          //TODO: make borderColor more vivid
          backgroundColor: this.useBorder ? undefined : color,
          borderColor: this.useBorder ? color : undefined,
          overviewRulerColor: color
        });
        this.decorationVarList[varName] = (decoration);
        return decoration;
      };
    });
  private decorationIndex = 0;

  private getIndex = () => {
    const i = this.decorationIndex;
    this.decorationIndex = i >= this.colorPalette.length - 1 ? 0 : i + 1;
    return i;
  }

  private resetIndex = () => {
    this.decorationIndex = 0;
  }

  public DecoratorClass() {}

  public removeHighlight(editor: vscode.TextEditor, key: string){
    const decoration = this.decorationVarList[key];
    if(decoration){
      editor.setDecorations(decoration, []);
      this.decorationVarList[key] = undefined;
    }
  }
  public removeHighlights(editor: vscode.TextEditor) {
    Object.keys(this.decorationVarList)
      .map(k => this.decorationVarList[k])
      .filter(d => d)
      .forEach(d => editor.setDecorations(d!, []))
    this.decorationVarList = {};
    this.resetIndex();
  }
  public highlightRange(
    editor: vscode.TextEditor, 
    range: vscode.Range[],
    key: string,
  ) {
    editor.setDecorations(this.colorPalette[this.getIndex()](key), range);
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

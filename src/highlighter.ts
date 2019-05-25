import * as vscode from "vscode";
import { log } from "util";

//TODO add options
class DecoratorClass {
  private decorationVarList: {
    [id: string]: vscode.TextEditorDecorationType | undefined;
  } = {};

  private config = vscode.workspace.getConfiguration("rainbow-highlighter");

  private buildColor = (color: string) => {
    const putAlpha = (c: string) => {
      const colorVal = c.match(/\((.+)\)/)![1];
      return `rgba(${colorVal}, ${this.config["background-alpha"]})`;
    };
    return {
      backgroundColor: this.config["use-border"] ? undefined : putAlpha(color),
      border: this.config["use-border"] ? `2px solid ${color}` : undefined,
      overviewRulerColor: color
    };
  };
  private colorPalette: ((
    varName: string
  ) => vscode.TextEditorDecorationType)[] = vscode.workspace
    .getConfiguration("rainbow-highlighter")
    ["palette"].map((color: string) => {
      return (varName: string) => {
        const decoration = vscode.window.createTextEditorDecorationType(
          this.buildColor(color)
        );
        this.decorationVarList[varName] = decoration;
        return decoration;
      };
    });
  private decorationIndex = 0;

  private getIndex = () => {
    const i = this.decorationIndex;
    this.decorationIndex = i >= this.colorPalette.length - 1 ? 0 : i + 1;
    return i;
  };

  private resetIndex = () => {
    this.decorationIndex = 0;
  };

  public DecoratorClass() {}

  public removeHighlight(editor: vscode.TextEditor, key: string) {
    const decoration = this.decorationVarList[key];
    if (decoration) {
      editor.setDecorations(decoration, []);
    }
  }

  public clearVariable(key: string) {
    this.decorationVarList[key] = undefined;
  }

  public removeHighlights(editor: vscode.TextEditor) {
    Object.keys(this.decorationVarList)
      .map(k => this.decorationVarList[k])
      .filter(d => d)
      .forEach(d => editor.setDecorations(d!, []));
    this.decorationVarList = {};
    this.resetIndex();
  }
  public highlightRange(
    editor: vscode.TextEditor,
    range: vscode.Range[],
    key: string,
    index: number | undefined
  ) {
    const colorIndex = index !== undefined ? index : this.getIndex();
    let decoration = this.decorationVarList[key];
    if (decoration === undefined) {
      decoration = this.colorPalette[colorIndex](key);
    }
    editor.setDecorations(decoration, range);
    return colorIndex;
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

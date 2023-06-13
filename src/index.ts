
/**
 * 输出的Token
 */
class Token {
  public type:number;
  public text:string;

  constructor (type: number, text: string) {
    this.type = type;
    this.text = text;
  }

  toString () {
    return "";
  }
}

/**
 * 词法分析器，公共类
 */
abstract class Lexer {
  static EOF:string = String.fromCharCode(-1);
  static EOF_TYPE:number = 1;

  input:string;
  p:number = 0; // 当前字符位置
  c:string; // 当前待解析的字符

  constructor (input:string) {
    this.input = input;
    this.c = this.input.charAt(this.p);
  }

  /**
   * 移动下一个字符，检测输入是否结束
   */
  consume () {
    this.p = this.p + 1;
    if (this.p >= this.input.length) {
      this.c = Lexer.EOF;
    } else {
      this.c = this.input.charAt(this.p);
    }

  }

  /**
   * 确保X是输入选中的下一个字符
   */
  match (x:string) {
    if (this.c === x) {
      this.consume();
    } else {
      throw new Error("expecting: " + x + "; found " + this.c);
    }
  }

  abstract nextToken():Token;
  abstract getTokenName(tokenType:number):string;

}

/**
 * 特定场景的词法解析器- 解析List
 */
class ListLexer extends Lexer {
  // 注册Token
  static NAME = 2;
  static COMMA = 3;
  static LBRACK = 4;
  static RBRACK = 5;

  static tokenNames:string[] = [
    "n/a",
    "<EOF>",
    "NAME",
    "COMMA",
    "LBRACK",
    "RBRACK"
  ];

  // 主要匹配词法单元并引导输入字符流
  nextToken(): Token {
    while (this.c !== Lexer.EOF) {
      switch (this.c) {
        case ' ':
        case '\t':
        case '\n':
        case '\r':
          this.WS();
          break;
        case ',':
          this.consume();
          return new Token(ListLexer.COMMA, ',');
        case '[':
          this.consume();
          return new Token(ListLexer.LBRACK, '[');
        case ']':
          this.consume();
          return new Token(ListLexer.RBRACK, ']');
        default:
          if (this.isLETTER()) {
            return this.Name()
          } else {
            throw new Error("invalid char: " + this.c);
          }

      }
    }

    return new Token(ListLexer.EOF_TYPE, "<EOF>");
  }

  // 是不是一个字母
  isLETTER ():boolean {
    return (this.c >= 'a' && this.c <= 'z') ||
          (this.c >= 'A' && this.c <= 'Z');
  }

  // 识别标识时，如果向前看字符是字母，则应该收集并暂存紧随其后的字母
  Name () {
    let buf = "";

    do {
      buf = buf + this.c;
      this.consume();
    } while(this.isLETTER());

    return new Token(ListLexer.NAME, buf);
  }

  // 忽略所有空白符
  WS () {
    while (this.c === ' ' || this.c === '\t' || this.c === '\r' || this.c === '\n') {
      this.consume();
    }
  }

  getTokenName(tokenType: number): string {
    return ListLexer.tokenNames[tokenType];
  }

}


export {
  Token,
  Lexer,
  ListLexer
}
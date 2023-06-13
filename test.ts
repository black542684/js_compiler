import { ListLexer } from "./src";

let input = ' [ hello,  world ] ';

let lexer = new ListLexer(input);


while (true) {
  let t = lexer.nextToken();
  console.log(t);
  if (t.type === ListLexer.EOF_TYPE) {
    break;
  }
}

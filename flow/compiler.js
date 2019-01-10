
declare type ASTNode = ASTElement | ASTText | ASTExpression

declare type ASTElement = {
  type: 1;
  tag: string;
  attrsList: Array<{ name: string; value: string }>;
  attrsMap: { [key: string]: string | null };
  parent: ASTElement | void;
  children: Array<ASTNode>;

  // 标记静态节点，优化相关
  static?: boolean;
  staticRoot?: boolean;
  staticProcessed?: boolean;
  // 节点是否是“纯的" 是否存在attrs、事件监听、pre、指令等，影响代码生成
  plain?: boolean;

  // 有绑定指令
  hasBindings?: boolean;

  // v-for 相关
  for?: string;
  forProcessed?: boolean;
  key?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;

  // 其他指令（v-model）
  directives?: Array<ASTDirective>;

  // 事件
  events?: ASTElementHandlers;

}

declare type ASTExpression = {
  type: 2;
  expression: string;
  text: string;
  static?: boolean;
}

declare type ASTText = {
  type: 3;
  text: string;
  static?: boolean;
}

// // 指令修饰符
// declare type ASTModifiers = { [key: string]: boolean }

// 指令
declare type ASTDirective = {
  name: string;
  rawName: string;
  value: string;
  arg: ?string;
  // modifiers: ?ASTModifiers;
}

// 事件handler
declare type ASTElementHandler = {
  value: string;
  // modifiers: ?ASTModifiers;
}

declare type ASTElementHandlers = {
  [key: string]: ASTElementHandler | Array<ASTElementHandler>;
}

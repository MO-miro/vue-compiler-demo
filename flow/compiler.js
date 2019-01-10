
declare type ASTNode = ASTElement | ASTText | ASTExpression

declare type ASTElement = {
  type: 1;
  tag: string;
  attrsList: Array<{ name: string; value: string }>;
  attrsMap: { [key: string]: string | null };
  parent: ASTElement | void;
  children: Array<ASTNode>;
  static?: boolean;
  staticRoot?: boolean;

  // 有绑定指令
  hasBindings?: boolean;

  // v-for 指令相关
  for?: string;
  forProcessed?: boolean;
  key?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;

  // 其他指令
  directives?: Array<ASTDirective>;

  // 事件
  events?: ASTElementHandlers;
  // v-model 相关
  model?: {
    value: string;
    callback: string;
    expression: string;
  };
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

// 指令修饰符
declare type ASTModifiers = { [key: string]: boolean }

// 指令
declare type ASTDirective = {
  name: string;
  rawName: string;
  value: string;
  arg: ?string;
  modifiers: ?ASTModifiers;
}

// 事件handler
declare type ASTElementHandler = {
  value: string;
  modifiers: ?ASTModifiers;
}

declare type ASTElementHandlers = {
  [key: string]: ASTElementHandler | Array<ASTElementHandler>;
}

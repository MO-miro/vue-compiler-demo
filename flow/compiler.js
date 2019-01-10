
declare type ASTNode = ASTElement | ASTText | ASTExpression

declare type ASTElement = {
  type: 1;
  tag: string;
  attrsList: Array<{ name: string; value: string }>;
  attrsMap: { [key: string]: string | null };
  parent: ASTElement | void;
  children: Array<ASTNode>;
 
  // v-for 指令相关
  for?: string;
  forProcessed?: boolean;
  key?: string;
  alias?: string;
  iterator1?: string;
  iterator2?: string;

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
//   static?: boolean;
}

declare type ASTText = {
  type: 3;
  text: string;
//   static?: boolean;
}

// declare type ASTElement = {
//   type: 1;
//   tag: string;
//   attrsList: Array<{ name: string; value: string }>;
//   attrsMap: { [key: string]: string | null };
//   parent: ASTElement | void;
//   children: Array<ASTNode>;

//   static?: boolean;
//   staticRoot?: boolean;
//   staticInFor?: boolean;
//   staticProcessed?: boolean;
//   hasBindings?: boolean;

//   text?: string;
//   attrs?: Array<{ name: string; value: string }>;
//   props?: Array<{ name: string; value: string }>;
//   plain?: boolean;
//   pre?: true;
//   ns?: string;

//   component?: string;
//   inlineTemplate?: true;
//   transitionMode?: string | null;
//   slotName?: ?string;
//   slotTarget?: ?string;
//   slotScope?: ?string;
//   scopedSlots?: { [name: string]: ASTElement };

//   ref?: string;
//   refInFor?: boolean;

//   if?: string;
//   ifProcessed?: boolean;
//   elseif?: string;
//   else?: true;
//   ifConditions?: ASTIfConditions;

//   for?: string;
//   forProcessed?: boolean;
//   key?: string;
//   alias?: string;
//   iterator1?: string;
//   iterator2?: string;

//   staticClass?: string;
//   classBinding?: string;
//   staticStyle?: string;
//   styleBinding?: string;
//   events?: ASTElementHandlers;
//   nativeEvents?: ASTElementHandlers;

//   transition?: string | true;
//   transitionOnAppear?: boolean;

//   model?: {
//     value: string;
//     callback: string;
//     expression: string;
//   };

//   directives?: Array<ASTDirective>;

//   forbidden?: true;
//   once?: true;
//   onceProcessed?: boolean;
//   wrapData?: (code: string) => string;

//   // weex specific
//   appendAsTree?: boolean;
// }
# ----------------------------
# YARARA INTERPRETER

# ----------------------------

# --- IMPORTS ---

import re
import time
import os
from pathlib import Path

# --- DEBUG ---

TEST_STRING = """
x = 10
y = 5 + x
y - 2
ramo y > 10 {
    z = y * 2
} ambue {
    z = y / 2
}
"""

# --- TOKEN SPECIFICATION ---

TOKEN_SPEC = [
    ("PAPAPY", r"\d+"),                   # NUMBER
    ("JOJA", r"=="),                      # EQUAL TO
    ("NDOJOJAI", r"!="),                  # NOT EQUAL TO
    ("MICHI_JOJA", r"<="),                # LESS THAN OR EQUAL
    ("TUICHA_JOJA", r">="),               # GREATER THAN OR EQUAL
    ("MICHI", r"<"),                      # LESS THAN
    ("TUICHA", r">"),                     # GREATER THAN
    ("HA_AVEI", r"\+"),                   # PLUS
    ("MENOS", r"-"),                      # MINUS
    ("ONEMBOHETAVE_HAGUA", r"\*"),        # MULTIPLY
    ("MBOJA_O", r"/"),                    # DIVIDE
    ("IGUAL", r"="),                      # ASSIGNMENT (=)
    ("JEIKE", r"\{"),                     # BLOCK OPEN
    ("JESE", r"\}"),                      # BLOCK CLOSE
    ("LPAREN", r"\("),                    # PAREN OPEN
    ("RPAREN", r"\)"),                    # PAREN CLOSE
    ("KYTA", r","),                       # COMMA
    ("PYTA", r"\."),                      # DOT (ATTRIBUTE ACCESS)
    ("NEEJOAJU", r'"[^"]*"'),             # STRING
    ("RAMO", r"\bramo\b"),                # IF
    ("AMBUE", r"\bambue\b"),              # ELSE
    ("AJA", r"\baja\b"),                  # WHILE
    ("HEI", r"\bhe'i\b"),                 # PRINT
    ("PYTAGUANEMU", r"\bpytaguañemu\b"),  # IMPORT
    ("MBO_EHAKOTY", r"\bmbo'ehakoty\b"),  # CLASS
    ("HAE", r"\bha'e\b"),                 # EXTENDS
    ("PYAHU", r"\bpyahu\b"),              # NEW (INSTANTIATE)
    ("CHE", r"\bche\b"),                  # SELF
    ("JAPO", r"\bjapo\b"),                # FUNCTION DEF
    ("MBOJEVY", r"\bmbojevy\b"),          # RETURN
    ("HA", r"\bha\b"),                    # AND
    ("OR", r"\btérã\b"),                  # OR
    ("NAHANIRI", r"\bnahániri\b"),        # NOT
    ("LBRACKET", r"\["),                  # LIST OPEN
    ("RBRACKET", r"\]"),                  # LIST CLOSE
    ("TERA", r"[^\W\d]\w*(?:'\w+)*"),     # VARIABLE / IDENTIFIER (unicode-aware, allows internal ' e.g. ñe'ẽmi)
    ("JEPOPO", r"[ \t\n]+"),              # SKIP WHITESPACE
    ("OJE_EVA", r"#.*"),                  # COMMENT
    ("EJAVY", r"."),                      # MISMATCH (must stay last)
]



# --- TOKENIZER ---

ESCAPE_RE = re.compile(r"\\n|\\t|\\\\|\\\"|\\[0-7]{3}")

def decode_escapes(s):
    def repl(m):
        seq = m.group(0)
        if seq == "\\n":
            return "\n"
        if seq == "\\t":
            return "\t"
        if seq == "\\\\":
            return "\\"
        if seq == '\\"':
            return '"'
        return chr(int(seq[1:], 8))
    return ESCAPE_RE.sub(repl, s)

def tokenize(input_string):
    """
    Tokenizes the input string into a sequence of tokens.
    """
    tok_regex = "|".join(f"(?P<{name}>{pattern})" for name, pattern in TOKEN_SPEC)
    for mo in re.finditer(tok_regex, input_string):
        kind = mo.lastgroup
        value = mo.group()

        # Handle tokens
        if kind == "PAPAPY":
            yield ("PAPAPY", int(value))
        elif kind == "NEEJOAJU":
            yield ("NEEJOAJU", decode_escapes(value[1:-1]))
        elif kind == "JEPOPO":
            continue
        elif kind == "OJE_EVA":
            continue
        elif kind == "EJAVY":
            raise RuntimeError(f"\033[31mPersonaje oñeha’arõ’ỹva: {value}")
        else:
            yield (kind, value)


# --- AST NODES ---

class NumberNode:
    def __init__(self, value):
        self.value = value

class VarNode:
    def __init__(self, name):
        self.name = name

class AssignNode:
    def __init__(self, var_name, expr):
        self.var_name = var_name
        self.expr = expr

class BinaryOpNode:
    def __init__(self, left, op, right):
        self.left = left
        self.op = op
        self.right = right

class IfNode:
    def __init__(self, condition, then_block, else_block=None):
        self.condition = condition
        self.then_block = then_block
        self.else_block = else_block

class WhileNode:
    def __init__(self, condition, block):
        self.condition = condition
        self.block = block

class PrintNode:
    def __init__(self, expr):
        self.expr = expr

class ImportNode:
    def __init__(self, module_name):
        self.module_name = module_name

class ClassNode:
    def __init__(self, class_name, body, parent_name=None):
        self.class_name = class_name
        self.body = body
        self.parent_name = parent_name

class MethodDefNode:
    def __init__(self, name, params, body):
        self.name = name
        self.params = params
        self.body = body

class NewInstanceNode:
    def __init__(self, class_name, args):
        self.class_name = class_name
        self.args = args

class SelfNode:
    pass

class AttributeAccessNode:
    def __init__(self, object_expr, attr_name):
        self.object_expr = object_expr
        self.attr_name = attr_name

class AttributeAssignNode:
    def __init__(self, object_expr, attr_name, expr):
        self.object_expr = object_expr
        self.attr_name = attr_name
        self.expr = expr

class MethodCallNode:
    def __init__(self, object_expr, method_name, args):
        self.object_expr = object_expr
        self.method_name = method_name
        self.args = args

class FunctionDefNode:
    def __init__(self, name, params, body):
        self.name = name
        self.params = params
        self.body = body

class CallNode:
    def __init__(self, name, args):
        self.name = name
        self.args = args

class ReturnNode:
    def __init__(self, expr):
        self.expr = expr

class UnaryOpNode:
    def __init__(self, op, operand):
        self.op = op
        self.operand = operand

class ListLiteralNode:
    def __init__(self, elements):
        self.elements = elements

class IndexAccessNode:
    def __init__(self, collection_expr, index_expr):
        self.collection_expr = collection_expr
        self.index_expr = index_expr

class IndexAssignNode:
    def __init__(self, collection_expr, index_expr, expr):
        self.collection_expr = collection_expr
        self.index_expr = index_expr
        self.expr = expr

# --- PARSER ---

class Parser:
    def __init__(self, tokens):
        self.tokens = list(tokens)
        self.pos = 0
        self.current_token = self.tokens[0] if self.tokens else None

    def next_token(self):
        self.pos += 1
        if self.pos < len(self.tokens):
            self.current_token = self.tokens[self.pos]
        else:
            self.current_token = None

    def parse(self):
        statements = []
        while self.current_token is not None:
            statements.append(self.statement())
        return statements

    def statement(self):
        if self.current_token and self.current_token[0] == "RAMO":
            return self.if_statement()
        if self.current_token and self.current_token[0] == "AJA":
            return self.while_statement()
        if self.current_token and self.current_token[0] == "HEI":
            self.next_token()  # consume HEI
            return PrintNode(self.logic_or())
        if self.current_token and self.current_token[0] == "PYTAGUANEMU":
            self.next_token()  # consume PYTAGUANEMU
            module_token = self.expect("NEEJOAJU")
            return ImportNode(module_token[1])
        if self.current_token and self.current_token[0] == "MBO_EHAKOTY":
            return self.class_statement()
        if self.current_token and self.current_token[0] == "JAPO":
            return self.function_statement()
        if self.current_token and self.current_token[0] == "MBOJEVY":
            self.next_token()  # consume MBOJEVY
            return ReturnNode(self.logic_or())
        if self.current_token and self.current_token[0] == "TERA":
            if self.pos + 1 < len(self.tokens) and self.tokens[self.pos + 1][0] == "IGUAL":
                var_name = self.current_token[1]
                self.next_token()
                self.next_token()
                expr_node = self.logic_or()
                return AssignNode(var_name, expr_node)
        node = self.logic_or()
        if self.current_token and self.current_token[0] == "IGUAL":
            if isinstance(node, AttributeAccessNode):
                self.next_token()  # consume IGUAL
                rhs = self.logic_or()
                return AttributeAssignNode(node.object_expr, node.attr_name, rhs)
            if isinstance(node, IndexAccessNode):
                self.next_token()  # consume IGUAL
                rhs = self.logic_or()
                return IndexAssignNode(node.collection_expr, node.index_expr, rhs)
        return node

    def logic_or(self):
        node = self.logic_and()
        while self.current_token and self.current_token[0] == "OR":
            op = self.current_token
            self.next_token()
            node = BinaryOpNode(node, op, self.logic_and())
        return node

    def logic_and(self):
        node = self.logic_not()
        while self.current_token and self.current_token[0] == "HA":
            op = self.current_token
            self.next_token()
            node = BinaryOpNode(node, op, self.logic_not())
        return node

    def logic_not(self):
        if self.current_token and self.current_token[0] == "NAHANIRI":
            self.next_token()
            return UnaryOpNode("NAHANIRI", self.logic_not())
        return self.comparison()

    def expect(self, token_type):
        if not self.current_token or self.current_token[0] != token_type:
            raise RuntimeError(f"Expected {token_type}, got {self.current_token}")
        token = self.current_token
        self.next_token()
        return token

    def block(self):
        self.expect("JEIKE")
        statements = []
        while self.current_token and self.current_token[0] != "JESE":
            statements.append(self.statement())
        self.expect("JESE")
        return statements

    def if_statement(self):
        self.next_token()  # consume RAMO
        condition = self.logic_or()
        then_block = self.block()
        else_block = None
        if self.current_token and self.current_token[0] == "AMBUE":
            self.next_token()  # consume AMBUE
            if self.current_token and self.current_token[0] == "RAMO":
                else_block = [self.if_statement()]
            else:
                else_block = self.block()
        return IfNode(condition, then_block, else_block)

    def while_statement(self):
        self.next_token()  # consume AJA
        condition = self.logic_or()
        body = self.block()
        return WhileNode(condition, body)

    def class_statement(self):
        self.next_token()  # consume MBO_EHAKOTY
        name_tok = self.expect("TERA")
        parent_name = None
        if self.current_token and self.current_token[0] == "HAE":
            self.next_token()  # consume HAE
            parent_name = self.expect("TERA")[1]
        body = self.class_block()
        return ClassNode(name_tok[1], body, parent_name)

    def class_block(self):
        self.expect("JEIKE")
        methods = []
        while self.current_token and self.current_token[0] != "JESE":
            methods.append(self.method_def())
        self.expect("JESE")
        return methods

    def method_def(self):
        name_tok = self.expect("TERA")
        self.expect("LPAREN")
        params = []
        if self.current_token and self.current_token[0] != "RPAREN":
            params.append(self.expect("TERA")[1])
            while self.current_token and self.current_token[0] == "KYTA":
                self.next_token()
                params.append(self.expect("TERA")[1])
        self.expect("RPAREN")
        body = self.block()
        return MethodDefNode(name_tok[1], params, body)

    def parse_args(self):
        self.expect("LPAREN")
        args = []
        if self.current_token and self.current_token[0] != "RPAREN":
            args.append(self.logic_or())
            while self.current_token and self.current_token[0] == "KYTA":
                self.next_token()
                args.append(self.logic_or())
        self.expect("RPAREN")
        return args

    def new_instance(self):
        self.next_token()  # consume PYAHU
        class_name_tok = self.expect("TERA")
        args = self.parse_args()
        return NewInstanceNode(class_name_tok[1], args)

    def function_statement(self):
        self.next_token()  # consume JAPO
        name_tok = self.expect("TERA")
        self.expect("LPAREN")
        params = []
        if self.current_token and self.current_token[0] != "RPAREN":
            params.append(self.expect("TERA")[1])
            while self.current_token and self.current_token[0] == "KYTA":
                self.next_token()
                params.append(self.expect("TERA")[1])
        self.expect("RPAREN")
        body = self.block()
        return FunctionDefNode(name_tok[1], params, body)

    def comparison(self):
        node = self.expr()
        if self.current_token and self.current_token[0] in (
            "JOJA", "NDOJOJAI", "MICHI", "TUICHA", "MICHI_JOJA", "TUICHA_JOJA"
        ):
            op = self.current_token
            self.next_token()
            node = BinaryOpNode(node, op, self.expr())
        return node

    def expr(self):
        node = self.term()
        while self.current_token and self.current_token[0] in ("HA_AVEI", "MENOS"):
            op = self.current_token
            self.next_token()
            node = BinaryOpNode(node, op, self.term())
        return node

    def term(self):
        node = self.factor()
        while self.current_token and self.current_token[0] in ("ONEMBOHETAVE_HAGUA", "MBOJA_O"):
            op = self.current_token
            self.next_token()
            node = BinaryOpNode(node, op, self.factor())
        return node

    def factor(self):
        node = self.primary()
        while self.current_token and self.current_token[0] in ("PYTA", "LBRACKET"):
            if self.current_token[0] == "PYTA":
                self.next_token()  # consume PYTA
                attr_tok = self.expect("TERA")
                if self.current_token and self.current_token[0] == "LPAREN":
                    args = self.parse_args()
                    node = MethodCallNode(node, attr_tok[1], args)
                else:
                    node = AttributeAccessNode(node, attr_tok[1])
            else:
                self.next_token()  # consume LBRACKET
                index_expr = self.logic_or()
                self.expect("RBRACKET")
                node = IndexAccessNode(node, index_expr)
        return node

    def primary(self):
        token = self.current_token
        if token and token[0] == "MENOS":
            self.next_token()
            return UnaryOpNode("MENOS", self.primary())
        if token and token[0] == "LBRACKET":
            self.next_token()  # consume LBRACKET
            elements = []
            if self.current_token and self.current_token[0] != "RBRACKET":
                elements.append(self.logic_or())
                while self.current_token and self.current_token[0] == "KYTA":
                    self.next_token()
                    elements.append(self.logic_or())
            self.expect("RBRACKET")
            return ListLiteralNode(elements)
        if token and token[0] == "PAPAPY":
            self.next_token()
            return NumberNode(token[1])
        elif token and token[0] == "NEEJOAJU":
            self.next_token()
            return NumberNode(token[1])
        elif token and token[0] == "CHE":
            self.next_token()
            return SelfNode()
        elif token and token[0] == "PYAHU":
            return self.new_instance()
        elif token and token[0] == "TERA":
            if self.pos + 1 < len(self.tokens) and self.tokens[self.pos + 1][0] == "LPAREN":
                name = token[1]
                self.next_token()  # consume TERA
                args = self.parse_args()
                return CallNode(name, args)
            self.next_token()
            return VarNode(token[1])
        raise RuntimeError(f"Unexpected token: {token}")

# --- RUNTIME VALUES ---

class ReturnSignal(Exception):
    def __init__(self, value):
        self.value = value

class YararaInstance:
    def __init__(self, class_def):
        self.class_def = class_def
        self.fields = {}

    def __repr__(self):
        return f"<{self.class_def['name']}>"

# --- INTERPRETER ---

class Interpreter:
    def __init__(self):
        self.env = {}
        self.classes = {}
        self.functions = {}

    def find_method(self, class_def, name):
        if class_def is None:
            return None
        if name in class_def["methods"]:
            return class_def["methods"][name]
        return self.find_method(class_def["parent"], name)

    def call_method(self, instance, method_def, arg_values):
        if len(arg_values) != len(method_def.params):
            raise RuntimeError(
                f"'{method_def.name}' oikotevẽ {len(method_def.params)} mba'e, oñeme'ẽ {len(arg_values)}"
            )
        local_env = dict(zip(method_def.params, arg_values))
        local_env["che"] = instance
        old_env = self.env
        self.env = local_env
        try:
            return self.run_block(method_def.body)
        except ReturnSignal as r:
            return r.value
        finally:
            self.env = old_env

    def call_function(self, func_def, arg_values):
        if len(arg_values) != len(func_def.params):
            raise RuntimeError(
                f"'{func_def.name}' oikotevẽ {len(func_def.params)} mba'e, oñeme'ẽ {len(arg_values)}"
            )
        local_env = dict(zip(func_def.params, arg_values))
        old_env = self.env
        self.env = local_env
        try:
            return self.run_block(func_def.body)
        except ReturnSignal as r:
            return r.value
        finally:
            self.env = old_env

    def evaluate(self, node):
        if isinstance(node, NumberNode):
            return node.value
        elif isinstance(node, UnaryOpNode):
            if node.op == "NAHANIRI":
                return not self.evaluate(node.operand)
            return -self.evaluate(node.operand)
        elif isinstance(node, VarNode):
            if node.name in self.env:
                return self.env[node.name]
            raise RuntimeError(f"\033[31m Téra ndojeikuaái: {node.name}")
        elif isinstance(node, AssignNode):
            val = self.evaluate(node.expr)
            self.env[node.var_name] = val
            return val
        elif isinstance(node, BinaryOpNode) and node.op[0] == "HA":
            return self.evaluate(node.left) and self.evaluate(node.right)
        elif isinstance(node, BinaryOpNode) and node.op[0] == "OR":
            return self.evaluate(node.left) or self.evaluate(node.right)
        elif isinstance(node, BinaryOpNode):
            left_val = self.evaluate(node.left)
            right_val = self.evaluate(node.right)
            if node.op[0] == "HA_AVEI":
                return left_val + right_val
            elif node.op[0] == "MENOS":
                return left_val - right_val
            elif node.op[0] == "ONEMBOHETAVE_HAGUA":
                return left_val * right_val
            elif node.op[0] == "MBOJA_O":
                return left_val / right_val
            elif node.op[0] == "JOJA":
                return left_val == right_val
            elif node.op[0] == "NDOJOJAI":
                return left_val != right_val
            elif node.op[0] == "MICHI":
                return left_val < right_val
            elif node.op[0] == "TUICHA":
                return left_val > right_val
            elif node.op[0] == "MICHI_JOJA":
                return left_val <= right_val
            elif node.op[0] == "TUICHA_JOJA":
                return left_val >= right_val
        elif isinstance(node, IfNode):
            if self.evaluate(node.condition):
                return self.run_block(node.then_block)
            elif node.else_block is not None:
                return self.run_block(node.else_block)
            return None
        elif isinstance(node, WhileNode):
            result = None
            while self.evaluate(node.condition):
                result = self.run_block(node.block)
            return result
        elif isinstance(node, PrintNode):
            val = self.evaluate(node.expr)
            print(val)
            return val
        elif isinstance(node, ImportNode):
            module_path = Path(node.module_name)
            if not module_path.suffix:
                module_path = module_path.with_suffix(".ya")
            if not module_path.is_file():
                raise RuntimeError(f"Module not found: {node.module_name}")
            with open(module_path, "r", encoding="utf-8") as f:
                source = f.read()
            tokens = tokenize(source)
            parser = Parser(tokens)
            ast_statements = parser.parse()
            for stmt in ast_statements:
                self.evaluate(stmt)
            return None
        elif isinstance(node, ClassNode):
            parent_def = None
            if node.parent_name is not None:
                parent_def = self.classes.get(node.parent_name)
                if parent_def is None:
                    raise RuntimeError(f"Mbo'ehakoty ndojeikuaái: {node.parent_name}")
            methods = {m.name: m for m in node.body}
            self.classes[node.class_name] = {
                "name": node.class_name,
                "parent": parent_def,
                "methods": methods,
            }
            return None
        elif isinstance(node, NewInstanceNode):
            class_def = self.classes.get(node.class_name)
            if class_def is None:
                raise RuntimeError(f"Mbo'ehakoty ndojeikuaái: {node.class_name}")
            instance = YararaInstance(class_def)
            arg_values = [self.evaluate(a) for a in node.args]
            constructor = self.find_method(class_def, "ñepyrũ")
            if constructor is not None:
                self.call_method(instance, constructor, arg_values)
            elif arg_values:
                raise RuntimeError(f"{node.class_name} ndorekói ñepyrũ (constructor)")
            return instance
        elif isinstance(node, SelfNode):
            if "che" not in self.env:
                raise RuntimeError("'che' ojeporu mbo'ehakoty rembiapo guive añónte")
            return self.env["che"]
        elif isinstance(node, AttributeAccessNode):
            obj = self.evaluate(node.object_expr)
            if not isinstance(obj, YararaInstance):
                raise RuntimeError(f"Ndaha'éi mbo'ehakoty mba'e: {obj}")
            if node.attr_name not in obj.fields:
                raise RuntimeError(f"Mba'e ndojeikuaái: {node.attr_name}")
            return obj.fields[node.attr_name]
        elif isinstance(node, AttributeAssignNode):
            obj = self.evaluate(node.object_expr)
            if not isinstance(obj, YararaInstance):
                raise RuntimeError(f"Ndaha'éi mbo'ehakoty mba'e: {obj}")
            val = self.evaluate(node.expr)
            obj.fields[node.attr_name] = val
            return val
        elif isinstance(node, MethodCallNode):
            obj = self.evaluate(node.object_expr)
            if not isinstance(obj, YararaInstance):
                raise RuntimeError(f"Ndaha'éi mbo'ehakoty mba'e: {obj}")
            method_def = self.find_method(obj.class_def, node.method_name)
            if method_def is None:
                raise RuntimeError(f"Rembiapo ndojeikuaái: {node.method_name}")
            arg_values = [self.evaluate(a) for a in node.args]
            return self.call_method(obj, method_def, arg_values)
        elif isinstance(node, FunctionDefNode):
            self.functions[node.name] = node
            return None
        elif isinstance(node, ListLiteralNode):
            return [self.evaluate(e) for e in node.elements]
        elif isinstance(node, IndexAccessNode):
            coll = self.evaluate(node.collection_expr)
            if not isinstance(coll, list):
                raise RuntimeError(f"Ndaha'éi aty (list): {coll}")
            idx = int(self.evaluate(node.index_expr))
            if idx < -len(coll) or idx >= len(coll):
                raise RuntimeError(f"Aty rehe ndaipóri: {idx}")
            return coll[idx]
        elif isinstance(node, IndexAssignNode):
            coll = self.evaluate(node.collection_expr)
            if not isinstance(coll, list):
                raise RuntimeError(f"Ndaha'éi aty (list): {coll}")
            idx = int(self.evaluate(node.index_expr))
            if idx < -len(coll) or idx >= len(coll):
                raise RuntimeError(f"Aty rehe ndaipóri: {idx}")
            val = self.evaluate(node.expr)
            coll[idx] = val
            return val
        elif isinstance(node, CallNode):
            if node.name == "ára":
                if node.args:
                    raise RuntimeError("'ára' ndoikotevẽi mba'eve")
                return time.time_ns() % 2147483648
            if node.name == "papapy":
                if len(node.args) != 1:
                    raise RuntimeError("'papapy' oikotevẽ peteĩ mba'e (aty)")
                coll = self.evaluate(node.args[0])
                if not isinstance(coll, list):
                    raise RuntimeError(f"Ndaha'éi aty (list): {coll}")
                return len(coll)
            if node.name == "jehupi":
                if len(node.args) != 2:
                    raise RuntimeError("'jehupi' oikotevẽ mokõi mba'e (aty, mba'e)")
                coll = self.evaluate(node.args[0])
                if not isinstance(coll, list):
                    raise RuntimeError(f"Ndaha'éi aty (list): {coll}")
                coll.append(self.evaluate(node.args[1]))
                return coll
            if node.name == "ñehendu":
                if len(node.args) > 1:
                    raise RuntimeError("'ñehendu' oikotevẽ 0 térã 1 mba'e (jehechauka)")
                if node.args:
                    prompt = self.evaluate(node.args[0])
                    text = input(prompt)
                else:
                    text = input()
                try:
                    return int(text)
                except ValueError:
                    pass
                try:
                    return float(text)
                except ValueError:
                    pass
                return text
            if node.name == "ñe'ẽmi":
                if len(node.args) != 1:
                    raise RuntimeError("'ñe'ẽmi' oikotevẽ peteĩ mba'e")
                return isinstance(self.evaluate(node.args[0]), str)
            if node.name == "papapymi":
                if len(node.args) != 1:
                    raise RuntimeError("'papapymi' oikotevẽ peteĩ mba'e")
                val = self.evaluate(node.args[0])
                return isinstance(val, (int, float)) and not isinstance(val, bool)
            if node.name == "atymi":
                if len(node.args) != 1:
                    raise RuntimeError("'atymi' oikotevẽ peteĩ mba'e")
                return isinstance(self.evaluate(node.args[0]), list)
            func_def = self.functions.get(node.name)
            if func_def is None:
                raise RuntimeError(f"Tembiapo ndojeikuaái: {node.name}")
            arg_values = [self.evaluate(a) for a in node.args]
            return self.call_function(func_def, arg_values)
        elif isinstance(node, ReturnNode):
            raise ReturnSignal(self.evaluate(node.expr))
        raise RuntimeError(f"Unexpected node: {node}")

    def run_block(self, statements):
        result = None
        for stmt in statements:
            result = self.evaluate(stmt)
        return result

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1:
        with open(sys.argv[1], "r", encoding="utf-8") as f:
            source = f.read()
    else:
        source = TEST_STRING

    tokens = tokenize(source)
    parser = Parser(tokens)
    ast_statements = parser.parse()

    interpreter = Interpreter()
    for stmt in ast_statements:
        interpreter.evaluate(stmt)

// Code Generators for C, Python, JavaScript, C++, and Rust

// ==================== C Code Generator ====================
const CGenerator = new Blockly.Generator('C');

CGenerator.PRECEDENCE = 0;

CGenerator.init = function(workspace) {
    CGenerator.definitions_ = Object.create(null);
    CGenerator.includes_ = Object.create(null);
    CGenerator.variables_ = Object.create(null);
    
    if (!CGenerator.variableDB_) {
        CGenerator.variableDB_ = new Blockly.Names(CGenerator.RESERVED_WORDS_);
    } else {
        CGenerator.variableDB_.reset();
    }
    
    const defvars = [];
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
        defvars.push('int ' + CGenerator.variableDB_.getName(variables[i].name, 
            Blockly.Variables.NAME_TYPE) + ';');
    }
    CGenerator.definitions_['variables'] = defvars.join('\n');
};

CGenerator.finish = function(code) {
    const includes = [];
    for (let name in CGenerator.includes_) {
        includes.push(CGenerator.includes_[name]);
    }
    
    const definitions = [];
    for (let name in CGenerator.definitions_) {
        definitions.push(CGenerator.definitions_[name]);
    }
    
    const allDefs = includes.join('\n') + '\n\n' + definitions.join('\n\n');
    return allDefs + '\n\nint main() {\n' + code + '  return 0;\n}\n';
};

CGenerator.scrubNakedValue = function(line) {
    return line + ';\n';
};

CGenerator.scrub_ = function(block, code) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = CGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// C Blocks
CGenerator['text_print'] = function(block) {
    CGenerator.includes_['stdio'] = '#include <stdio.h>';
    const msg = CGenerator.valueToCode(block, 'TEXT', CGenerator.PRECEDENCE) || '""';
    return 'printf("%s\\n", ' + msg + ');\n';
};

CGenerator['text'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = '"' + textValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    return [code, CGenerator.PRECEDENCE];
};

CGenerator['math_number'] = function(block) {
    const code = parseFloat(block.getFieldValue('NUM'));
    return [code, CGenerator.PRECEDENCE];
};

CGenerator['math_arithmetic'] = function(block) {
    const OPERATORS = {
        'ADD': [' + ', CGenerator.PRECEDENCE],
        'MINUS': [' - ', CGenerator.PRECEDENCE],
        'MULTIPLY': [' * ', CGenerator.PRECEDENCE],
        'DIVIDE': [' / ', CGenerator.PRECEDENCE],
        'POWER': [null, CGenerator.PRECEDENCE]
    };
    const tuple = OPERATORS[block.getFieldValue('OP')];
    const operator = tuple[0];
    const order = tuple[1];
    const argument0 = CGenerator.valueToCode(block, 'A', order) || '0';
    const argument1 = CGenerator.valueToCode(block, 'B', order) || '0';
    
    if (operator === null) {
        CGenerator.includes_['math'] = '#include <math.h>';
        return ['pow(' + argument0 + ', ' + argument1 + ')', CGenerator.PRECEDENCE];
    }
    const code = argument0 + operator + argument1;
    return [code, order];
};

CGenerator['controls_repeat_ext'] = function(block) {
    const repeats = CGenerator.valueToCode(block, 'TIMES', CGenerator.PRECEDENCE) || '0';
    let branch = CGenerator.statementToCode(block, 'DO');
    branch = CGenerator.addLoopTrap(branch, block.id);
    const loopVar = CGenerator.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
    const code = 'for (int ' + loopVar + ' = 0; ' + loopVar + ' < ' + repeats + '; ' + loopVar + '++) {\n' + branch + '}\n';
    return code;
};

CGenerator['controls_whileUntil'] = function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = CGenerator.valueToCode(block, 'BOOL', CGenerator.PRECEDENCE) || 'false';
    if (until) {
        argument0 = '!(' + argument0 + ')';
    }
    let branch = CGenerator.statementToCode(block, 'DO');
    branch = CGenerator.addLoopTrap(branch, block.id);
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

CGenerator['logic_compare'] = function(block) {
    const OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const argument0 = CGenerator.valueToCode(block, 'A', CGenerator.PRECEDENCE) || '0';
    const argument1 = CGenerator.valueToCode(block, 'B', CGenerator.PRECEDENCE) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, CGenerator.PRECEDENCE];
};

CGenerator['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    CGenerator.includes_['stdbool'] = '#include <stdbool.h>';
    return [code, CGenerator.PRECEDENCE];
};

CGenerator['controls_if'] = function(block) {
    let code = '', branchCode, conditionCode;
    const n = block.elseifCount_ || 0;
    
    for (let i = 0; i <= n; i++) {
        conditionCode = CGenerator.valueToCode(block, 'IF' + i, CGenerator.PRECEDENCE) || 'false';
        branchCode = CGenerator.statementToCode(block, 'DO' + i);
        code += (i === 0 ? 'if' : ' else if') + ' (' + conditionCode + ') {\n' + branchCode + '}';
    }
    
    if (block.elseCount_) {
        branchCode = CGenerator.statementToCode(block, 'ELSE');
        code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
};

// ==================== Python Code Generator ====================
const PythonGenerator = new Blockly.Generator('Python');

PythonGenerator.PRECEDENCE = 0;

PythonGenerator.init = function(workspace) {
    PythonGenerator.definitions_ = Object.create(null);
    PythonGenerator.imports_ = Object.create(null);
    
    if (!PythonGenerator.variableDB_) {
        PythonGenerator.variableDB_ = new Blockly.Names(PythonGenerator.RESERVED_WORDS_);
    } else {
        PythonGenerator.variableDB_.reset();
    }
};

PythonGenerator.finish = function(code) {
    const imports = [];
    for (let name in PythonGenerator.imports_) {
        imports.push(PythonGenerator.imports_[name]);
    }
    
    const definitions = [];
    for (let name in PythonGenerator.definitions_) {
        definitions.push(PythonGenerator.definitions_[name]);
    }
    
    let allDefs = imports.join('\n');
    if (definitions.length) {
        allDefs += '\n\n' + definitions.join('\n\n');
    }
    return allDefs + (allDefs ? '\n\n' : '') + code;
};

PythonGenerator.scrubNakedValue = function(line) {
    return line + '\n';
};

PythonGenerator.scrub_ = function(block, code) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = PythonGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// Python Blocks
PythonGenerator['text_print'] = function(block) {
    const msg = PythonGenerator.valueToCode(block, 'TEXT', PythonGenerator.PRECEDENCE) || '""';
    return 'print(' + msg + ')\n';
};

PythonGenerator['text'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = "'" + textValue.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'";
    return [code, PythonGenerator.PRECEDENCE];
};

PythonGenerator['math_number'] = function(block) {
    const code = parseFloat(block.getFieldValue('NUM'));
    return [code, PythonGenerator.PRECEDENCE];
};

PythonGenerator['math_arithmetic'] = function(block) {
    const OPERATORS = {
        'ADD': [' + ', PythonGenerator.PRECEDENCE],
        'MINUS': [' - ', PythonGenerator.PRECEDENCE],
        'MULTIPLY': [' * ', PythonGenerator.PRECEDENCE],
        'DIVIDE': [' / ', PythonGenerator.PRECEDENCE],
        'POWER': [' ** ', PythonGenerator.PRECEDENCE]
    };
    const tuple = OPERATORS[block.getFieldValue('OP')];
    const operator = tuple[0];
    const order = tuple[1];
    const argument0 = PythonGenerator.valueToCode(block, 'A', order) || '0';
    const argument1 = PythonGenerator.valueToCode(block, 'B', order) || '0';
    const code = argument0 + operator + argument1;
    return [code, order];
};

PythonGenerator['controls_repeat_ext'] = function(block) {
    const repeats = PythonGenerator.valueToCode(block, 'TIMES', PythonGenerator.PRECEDENCE) || '0';
    let branch = PythonGenerator.statementToCode(block, 'DO');
    branch = PythonGenerator.addLoopTrap(branch, block.id) || PythonGenerator.PASS;
    const loopVar = PythonGenerator.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
    const code = 'for ' + loopVar + ' in range(' + repeats + '):\n' + branch;
    return code;
};

PythonGenerator['controls_whileUntil'] = function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = PythonGenerator.valueToCode(block, 'BOOL', PythonGenerator.PRECEDENCE) || 'False';
    if (until) {
        argument0 = 'not (' + argument0 + ')';
    }
    let branch = PythonGenerator.statementToCode(block, 'DO');
    branch = PythonGenerator.addLoopTrap(branch, block.id) || PythonGenerator.PASS;
    return 'while ' + argument0 + ':\n' + branch;
};

PythonGenerator['logic_compare'] = function(block) {
    const OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const argument0 = PythonGenerator.valueToCode(block, 'A', PythonGenerator.PRECEDENCE) || '0';
    const argument1 = PythonGenerator.valueToCode(block, 'B', PythonGenerator.PRECEDENCE) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, PythonGenerator.PRECEDENCE];
};

PythonGenerator['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'True' : 'False';
    return [code, PythonGenerator.PRECEDENCE];
};

PythonGenerator['controls_if'] = function(block) {
    let code = '', branchCode, conditionCode;
    const n = block.elseifCount_ || 0;
    
    for (let i = 0; i <= n; i++) {
        conditionCode = PythonGenerator.valueToCode(block, 'IF' + i, PythonGenerator.PRECEDENCE) || 'False';
        branchCode = PythonGenerator.statementToCode(block, 'DO' + i) || PythonGenerator.PASS;
        code += (i === 0 ? 'if' : 'elif') + ' ' + conditionCode + ':\n' + branchCode;
    }
    
    if (block.elseCount_) {
        branchCode = PythonGenerator.statementToCode(block, 'ELSE') || PythonGenerator.PASS;
        code += 'else:\n' + branchCode;
    }
    return code;
};

PythonGenerator.PASS = '  pass\n';

// ==================== C++ Code Generator ====================
const CPPGenerator = new Blockly.Generator('CPP');

CPPGenerator.PRECEDENCE = 0;

CPPGenerator.init = function(workspace) {
    CPPGenerator.definitions_ = Object.create(null);
    CPPGenerator.includes_ = Object.create(null);
    
    if (!CPPGenerator.variableDB_) {
        CPPGenerator.variableDB_ = new Blockly.Names(CPPGenerator.RESERVED_WORDS_);
    } else {
        CPPGenerator.variableDB_.reset();
    }
    
    const defvars = [];
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
        defvars.push('int ' + CPPGenerator.variableDB_.getName(variables[i].name, 
            Blockly.Variables.NAME_TYPE) + ';');
    }
    CPPGenerator.definitions_['variables'] = defvars.join('\n');
};

CPPGenerator.finish = function(code) {
    const includes = [];
    for (let name in CPPGenerator.includes_) {
        includes.push(CPPGenerator.includes_[name]);
    }
    
    const definitions = [];
    for (let name in CPPGenerator.definitions_) {
        definitions.push(CPPGenerator.definitions_[name]);
    }
    
    const allDefs = includes.join('\n') + '\n\n' + definitions.join('\n\n');
    return allDefs + '\n\nint main() {\n' + code + '  return 0;\n}\n';
};

CPPGenerator.scrubNakedValue = function(line) {
    return line + ';\n';
};

CPPGenerator.scrub_ = function(block, code) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = CPPGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// C++ Blocks
CPPGenerator['text_print'] = function(block) {
    CPPGenerator.includes_['iostream'] = '#include <iostream>\nusing namespace std;';
    const msg = CPPGenerator.valueToCode(block, 'TEXT', CPPGenerator.PRECEDENCE) || '""';
    return 'cout << ' + msg + ' << endl;\n';
};

CPPGenerator['text'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = '"' + textValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    return [code, CPPGenerator.PRECEDENCE];
};

CPPGenerator['math_number'] = function(block) {
    const code = parseFloat(block.getFieldValue('NUM'));
    return [code, CPPGenerator.PRECEDENCE];
};

CPPGenerator['math_arithmetic'] = function(block) {
    const OPERATORS = {
        'ADD': [' + ', CPPGenerator.PRECEDENCE],
        'MINUS': [' - ', CPPGenerator.PRECEDENCE],
        'MULTIPLY': [' * ', CPPGenerator.PRECEDENCE],
        'DIVIDE': [' / ', CPPGenerator.PRECEDENCE],
        'POWER': [null, CPPGenerator.PRECEDENCE]
    };
    const tuple = OPERATORS[block.getFieldValue('OP')];
    const operator = tuple[0];
    const order = tuple[1];
    const argument0 = CPPGenerator.valueToCode(block, 'A', order) || '0';
    const argument1 = CPPGenerator.valueToCode(block, 'B', order) || '0';
    
    if (operator === null) {
        CPPGenerator.includes_['cmath'] = '#include <cmath>';
        return ['pow(' + argument0 + ', ' + argument1 + ')', CPPGenerator.PRECEDENCE];
    }
    const code = argument0 + operator + argument1;
    return [code, order];
};

CPPGenerator['controls_repeat_ext'] = function(block) {
    const repeats = CPPGenerator.valueToCode(block, 'TIMES', CPPGenerator.PRECEDENCE) || '0';
    let branch = CPPGenerator.statementToCode(block, 'DO');
    branch = CPPGenerator.addLoopTrap(branch, block.id);
    const loopVar = CPPGenerator.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
    const code = 'for (int ' + loopVar + ' = 0; ' + loopVar + ' < ' + repeats + '; ' + loopVar + '++) {\n' + branch + '}\n';
    return code;
};

CPPGenerator['controls_whileUntil'] = function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = CPPGenerator.valueToCode(block, 'BOOL', CPPGenerator.PRECEDENCE) || 'false';
    if (until) {
        argument0 = '!(' + argument0 + ')';
    }
    let branch = CPPGenerator.statementToCode(block, 'DO');
    branch = CPPGenerator.addLoopTrap(branch, block.id);
    return 'while (' + argument0 + ') {\n' + branch + '}\n';
};

CPPGenerator['logic_compare'] = function(block) {
    const OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const argument0 = CPPGenerator.valueToCode(block, 'A', CPPGenerator.PRECEDENCE) || '0';
    const argument1 = CPPGenerator.valueToCode(block, 'B', CPPGenerator.PRECEDENCE) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, CPPGenerator.PRECEDENCE];
};

CPPGenerator['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    return [code, CPPGenerator.PRECEDENCE];
};

CPPGenerator['controls_if'] = function(block) {
    let code = '', branchCode, conditionCode;
    const n = block.elseifCount_ || 0;
    
    for (let i = 0; i <= n; i++) {
        conditionCode = CPPGenerator.valueToCode(block, 'IF' + i, CPPGenerator.PRECEDENCE) || 'false';
        branchCode = CPPGenerator.statementToCode(block, 'DO' + i);
        code += (i === 0 ? 'if' : ' else if') + ' (' + conditionCode + ') {\n' + branchCode + '}';
    }
    
    if (block.elseCount_) {
        branchCode = CPPGenerator.statementToCode(block, 'ELSE');
        code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
};

// ==================== Rust Code Generator ====================
const RustGenerator = new Blockly.Generator('Rust');

RustGenerator.PRECEDENCE = 0;

RustGenerator.init = function(workspace) {
    RustGenerator.definitions_ = Object.create(null);
    RustGenerator.imports_ = Object.create(null);
    
    if (!RustGenerator.variableDB_) {
        RustGenerator.variableDB_ = new Blockly.Names(RustGenerator.RESERVED_WORDS_);
    } else {
        RustGenerator.variableDB_.reset();
    }
    
    const defvars = [];
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
        defvars.push('let mut ' + RustGenerator.variableDB_.getName(variables[i].name, 
            Blockly.Variables.NAME_TYPE) + ': i32 = 0;');
    }
    RustGenerator.definitions_['variables'] = defvars.join('\n  ');
};

RustGenerator.finish = function(code) {
    const imports = [];
    for (let name in RustGenerator.imports_) {
        imports.push(RustGenerator.imports_[name]);
    }
    
    const definitions = [];
    for (let name in RustGenerator.definitions_) {
        definitions.push(RustGenerator.definitions_[name]);
    }
    
    let allDefs = imports.join('\n');
    const varsCode = definitions.length ? '  ' + definitions.join('\n  ') : '';
    return allDefs + (allDefs ? '\n\n' : '') + 'fn main() {\n' + varsCode + (varsCode ? '\n' : '') + code + '}\n';
};

RustGenerator.scrubNakedValue = function(line) {
    return line + ';\n';
};

RustGenerator.scrub_ = function(block, code) {
    const nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    const nextCode = RustGenerator.blockToCode(nextBlock);
    return code + nextCode;
};

// Rust Blocks
RustGenerator['text_print'] = function(block) {
    const msg = RustGenerator.valueToCode(block, 'TEXT', RustGenerator.PRECEDENCE) || '""';
    return 'println!("{}", ' + msg + ');\n';
};

RustGenerator['text'] = function(block) {
    const textValue = block.getFieldValue('TEXT');
    const code = '"' + textValue.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"';
    return [code, RustGenerator.PRECEDENCE];
};

RustGenerator['math_number'] = function(block) {
    const code = parseFloat(block.getFieldValue('NUM'));
    return [code, RustGenerator.PRECEDENCE];
};

RustGenerator['math_arithmetic'] = function(block) {
    const OPERATORS = {
        'ADD': [' + ', RustGenerator.PRECEDENCE],
        'MINUS': [' - ', RustGenerator.PRECEDENCE],
        'MULTIPLY': [' * ', RustGenerator.PRECEDENCE],
        'DIVIDE': [' / ', RustGenerator.PRECEDENCE],
        'POWER': [null, RustGenerator.PRECEDENCE]
    };
    const tuple = OPERATORS[block.getFieldValue('OP')];
    const operator = tuple[0];
    const order = tuple[1];
    const argument0 = RustGenerator.valueToCode(block, 'A', order) || '0';
    const argument1 = RustGenerator.valueToCode(block, 'B', order) || '0';
    
    if (operator === null) {
        return ['(' + argument0 + ' as f64).powf(' + argument1 + ' as f64) as i32', RustGenerator.PRECEDENCE];
    }
    const code = argument0 + operator + argument1;
    return [code, order];
};

RustGenerator['controls_repeat_ext'] = function(block) {
    const repeats = RustGenerator.valueToCode(block, 'TIMES', RustGenerator.PRECEDENCE) || '0';
    let branch = RustGenerator.statementToCode(block, 'DO');
    branch = RustGenerator.addLoopTrap(branch, block.id);
    const loopVar = RustGenerator.variableDB_.getDistinctName('i', Blockly.Variables.NAME_TYPE);
    const code = 'for ' + loopVar + ' in 0..' + repeats + ' {\n' + branch + '}\n';
    return code;
};

RustGenerator['controls_whileUntil'] = function(block) {
    const until = block.getFieldValue('MODE') === 'UNTIL';
    let argument0 = RustGenerator.valueToCode(block, 'BOOL', RustGenerator.PRECEDENCE) || 'false';
    if (until) {
        argument0 = '!(' + argument0 + ')';
    }
    let branch = RustGenerator.statementToCode(block, 'DO');
    branch = RustGenerator.addLoopTrap(branch, block.id);
    return 'while ' + argument0 + ' {\n' + branch + '}\n';
};

RustGenerator['logic_compare'] = function(block) {
    const OPERATORS = {
        'EQ': '==',
        'NEQ': '!=',
        'LT': '<',
        'LTE': '<=',
        'GT': '>',
        'GTE': '>='
    };
    const operator = OPERATORS[block.getFieldValue('OP')];
    const argument0 = RustGenerator.valueToCode(block, 'A', RustGenerator.PRECEDENCE) || '0';
    const argument1 = RustGenerator.valueToCode(block, 'B', RustGenerator.PRECEDENCE) || '0';
    const code = argument0 + ' ' + operator + ' ' + argument1;
    return [code, RustGenerator.PRECEDENCE];
};

RustGenerator['logic_boolean'] = function(block) {
    const code = (block.getFieldValue('BOOL') === 'TRUE') ? 'true' : 'false';
    return [code, RustGenerator.PRECEDENCE];
};

RustGenerator['controls_if'] = function(block) {
    let code = '', branchCode, conditionCode;
    const n = block.elseifCount_ || 0;
    
    for (let i = 0; i <= n; i++) {
        conditionCode = RustGenerator.valueToCode(block, 'IF' + i, RustGenerator.PRECEDENCE) || 'false';
        branchCode = RustGenerator.statementToCode(block, 'DO' + i);
        code += (i === 0 ? 'if' : ' else if') + ' ' + conditionCode + ' {\n' + branchCode + '}';
    }
    
    if (block.elseCount_) {
        branchCode = RustGenerator.statementToCode(block, 'ELSE');
        code += ' else {\n' + branchCode + '}';
    }
    return code + '\n';
};

// Reserved words for each language
CGenerator.RESERVED_WORDS_ = 'auto,break,case,char,const,continue,default,do,double,else,enum,extern,float,for,goto,if,int,long,register,return,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile,while';
PythonGenerator.RESERVED_WORDS_ = 'and,as,assert,break,class,continue,def,del,elif,else,except,exec,finally,for,from,global,if,import,in,is,lambda,not,or,pass,print,raise,return,try,while,with,yield';
CPPGenerator.RESERVED_WORDS_ = 'auto,break,case,catch,char,class,const,continue,default,delete,do,double,else,enum,extern,float,for,friend,goto,if,inline,int,long,namespace,new,operator,private,protected,public,register,return,short,signed,sizeof,static,struct,switch,template,this,throw,try,typedef,union,unsigned,virtual,void,volatile,while';
RustGenerator.RESERVED_WORDS_ = 'as,break,const,continue,crate,else,enum,extern,false,fn,for,if,impl,in,let,loop,match,mod,move,mut,pub,ref,return,self,Self,static,struct,super,trait,true,type,unsafe,use,where,while';

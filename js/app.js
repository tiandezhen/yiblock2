// Main application logic

let workspace;
let currentLanguage = 'JavaScript';

// Initialize Blockly workspace
function initBlockly() {
    const toolbox = document.getElementById('toolbox');
    
    workspace = Blockly.inject('blocklyDiv', {
        toolbox: toolbox,
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        trashcan: true,
        renderer: 'zelos',
        theme: Blockly.Theme.defineTheme('yiblock_theme', {
            'base': Blockly.Themes.Classic,
            'blockStyles': {
                'logic_blocks': {
                    'colourPrimary': '#4C97FF',
                    'colourSecondary': '#4280D7',
                    'colourTertiary': '#3373CC'
                },
                'loop_blocks': {
                    'colourPrimary': '#0fbd8c',
                    'colourSecondary': '#0da57a',
                    'colourTertiary': '#0b8e69'
                },
                'math_blocks': {
                    'colourPrimary': '#59C059',
                    'colourSecondary': '#46B946',
                    'colourTertiary': '#389438'
                },
                'text_blocks': {
                    'colourPrimary': '#FF8C1A',
                    'colourSecondary': '#FF8000',
                    'colourTertiary': '#DB6E00'
                }
            }
        })
    });
    
    // Add event listener for workspace changes
    workspace.addChangeListener(function(event) {
        if (event.type === Blockly.Events.BLOCK_CHANGE ||
            event.type === Blockly.Events.BLOCK_CREATE ||
            event.type === Blockly.Events.BLOCK_DELETE ||
            event.type === Blockly.Events.BLOCK_MOVE) {
            updateCode();
        }
    });
    
    // Load default blocks
    loadDefaultBlocks();
    
    // Initial code generation
    updateCode();
}

// Load default example blocks
function loadDefaultBlocks() {
    const xml = Blockly.utils.xml.textToDom(`
        <xml xmlns="https://developers.google.com/blockly/xml">
            <block type="text_print" x="20" y="20">
                <value name="TEXT">
                    <shadow type="text">
                        <field name="TEXT">Hello, YiBlock2!</field>
                    </shadow>
                </value>
            </block>
        </xml>
    `);
    Blockly.Xml.domToWorkspace(xml, workspace);
}

// Update generated code based on selected language
function updateCode() {
    const languageSelect = document.getElementById('languageSelect');
    currentLanguage = languageSelect.value;
    
    let code = '';
    
    try {
        switch (currentLanguage) {
            case 'JavaScript':
                code = Blockly.JavaScript.workspaceToCode(workspace);
                break;
            case 'Python':
                code = PythonGenerator.workspaceToCode(workspace);
                break;
            case 'C':
                code = CGenerator.workspaceToCode(workspace);
                break;
            case 'CPP':
                code = CPPGenerator.workspaceToCode(workspace);
                break;
            case 'Rust':
                code = RustGenerator.workspaceToCode(workspace);
                break;
            default:
                code = '// Unsupported language';
        }
        
        if (!code.trim()) {
            code = getEmptyCodeTemplate(currentLanguage);
        }
    } catch (error) {
        code = '// Error generating code: ' + error.message;
        console.error('Code generation error:', error);
    }
    
    document.getElementById('generatedCode').textContent = code;
}

// Get empty code template for each language
function getEmptyCodeTemplate(language) {
    const templates = {
        'JavaScript': '// 在左侧拖拽积木块开始编程...\n',
        'Python': '# 在左侧拖拽积木块开始编程...\n',
        'C': '#include <stdio.h>\n\nint main() {\n  // 在左侧拖拽积木块开始编程...\n  return 0;\n}\n',
        'CPP': '#include <iostream>\nusing namespace std;\n\nint main() {\n  // 在左侧拖拽积木块开始编程...\n  return 0;\n}\n',
        'Rust': 'fn main() {\n  // 在左侧拖拽积木块开始编程...\n}\n'
    };
    return templates[language] || '// 在左侧拖拽积木块开始编程...';
}

// Copy code to clipboard
function copyCode() {
    const code = document.getElementById('generatedCode').textContent;
    
    navigator.clipboard.writeText(code).then(function() {
        // Show success message
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ 已复制!';
        btn.style.background = '#28a745';
        
        setTimeout(function() {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 2000);
    }, function(err) {
        alert('复制失败: ' + err);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initBlockly();
    
    // Add event listener for language selection
    document.getElementById('languageSelect').addEventListener('change', updateCode);
});

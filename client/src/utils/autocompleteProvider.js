import * as monaco from 'monaco-editor';

/**
 * Smart Autocomplete Provider
 * 
 * Provides language-specific coding suggestions with
 * kid-friendly learning tips for Python, JavaScript, C++, and more.
 * 
 * Each suggestion includes:
 * - Function/keyword name
 * - Brief explanation suitable for young learners
 * - Example of usage
 */

// Python suggestions with learning tips
const pythonSuggestions = [
  {
    label: 'print',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'print(${1:value})',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'print("Hello, World!")',
        '```',
        '',
        '**Learning Tip:** The `print()` function displays text or values on the screen. Great for showing results!'
      ].join('\n')
    },
    detail: 'Display text or values on the screen'
  },
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'if ${1:condition}:',
      '\t${2:# Your code here}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'if score > 10:',
        '    print("You win!")',
        '```',
        '',
        '**Learning Tip:** The `if` statement lets your program make decisions. If the condition is true, the code inside runs!'
      ].join('\n')
    },
    detail: 'Make decisions in your code'
  },
  {
    label: 'for',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'for ${1:item} in ${2:items}:',
      '\t${3:# Your code here}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'for number in range(5):',
        '    print(number)',
        '```',
        '',
        '**Learning Tip:** The `for` loop repeats code for each item in a collection. Great for doing the same thing many times!'
      ].join('\n')
    },
    detail: 'Repeat code for each item in a collection'
  },
  {
    label: 'while',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'while ${1:condition}:',
      '\t${2:# Your code here}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'count = 0',
        'while count < 5:',
        '    print(count)',
        '    count += 1',
        '```',
        '',
        '**Learning Tip:** The `while` loop repeats code as long as a condition is true. Be careful to make sure it eventually stops!'
      ].join('\n')
    },
    detail: 'Repeat code while a condition is true'
  },
  {
    label: 'def',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'def ${1:function_name}(${2:parameters}):',
      '\t${3:# Your code here}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'def greet(name):',
        '    return "Hello, " + name',
        '```',
        '',
        '**Learning Tip:** The `def` keyword creates a function. Functions are like mini-programs you can reuse later!'
      ].join('\n')
    },
    detail: 'Create a reusable function'
  },
  {
    label: 'list',
    kind: monaco.languages.CompletionItemKind.Class,
    insertText: '${1:name} = [${2:items}]',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'fruits = ["apple", "banana", "cherry"]',
        '```',
        '',
        '**Learning Tip:** Lists store multiple items in one variable. You can add, remove, or change items!'
      ].join('\n')
    },
    detail: 'Create a list to store multiple items'
  },
  {
    label: 'input',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: '${1:variable} = input(${2:"Enter something: "})',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```python',
        'name = input("What is your name? ")',
        '```',
        '',
        '**Learning Tip:** The `input()` function asks the user to type something, then gives you what they typed.'
      ].join('\n')
    },
    detail: 'Get input from the user'
  }
];

// JavaScript suggestions with learning tips
const javascriptSuggestions = [
  {
    label: 'console.log',
    kind: monaco.languages.CompletionItemKind.Method,
    insertText: 'console.log(${1:value});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```javascript',
        'console.log("Hello, World!");',
        '```',
        '',
        '**Learning Tip:** The `console.log()` function prints text to the console. Great for showing results or debugging!'
      ].join('\n')
    },
    detail: 'Output a message to the console'
  },
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'if (${1:condition}) {',
      '\t${2:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```javascript',
        'if (score > 10) {',
        '    console.log("You win!");',
        '}',
        '```',
        '',
        '**Learning Tip:** The `if` statement runs code only when a condition is true. It helps your program make decisions!'
      ].join('\n')
    },
    detail: 'Run code conditionally'
  },
  {
    label: 'for',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {',
      '\t${3:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```javascript',
        'for (let i = 0; i < 5; i++) {',
        '    console.log(i);',
        '}',
        '```',
        '',
        '**Learning Tip:** The `for` loop repeats code a specific number of times. It keeps track of how many times it has run.'
      ].join('\n')
    },
    detail: 'Loop a specific number of times'
  },
  {
    label: 'function',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'function ${1:name}(${2:params}) {',
      '\t${3:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```javascript',
        'function greet(name) {',
        '    return "Hello, " + name;',
        '}',
        '```',
        '',
        '**Learning Tip:** Functions let you save code to use again and again. They can take in data and return results!'
      ].join('\n')
    },
    detail: 'Create a reusable function'
  },
  {
    label: 'array',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'const ${1:name} = [${2:items}];',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```javascript',
        'const fruits = ["apple", "banana", "cherry"];',
        '```',
        '',
        '**Learning Tip:** Arrays store multiple items in one variable. You can access any item using its position number (starting from 0).'
      ].join('\n')
    },
    detail: 'Create an array to store multiple items'
  },
  {
    label: 'prompt',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'const ${1:result} = prompt(${2:"Enter something:"});',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```javascript',
        'const name = prompt("What is your name?");',
        '```',
        '',
        '**Learning Tip:** The `prompt()` function shows a popup box that asks the user for input.'
      ].join('\n')
    },
    detail: 'Ask the user for input'
  }
];

// C++ suggestions with learning tips
const cppSuggestions = [
  {
    label: 'cout',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'cout << ${1:"Hello"} << endl;',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        'cout << "Hello, World!" << endl;',
        '```',
        '',
        '**Learning Tip:** `cout` (console output) displays text on the screen. The `<<` symbols send data to the console!'
      ].join('\n')
    },
    detail: 'Output text to the console'
  },
  {
    label: 'cin',
    kind: monaco.languages.CompletionItemKind.Snippet,
    insertText: 'cin >> ${1:variable};',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        'int age;',
        'cin >> age;',
        '```',
        '',
        '**Learning Tip:** `cin` (console input) gets input from the user. The `>>` symbols bring data from the console into your variable!'
      ].join('\n')
    },
    detail: 'Get input from the user'
  },
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'if (${1:condition}) {',
      '\t${2:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        'if (score > 10) {',
        '    cout << "You win!" << endl;',
        '}',
        '```',
        '',
        '**Learning Tip:** The `if` statement checks if a condition is true. If it is, it runs the code inside the curly braces.'
      ].join('\n')
    },
    detail: 'Run code conditionally'
  },
  {
    label: 'for',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'for (int ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {',
      '\t${3:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        'for (int i = 0; i < 5; i++) {',
        '    cout << i << endl;',
        '}',
        '```',
        '',
        '**Learning Tip:** The `for` loop repeats code a specific number of times. It uses a counter variable to keep track.'
      ].join('\n')
    },
    detail: 'Loop a specific number of times'
  },
  {
    label: 'while',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'while (${1:condition}) {',
      '\t${2:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        'int count = 0;',
        'while (count < 5) {',
        '    cout << count << endl;',
        '    count++;',
        '}',
        '```',
        '',
        '**Learning Tip:** The `while` loop repeats code as long as a condition is true. Make sure the condition eventually becomes false!'
      ].join('\n')
    },
    detail: 'Repeat code while a condition is true'
  },
  {
    label: 'include',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: '#include <${1:iostream}>',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        '#include <iostream>',
        '```',
        '',
        '**Learning Tip:** `#include` brings in helpful code from libraries. For example, `<iostream>` gives you `cout` and `cin` for input/output!'
      ].join('\n')
    },
    detail: 'Include a library'
  },
  {
    label: 'vector',
    kind: monaco.languages.CompletionItemKind.Class,
    insertText: 'vector<${1:int}> ${2:name};',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```cpp',
        '#include <vector>',
        '// ...',
        'vector<int> numbers = {1, 2, 3, 4, 5};',
        '```',
        '',
        '**Learning Tip:** `vector` is like a super-powered array that can grow or shrink in size. Perfect for storing collections of items!'
      ].join('\n')
    },
    detail: 'Create a dynamic array'
  }
];

// TypeScript suggestions
const typescriptSuggestions = [
  ...javascriptSuggestions,
  {
    label: 'interface',
    kind: monaco.languages.CompletionItemKind.Interface,
    insertText: [
      'interface ${1:Name} {',
      '\t${2:property}: ${3:type};',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```typescript',
        'interface Person {',
        '    name: string;',
        '    age: number;',
        '}',
        '```',
        '',
        '**Learning Tip:** `interface` defines a shape for objects. It helps TypeScript check if you\'re using objects correctly!'
      ].join('\n')
    },
    detail: 'Define an object type'
  },
  {
    label: 'type',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: 'type ${1:Name} = ${2:type};',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```typescript',
        'type Point = { x: number; y: number };',
        '```',
        '',
        '**Learning Tip:** `type` creates a name for a specific shape of data. This helps TypeScript check your code for mistakes!'
      ].join('\n')
    },
    detail: 'Create a type alias'
  }
];

// PHP suggestions 
const phpSuggestions = [
  {
    label: 'echo',
    kind: monaco.languages.CompletionItemKind.Function,
    insertText: 'echo ${1:"Hello World"};',
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```php',
        'echo "Hello, World!";',
        '```',
        '',
        '**Learning Tip:** `echo` displays text or values on the screen. It\'s one of the most common PHP functions!'
      ].join('\n')
    },
    detail: 'Output text to the browser'
  },
  {
    label: 'if',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'if (${1:condition}) {',
      '\t${2:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```php',
        'if ($score > 10) {',
        '    echo "You win!";',
        '}',
        '```',
        '',
        '**Learning Tip:** The `if` statement checks if something is true and runs code only if it is. Great for making decisions!'
      ].join('\n')
    },
    detail: 'Run code conditionally'
  },
  {
    label: 'foreach',
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: [
      'foreach (${1:$array} as ${2:$item}) {',
      '\t${3:// Your code here}',
      '}'
    ].join('\n'),
    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
    documentation: {
      value: [
        '```php',
        'foreach ($fruits as $fruit) {',
        '    echo $fruit . "<br>";',
        '}',
        '```',
        '',
        '**Learning Tip:** The `foreach` loop goes through each item in an array one by one. Great for working with lists of things!'
      ].join('\n')
    },
    detail: 'Loop through an array'
  }
];

/**
 * Register custom autocomplete providers for each supported language
 * @returns {void}
 */
export const registerAutocompleteProviders = () => {
  // Python autocomplete
  monaco.languages.registerCompletionItemProvider('python', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: pythonSuggestions
      };
    }
  });

  // JavaScript autocomplete
  monaco.languages.registerCompletionItemProvider('javascript', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: javascriptSuggestions
      };
    }
  });

  // TypeScript autocomplete
  monaco.languages.registerCompletionItemProvider('typescript', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: typescriptSuggestions
      };
    }
  });

  // C++ autocomplete
  monaco.languages.registerCompletionItemProvider('cpp', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: cppSuggestions
      };
    }
  });

  // C autocomplete (reuse C++ suggestions)
  monaco.languages.registerCompletionItemProvider('c', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: cppSuggestions
      };
    }
  });

  // PHP autocomplete
  monaco.languages.registerCompletionItemProvider('php', {
    provideCompletionItems: (model, position) => {
      return {
        suggestions: phpSuggestions
      };
    }
  });
};

/**
 * Configure Monaco Editor's hover provider to show tooltips with learning tips
 */
export const configureHoverProviders = () => {
  // Python hover provider
  monaco.languages.registerHoverProvider('python', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      
      const suggestion = pythonSuggestions.find(s => s.label === word.word);
      if (!suggestion) return null;
      
      return {
        contents: [
          { value: '**' + suggestion.detail + '**' },
          { value: suggestion.documentation.value }
        ]
      };
    }
  });

  // JavaScript hover provider
  monaco.languages.registerHoverProvider('javascript', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      
      const suggestion = javascriptSuggestions.find(s => s.label === word.word);
      if (!suggestion) return null;
      
      return {
        contents: [
          { value: '**' + suggestion.detail + '**' },
          { value: suggestion.documentation.value }
        ]
      };
    }
  });

  // C++ hover provider
  monaco.languages.registerHoverProvider('cpp', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      
      const suggestion = cppSuggestions.find(s => s.label === word.word);
      if (!suggestion) return null;
      
      return {
        contents: [
          { value: '**' + suggestion.detail + '**' },
          { value: suggestion.documentation.value }
        ]
      };
    }
  });
};

export const configureAutocomplete = () => {
  registerAutocompleteProviders();
  configureHoverProviders();
}; 
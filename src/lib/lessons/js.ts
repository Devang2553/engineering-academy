import type { Lesson } from "./model";

export const JS_LESSONS: Record<string, Lesson> = {
  "JS1-U01": {
    unitId: "JS1-U01",
    intro: "Welcome to your very first lesson. Every line of JavaScript you will ever write rests on this idea: the engine keeps a careful record of where it is. Read slowly, and let the picture form.",
    sections: [
      {
        heading: "The execution context",
        body: [
          "Whenever JavaScript runs code, it wraps that code in an execution context. The global execution context is created first, and it is the one that exists for the whole program.",
          "Each execution context works in two phases. In the memory creation phase, the engine scans the code and sets aside space for variables and functions. Variables declared with var start as undefined, and function declarations are stored in full. In the code execution phase, the engine runs the code line by line and fills in the values.",
          "The global context also has a global object, which in a browser is window, and a this keyword that points to it in a classic script. The variables live in a variable environment, which is simply the record of names and values for that context.",
        ],
      },
      {
        heading: "The call stack",
        body: [
          "The engine keeps track of its contexts in a call stack. Think of a stack of plates: you can only add or remove the top plate. This is a last-in, first-out structure.",
          "The global context sits at the bottom. When a function is called, a new execution context is pushed on top. When that function returns, its context is popped off, and execution goes back to the one beneath it.",
          "If functions keep calling each other without ever returning, the stack grows until it runs out of room. The browser then throws a RangeError with the message Maximum call stack size exceeded. That is a stack overflow.",
        ],
      },
    ],
    takeaways: [
      "Every run of code begins with a global execution context.",
      "Each context has a memory creation phase, then a code execution phase.",
      "The call stack is last-in, first-out: the top context runs, and when it returns it is removed.",
    ],
    checks: {
      "JS1-T001": [
        {
          prompt: "In what order does an execution context process its work?",
          options: ["Code execution, then memory creation", "Memory creation, then code execution", "Only code execution", "Parsing, then deleting the variables"],
          answer: 1,
          explanation: "The memory creation phase sets up space for variables and functions first. The code execution phase then runs the code and fills in values.",
        },
        {
          prompt: "What does the global execution context provide by default in a browser?",
          options: ["A new thread for each function", "A global object (window) and a this keyword pointing to it", "Nothing until the first function is called", "A network cache"],
          answer: 1,
          explanation: "The global context creates the global object, which is window in a browser, and sets this to point to it in a classic script.",
        },
        {
          prompt: "Where are a context's variables and functions kept?",
          options: ["In the DOM tree", "In the event queue", "In its variable environment", "In the browser's cookie store"],
          answer: 2,
          explanation: "The variable environment is the record of names and values belonging to one execution context.",
        },
      ],
      "JS1-T002": [
        {
          prompt: "Which data structure does the call stack follow?",
          options: ["First-in, first-out (a queue)", "Last-in, first-out (a stack)", "Random access (a hash map)", "Sorted order (a tree)"],
          answer: 1,
          explanation: "The call stack is last-in, first-out. The most recently pushed context is the first one removed.",
        },
        {
          prompt: "What happens to a function's execution context when the function returns?",
          options: ["It is copied into the global context", "It is popped off the call stack", "It is pushed to the bottom of the stack", "It stays in memory forever"],
          answer: 1,
          explanation: "When a function returns, its context is removed from the top of the stack, and control goes back to the context below it.",
        },
        {
          prompt: "What error does an endless chain of calls usually produce?",
          options: ["SyntaxError", "RangeError: Maximum call stack size exceeded", "TypeError: undefined is not a function", "ReferenceError: x is not defined"],
          answer: 1,
          explanation: "When the stack runs out of room, the engine throws a RangeError. That is the stack overflow message you will see most often.",
        },
      ],
    },
  },

  "JS1-U02": {
    unitId: "JS1-U02",
    intro: "Here is a small mystery that trips up almost every developer at first: why can a variable be used before the line where it is declared? By the end of this lesson, the mystery will feel quite ordinary.",
    sections: [
      {
        heading: "Hoisting",
        body: [
          "Hoisting is not the code moving up the page. It is the result of the memory creation phase. Before any line runs, the engine has already noticed every var and every function declaration in the context.",
          "A var declaration is given the value undefined during that phase. So reading it before its line gives undefined, not an error. A function declaration is stored in full, so you can call it above the place where it is written.",
          "A function expression stored in a var behaves differently. The var exists early, but it holds undefined until the assignment line runs. Calling it too early produces a TypeError, because undefined is not a function.",
        ],
      },
      {
        heading: "Undefined and not defined",
        body: [
          "undefined is a value. It means a variable has been declared but has not been given anything yet. It is what the engine places in a var during memory creation.",
          "not defined is an error. It means the name was never declared anywhere in the scope chain. Reading it throws a ReferenceError with the message x is not defined.",
          "There is one helpful exception. typeof on a name that was never declared returns the string undefined and does not throw. That makes it a safe check when you are unsure whether a global exists.",
        ],
      },
    ],
    takeaways: [
      "var is hoisted and starts as undefined. Function declarations are hoisted whole.",
      "Calling a function expression before its assignment throws a TypeError.",
      "undefined means declared with no value yet. not defined means never declared, and it throws a ReferenceError.",
    ],
    checks: {
      "JS1-T003": [
        {
          prompt: "What does this print? console.log(a); var a = 5;",
          options: ["5", "undefined", "ReferenceError", "null"],
          answer: 1,
          explanation: "The var is hoisted and set to undefined during memory creation, so the first log shows undefined. The assignment to 5 happens later.",
        },
        {
          prompt: "Are function declarations hoisted along with their bodies?",
          options: ["Yes, the whole function is available early", "No, only the name is hoisted", "No, they are never hoisted", "Only in strict mode"],
          answer: 0,
          explanation: "A function declaration is stored in full during the memory creation phase, so you can call it before the line where it appears.",
        },
        {
          prompt: "What happens when this runs? console.log(f()); var f = function () { return 1; };",
          options: ["It prints 1", "It prints undefined", "It throws TypeError: f is not a function", "It throws ReferenceError: f is not defined"],
          answer: 2,
          explanation: "f exists early because of var, but it holds undefined until the assignment line runs. Calling undefined throws a TypeError.",
        },
      ],
      "JS1-T004": [
        {
          prompt: "What happens when you read console.log(x) and x was never declared?",
          options: ["It prints undefined", "It throws ReferenceError: x is not defined", "It prints null", "It prints 0"],
          answer: 1,
          explanation: "A name that was never declared anywhere in the scope chain cannot be read, so the engine throws a ReferenceError.",
        },
        {
          prompt: "Does typeof on an undeclared name throw an error?",
          options: ["Yes, always a ReferenceError", "No, it returns the string \"undefined\"", "No, it returns null", "Only in strict mode"],
          answer: 1,
          explanation: "typeof is a safe way to check an undeclared name. It returns the string \"undefined\" and does not throw.",
        },
        {
          prompt: "What does undefined mean as a value?",
          options: ["The variable does not exist", "The variable is declared but has no value yet", "The value is zero", "The value is an empty string"],
          answer: 1,
          explanation: "undefined means the name exists in the scope but has not been given a value. not defined is the separate case where the name does not exist.",
        },
      ],
    },
  },

};

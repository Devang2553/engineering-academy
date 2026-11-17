import type { Lesson } from "./model";

export const JS_LESSONS: Record<string, Lesson> = {
  "JS1-U01": {
    unitId: "JS1-U01",
    intro: "Welcome, and let us begin at the very beginning. Before JavaScript runs a single line, it builds a small picture of your code in its head. Learn how that picture is made, and the rest of the language will start to make sense.",
    sections: [
      {
        heading: "The execution context: a box built around your code",
        body: [
          "Think of an execution context as a box the engine builds around code before that code runs. Everything in JavaScript happens inside one of these boxes, and the very first box is the global execution context.",
          "Each box is built in two steps. First comes the creation phase: the engine walks through the code, makes room for every variable and function, and stores each function in full. Then comes the execution phase, where the code runs line by line and the values fill in.",
          "In the browser, the global box also creates the global object, window, and points this at it. Every box keeps its names and values in a memory component, which is how the engine finds them again later.",
        ],
      },
      {
        heading: "The call stack: a pile of plates",
        body: [
          "Each time a function is called, the engine builds a new box for it and places that box on the call stack. The stack works like a pile of plates. You can only reach the top plate, so the box placed last is the first one taken off.",
          "When a function finishes, its box is removed and the engine goes back to the box beneath it. The global box stays at the bottom until the program ends.",
          "If calls keep piling up and never finish, the pile overflows, and the browser throws RangeError: Maximum call stack size exceeded. A recursive function with no stopping point is the usual cause.",
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
    intro: "Here is a puzzle that confuses almost everyone at first: why can a variable seem to exist before the line where it is written? The answer lives in the creation phase, and once you see it, hoisting stops feeling like magic.",
    sections: [
      {
        heading: "Hoisting: what the creation phase already knows",
        body: [
          "Hoisting does not mean the code physically jumps to the top. It is a consequence of the creation phase. The engine reads the whole program first, so it already knows about every var and function declaration before a single line runs.",
          "During that reading, a var is given the value undefined. So reading it early gives you undefined rather than an error. A function declaration is stored in full, so you can call it above the line where it is written.",
          "A function expression stored in a var only gets the var early. The var holds undefined until the assignment line runs, so calling it too soon throws a TypeError, because undefined is not a function.",
        ],
      },
      {
        heading: "Undefined and not defined: two different situations",
        body: [
          "undefined is a value. It tells you a name exists in memory but has nothing in it yet. It is exactly what the creation phase places inside a var.",
          "not defined is an error. It means the name is not in memory at all, anywhere the engine can look. Reading it throws a ReferenceError with the message x is not defined.",
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

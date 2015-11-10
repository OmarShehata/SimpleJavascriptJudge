# SimpleJavascriptJudge
A purely client side live-testing tool to grade code style and structure

## Demo

[Try out the live demo!](http://omarshehata.me/html/jsjudge/)

## How to run locally

You will need to fire up a local web server to run locally. The easiest way is using python, run the following command in the working directory:
(assuming Python 3)
```sh
python -m http.server
```

The only reason it needs a local web server is because it attempts to load the `judge_thread.js` file as a Web Worker. You can uncomment the line that simulates no worker support to disable this (you'll find it at the top of `example.js`), which will allow you to just open `index.html` in a browser to run it.

## Documentation

### What does each file do?

- **lib/** contains the source for the ACE code editor and Jquery. It also contains Acorn which handles the Javascript parsing.
- **index.html** the main entry point where everything is included
- **index.css** makes our webpage look (somewhat) pretty
- **judge.js** contains all the meat of our API. This is the file that can be included in your own project if you wish to use this parser/grading tool without the interface
- **judge_thread.js** for web browsers that support Web Workers, it runs the heavy lifting in a seperate process so as not to hang the client
- **example.js** shows you how to use `judge.js` and write tests for it

## Overview of how judge.js works

1. The first step is to include the file as shown in `index.html`
2. You can then write tests as shown in `example.js` (explained further below) and add them using `Judge.addTest(testObject)`
3. Run `Judge.examine(codeString)` which takes in Javascript code as a string, parses it, and returns an array of all the test objects created, and a boolean value stating whether this test failed or succeeded. If there was a syntax error, you'll find it as `feedback['error']` where `feedback` is the object returned. 

### How to write your own tests


```javascript
var varTest = {}
varTest['structure'] = {'var_foo':'bar'}
varTest['description'] = "Create a variable called 'foo' and initialize it with 'bar'"
```
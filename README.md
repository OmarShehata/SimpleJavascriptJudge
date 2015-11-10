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

### How to write your own tests



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

The only reason it needs a local web server is because it attempts to load the `judge_thread.js` file as a Web Worker. You can uncomment the line that simulates no worker support to disable this, which will allow you to just open `index.html` in a browser to run it.

## Documentation

### What does each file do?

### How to write your own tests



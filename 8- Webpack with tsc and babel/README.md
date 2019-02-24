

npm i webpack webpack-cli  babel-loader  @babel/core @babel/preset-env  html-webpack-plugin --save-dev

npm i typescript --save-dev

and add 
"start": "webpack",
"start:ts": "tsc app.ts",

firstly run 'npm run start:ts' after run 'npm run start'

Sources:
https://iamturns.com/typescript-babel/

ts-loader: convert typescript (es6) to javascript (es6)
babel-loader: converts javascript (es6) to javascript (es5)




npm i webpack webpack-cli --save-dev

npm i babel-loader --save-dev

npm i @babel/core @babel/preset-env --save-dev

npm i html-webpack-plugin --save-dev

and add 
"start": "webpack",

--
babel-preset-es2015 yerine artık babel-preset-env kullanılıyor!
babel-core babel-preset-env yerine babel/core @babel/preset-env kullanılıyor!

Sources:
http://ccoenraets.github.io/es6-tutorial-data/babel-webpack/
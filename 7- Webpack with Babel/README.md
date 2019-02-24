

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
https://www.robinwieruch.de/minimal-react-webpack-babel-setup/

old version
https://medium.com/beginners-guide-to-mobile-web-development/introduction-to-webpack-4-e528a6b3fc16
https://medium.com/javascript-training/beginner-s-guide-to-webpack-b1f1a3638460
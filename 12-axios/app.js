import axios from 'axios';



axios.get('https://api.github.com/users/mapbox')
  .then((response) => {
    console.log(response.data);
    console.log(response.status);
    console.log(response.statusText);
    console.log(response.headers);
    console.log(response.config);
  });


// execute simultaneous requests 
axios.all([
  axios.get('https://api.github.com/users/mapbox'),
  axios.get('https://api.github.com/users/phantomjs')
])
  .then(responseArr => {
    //this will be executed only when all requests are complete
    console.log('Date created: ', responseArr[0].data.created_at);
    console.log('Date created: ', responseArr[1].data.created_at);
  });

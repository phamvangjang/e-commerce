const axios = require('axios');

module.exports = {
    request: () => {
        return axios.get('https://jsonplaceholder.typicode.com/todos/1')
    }
}
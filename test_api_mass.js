const axios = require('axios');

let num_req = 100;

let i = 0;

let begin = Date.now();
const completed = [];

while (i < num_req) {
    axios.post('http://localhost:3000/api/get_token', {user: Math.floor(Math.random() * 100)}).then(res => {

        let uid = res.data.uid;
        axios.post('http://localhost:3000/api/save_activity', {uid: uid, actions: [
                {
                    id: Math.floor(Math.random() * 100), value: 'asd', amount: 1.2, date: new Date(Date.now())
                },
                {
                    id: Math.floor(Math.random() * 100), value: 'asasd', amount: 1.12, date: Date.now()
                }
            ]}).then(res => {
                completed.push('asd');
                if (completed.length === num_req) {
                    console.log(Date.now() - begin, 'ms');
                }
        });
    });
    i += 1;
}

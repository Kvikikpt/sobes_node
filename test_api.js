const axios = require('axios');

axios.post('http://localhost:3000/api/get_token', {user: 476}).then(res => {
    let uid = res.data.uid;
    axios.post('http://localhost:3000/api/save_activity', {uid: uid, actions: [
            {
                id: Math.floor(Math.random() * 100), value: 'asd', amount: 1.2, date: new Date(Date.now())
            },
        ]}).then(res => {
        console.log(res.data);
    });
});

axios.post('http://localhost:3000/api/get_token', {user: 476}).then(res => {
    let uid = res.data.uid;
    axios.post('http://localhost:3000/api/activity_stat', {uid: uid, date: '2021-03-06'}).then(res => {
        console.log(res.data);
    });
});

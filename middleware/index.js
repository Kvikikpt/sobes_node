const {db} = require('../db');

async function token_check(req, res, next) {
    const uid = req.body.uid;

    if (uid) {
        db.get(`select * from user_token where token = '${uid}'`, async function(err, row) {
            if (!err) {
                if (row) {
                    const now = new Date();
                    const db_date = new Date(row.date)
                    const ten_min = 600000;
                    if (now - db_date < ten_min) {
                        req.user = row;
                        next();
                    }
                    else {
                        res.json({code: 3});
                    }
                }
                else {
                    res.json({code: 1});
                }
            }
            else {
                res.json({code: 1});
            }
        });
    }
    else {
        res.json({code: 1});
    }
}

module.exports = {
    token_check
}
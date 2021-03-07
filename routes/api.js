const express = require('express');
const router = express.Router();
const {db} = require('../db');
const {uid} = require('uid');

const {token_check} = require('../middleware')

/* Получение уникального идентификатора. */
router.post('/get_token', async function(req, res, next) {
    const user = req.body.user;

    if (Number.isInteger(user)) {
        db.get(`select * from user_token where user = ${user}`, async function(err, row) {
            if (!err) {
                if (row) {
                    const now = new Date();
                    const db_date = new Date(row.date)
                    const ten_min = 600000;
                    if (now - db_date < ten_min) {
                        res.json({code: 2, uid: row.token})
                    }
                    else {
                        const token = uid();
                        db.run(`update user_token set token = '${token}', date = ${Date.now()} 
                        where user = ${row.user}`,
                            function(err) {
                                if (err) {
                                    res.json({code: 1});
                                }
                                else {
                                    res.json({code: 0, uid: token});
                                }
                            });
                    }
                }
                else {
                    const token = uid();
                    db.run(`insert into user_token (token, user, date) values ('${token}', '${user}', ${Date.now()})`,
                        function(err) {
                            if (err) {
                                res.json({code: 1});
                            }
                            else {
                                res.json({code: 0, uid: token});
                            }
                        });
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
});

/* Последвоательное сохрание активностей/ */
router.post('/save_activity', token_check, function(req, res, next) {
    const actions = req.body.actions;

    if (actions) {
        if (Array.isArray(actions) && actions.length > 0) {
            db.run(`insert into activities_action (date) values (${Date.now()})`,
                async function(err) {
                    if (!err && this.lastID) {
                        const action_id = this.lastID;
                        const user = req.user;
                        let completed = [];
                        let error = false;
                        for (let [index, action] of actions.entries()) {
                            let date;
                            try {
                                date = new Date(action.date).getTime();
                            } catch (err) {
                                error = true
                            }
                            db.run(`insert into activities (id, action_id, user_id, value, amount, date) values (
                            ${action.id},
                            ${action_id},
                            ${user.user},
                            '${action.value}',
                            ${action.amount},
                            ${date}
                            )`, function (err) {
                                if (err) {
                                    error = true;
                                }
                                completed.push(index);
                                if (completed.length === actions.length) {
                                    if (error) {
                                        db.run(`delete from activities where action_id = ${action_id}`);
                                        db.run(`delete from activities_action where action_id = ${action_id}`);
                                        res.json({code: 1});
                                    }
                                    else {
                                        db.all(`select id, value, amount, date from activities 
                                        where user_id = ${user.user}`, async function (err, rows) {
                                            if (!err && rows) {
                                                for (let row of rows) {
                                                    row.date = new Date(row.date);
                                                }
                                                res.json({code: 0, id: action_id, actions: rows});
                                            }
                                            else {
                                                res.json({code: 1});
                                            }
                                        });
                                    }
                                }
                            });
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
    else {
        res.json({code: 1});
    }
});

/* Получение статистики по активностям. */
router.post('/activity_stat', token_check, async function(req, res, next) {
    const date = req.body.date;

    const regex = new RegExp('^\\d{4}\\-(0?[1-9]|1[012])\\-(0?[1-9]|[12][0-9]|3[01])$');

    if (regex.test(date)) {
        let parsed = Date.parse(date)
        let parser_plus = new Date(parsed).setDate(new Date(parsed).getDate() + 1);

        const user = req.user;
        db.get(`
        select count(id) as count, sum(amount) as sum
        from activities where user_id = ${user.user} and date >= ${parsed} and date < ${parser_plus}
        group by value`,
            async function (err, row) {
                if (!err && row) {
                    res.json({code: 0, count: row.count, sum: row.sum});
                }
                else {
                    res.json({code: 1});
                }
            })
    }
    else {
        res.json({code: 1});
    }
});

module.exports = router;

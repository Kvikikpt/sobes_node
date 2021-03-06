function init (db) {
    console.log('Initialize SQLite database.');

    db.run(`CREATE TABLE IF NOT EXISTS user_token (
        token TEXT,
        user INTEGER NOT NULL PRIMARY KEY,
        date INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activities_action (
        action_id INTEGER NOT NULL PRIMARY KEY,
        date INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS activities (
        id INTEGER NOT NULL,
        action_id INTEGER NOT NULL,
        user_id INTEGER,
        value TEXT,
        amount REAL,
        date INTEGER,
        FOREIGN KEY (action_id)
            REFERENCES activities_action (action_id)
                ON UPDATE CASCADE 
                ON DELETE CASCADE,
        FOREIGN KEY (user_id)
            REFERENCES user_token (user)
                ON UPDATE CASCADE
                ON DELETE CASCADE,
        unique (id, user_id)
    )`);
}

module.exports = init;
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express()
const port = 3000
app.use(cors());
app.use(bodyParser.json())

const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    connectionLimit: 5,
    database: 'rixtrema'
});



app.post('/user', (req, res) => {
    saveToDB(req.body.user, res)
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

function saveToDB(user_obj, exp_res) {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * from users WHERE g_id = " + user_obj.g_id)
                .then((rows) => {

                    if (rows.length === 0){
                        conn.query(`INSERT INTO users (id, g_id, name, given_name, family_name, image_url, mail) VALUES( null, "${user_obj.g_id}", "${user_obj.name}", "${user_obj.given_name}", "${user_obj.family_name}", "${user_obj.image_url}", "${user_obj.mail}")` );
                        return "Запись прошла успешно"
                    }else{
                        return "Такой юзер уже есть"
                    }
                })
                .then((res) => {
                    console.log(res); // { affectedRows: 1, insertId: 1, warningStatus: 0 }
                    exp_res.send(res);
                    conn.end();
                })
                .catch(err => {
                    //handle error
                    console.log(err);
                    conn.end();
                })

        }).catch(err => {
            //not connected
        });
}
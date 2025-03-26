import dbClient from "../index.js";

const registerUser = async (fname, lname, email, password) => {
    const db = await dbClient;
    const sql = "INSERT INTO users (fname, lname, email, password) VALUES ('$1', '$2', '$3', '$4')"
    const result = await db.query(sql, [fname, lname, email, password]);
    return result.rows;
}

const userExist = async (email) => {
    const db = await dbClient;
    const sql = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
    const values = [email];
    const [rows] = await db.execute(sql, values);
    
    return rows[0].count > 0; 
};

export {registerUser, userExist};
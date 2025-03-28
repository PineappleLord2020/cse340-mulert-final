import dbClient from "../index.js";

const registerUser = async (fname, lname, email, password) => {
    const db = await dbClient;
    const sql = "INSERT INTO users (fname, lname, email, password) VALUES ('$1', '$2', '$3', '$4')"
    const result = await db.query(sql, [fname, lname, email, password]);
    return result.rows;
};

const userExist = async (email, password) => {
    const db = await dbClient;
    const sql = `SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
    const values = [email, password];
    const [user] = await db.execute(sql, values );
    
    return user
};

export {registerUser, userExist};
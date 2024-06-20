const db = require("../helpers/database");

exports.getUserById = async function getUserById(id) {
    let query = "SELECT * FROM users WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

exports.getByUsername = async function getByUsername(username) {
    let query = "SELECT * FROM users WHERE username = ?";
    let values = [username];
    let data = await db.run_query(query, values);
    return data;
}

exports.getAllUsers = async function getAllUsers () {
    let query = "SELECT * FROM users;";
    let data = await db.run_query(query);
    return data;
}

exports.addUser = async function addUser (user) {
    let query = "INSERT INTO users SET ?";
    let data = await db.run_query(query, user);
    return data;
}
  
exports.deleteUser = async function deleteUser (user) {
    let query = "DELETE FROM users WHERE ID = ?";
    let data = await db.run_query(query, user);
    return data;
}

exports.updateUser = async function updateUser (user, id) {
    let query = "UPDATE users SET ? WHERE ID = ?";
    let values = [user, id];
    let data = await db.run_query(query, values);
    return data;
}
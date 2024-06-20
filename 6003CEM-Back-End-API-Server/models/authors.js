const db = require("../helpers/database");

exports.getAuthorById = async function getAuthorById(id) {
    let query = "SELECT * FROM authors WHERE authorID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

exports.getByName = async function getByName(authorname) {
    let query = "SELECT * FROM authors WHERE authorName = ?";
    let values = [authorname];
    let data = await db.run_query(query, values);
    return data;
}

exports.getAllAuthors = async function getAllAuthors () {
    let query = "SELECT * FROM authors;";
    let data = await db.run_query(query);
    return data;
}

exports.addAuthor = async function addAuthor (author) {
    let query = "INSERT INTO authors SET ?";
    let data = await db.run_query(query, author);
    return data;
}
  
exports.deleteAuthor = async function deleteAuthor (author) {
    let query = "DELETE FROM authors WHERE authorID = ?";
    let data = await db.run_query(query, author);
    return data;
}

exports.updateUser = async function updateUser (author, id) {
    let query = "UPDATE authors SET ? WHERE authorID = ?";
    let values = [author, id];
    let data = await db.run_query(query, values);
    return data;
}
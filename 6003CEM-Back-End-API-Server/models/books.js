const db = require("../helpers/database");

exports.getById = async function getById(id) {
    let query = "SELECT * FROM books WHERE ID = ?";
    let values = [id];
    let data = await db.run_query(query, values);
    return data;
}

exports.getAll = async function getAll () {
    let query = "SELECT * FROM books;";
    let data = await db.run_query(query);
    return data;
  }

exports.addBook = async function addBook (book) {
    let query = "INSERT INTO books SET ?";
    let data = await db.run_query(query, book);
    return data;
}
  
exports.deleteBook = async function deleteBook (book) {
    let query = "DELETE FROM books WHERE ID = ?";
    let data = await db.run_query(query, book);
    return data;
}

exports.updateBook = async function updateBook (book, id) {
    let query = "UPDATE books SET ? WHERE ID = ?";
    let values = [book, id];
    let data = await db.run_query(query, values);
    return data;
}
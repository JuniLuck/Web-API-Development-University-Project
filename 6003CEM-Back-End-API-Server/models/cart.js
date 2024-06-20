const db = require('../helpers/database');


exports.addToCart = async function addToCart (userid, bookid) {
  let query = "INSERT INTO carts SET userID=?, bookID=? ON DUPLICATE KEY UPDATE bookID=bookID; ";  // fail silently if the like is already there
  const result = await db.run_query(query, [userid, bookid]);
  return result;
}

exports.removeFromCart = async function removeFromCart (userid, bookid) {
  let query = "DELETE FROM carts WHERE userID=? AND bookID=?; ";
  const result = await db.run_query(query, [userid, bookid]);
  return result;
}
  

exports.getCart = async function getCart (userid) {
  let query = "SELECT * FROM carts WHERE userID=?;";
  const result = await db.run_query(query, userid);
  return result;
}

exports.checkCart = async function checkCart (userid, bookid) {
  let query = "SELECT * FROM carts WHERE userID=? AND bookID=?;";
  const result = await db.run_query(query, [userid, bookid]);
  if (result.length) { return true }
  else { return false }
}

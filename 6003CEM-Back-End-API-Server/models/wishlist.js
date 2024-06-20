const db = require('../helpers/database');


exports.addToWishlist = async function addToWishlist (userid, bookid) {
  let query = "INSERT INTO wishlist SET userID=?, bookID=? ON DUPLICATE KEY UPDATE bookID=bookID; ";  // fail silently if the like is already there
  const result = await db.run_query(query, [userid, bookid]);
  return result;
}

exports.removeFromWishlist = async function removeFromWishlist (userid, bookid) {
  let query = "DELETE FROM wishlist WHERE userID=? AND bookID=?; ";
  const result = await db.run_query(query, [userid, bookid]);
  return result;
}
  

exports.getWishlist = async function getWishlist (userid) {
  let query = "SELECT * FROM wishlist WHERE userID=?;";
  const result = await db.run_query(query, userid);
  return result;
}

exports.checkWishlist = async function checkWishlist (userid, bookid) {
  let query = "SELECT * FROM wishlist WHERE userID=? AND bookID=?;";
  const result = await db.run_query(query, [userid, bookid]);
  if (result.length) { return true }
  else { return false }
}
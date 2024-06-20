const Koa = require("koa");
const { use } = require("koa-passport");
const cors = require("@koa/cors");

const app = new Koa();

app.use(cors());

const books = require("./routes/books.js");
const special = require("./routes/special.js");
const users = require("./routes/users.js");
app.use(books.routes());
app.use(special.routes());
app.use(users.routes());

let port = process.env.PORT || 3000;

app.listen(port);

//TODO
// - openAPI documentation (week 5)

const Router = require("koa-router");
const model = require("../models/books");
const bodyParser = require("koa-bodyparser");
const {validateBook} = require("../controllers/book_validation");
const { jwtAuthentication } = require("../strategies/jwt")
const { addToCart, removeFromCart, getCart, checkCart } = require("../models/cart");
const { removeFromWishlist, addToWishlist, getWishlist, checkWishlist } = require("../models/wishlist");
const { checkAccess } = require("../permissions/jwt_roles")

const prefix = "/api/v1/books";
const router = Router({prefix: prefix});

router.get("/", getAll);
router.post("/", bodyParser(), jwtAuthentication, validateBook, createBook);
router.get("/:id([0-9]{1,})", getById);
router.put("/:id([0-9]{1,})", bodyParser(), jwtAuthentication, updateBook);  
router.del("/:id([0-9]{1,})", jwtAuthentication, deleteBook);  
router.post("/:id([0-9]{1,})/cart", jwtAuthentication, addCart);
router.del("/:id([0-9]{1,})/cart", jwtAuthentication, removeCart);
router.post("/:id([0-9]{1,})/wishlist", jwtAuthentication, addWishlist);
router.del("/:id([0-9]{1,})/wishlist", jwtAuthentication, removeWishlist);
router.get("/:id([0-9]{1,})/cart", jwtAuthentication, checkIfInCart)
router.get("/:id([0-9]{1,})/wishlist", jwtAuthentication, checkIfInWishlist)
router.get("/cart", jwtAuthentication, seeCart)
router.get("/wishlist", jwtAuthentication, seeWishlist)


async function getAll(ctx) {
    try {
        const {page=1, limit=100, order="bookTitle", direction='ASC'} = ctx.request.query;
        let books = await model.getAll(page,limit,order,direction);
        if (books.length) {
        const body = books.map(book => {
            const {ID, bookTitle, bookCoverURL, AuthorID, price} = book;
            const links = {
                cart: `${ctx.protocol}s://${ctx.host}${prefix}/${book.ID}/cart`,
                wishlist: `${ctx.protocol}s://${ctx.host}${prefix}/${book.ID}/wishlist`,
                self: `${ctx.protocol}s://${ctx.host}${prefix}/${book.ID}`
            }
            return {ID, bookTitle, bookCoverURL, AuthorID, price, links};
        })
        ctx.status = 200;
        ctx.body = body;
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function getById(ctx){
    try {
        let id = ctx.params.id;
        let book = await model.getById(id);
        if (book.length) {
            ctx.status = 200;
            ctx.body = book[0];
        }
        else {
            ctx.status = 401;
            ctx.body = {message: "No book found"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function createBook(ctx) {
    try {
        if (await checkAccess("admin", ctx) == true) {
            const body = ctx.request.body;
            let result = await model.addBook(body);
            if (result) {
                ctx.status = 200;
                ctx.body = {ID: result.insertId}
            }
        }
        else {
            ctx.status = 402;
            ctx.body = {message: "Only admins can delete other people's accounts"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function updateBook(ctx) {
    console.log("update");
    try{
        if (await checkAccess("admin", ctx) == true) {
            const id = ctx.params.id;
            const body = ctx.request.body;
            console.log(body);
            let result = await model.updateBook(body, id);
            if (result) {
                ctx.status = 200;
                ctx.body = {ID: id};
            }
            else {
                ctx.status = 401;
                ctx.body = {message: "Book not found"}
            }
        }
        else {
            ctx.status = 402;
            ctx.body = {message: "Only admins can update book information"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function deleteBook(ctx) {
    try 
    {
        if (await checkAccess("admin", ctx) == true) {
            let id = ctx.params.id;
            const result = await model.deleteBook(id);
            if (result.affectedRows) {
                ctx.body = {bookDeleted: id}
            }
        }
        else {
            ctx.status = 402;
            ctx.body = {message: "Only admins can delete books"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function addCart(ctx) {
    try {
        const userid = ctx.state.user.ID;
        const bookid = parseInt(ctx.params.id);
        const result = await addToCart(userid, bookid);
        console.log(result);
        ctx.status = 200;
        ctx.body = result.affectedRows ? {message: "added to cart"} : {message: "error"};
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function removeCart(ctx) {
    try {
        const userid = ctx.state.user.ID;
        const bookid = parseInt(ctx.params.id);
        const result = await removeFromCart(userid, bookid);
        console.log(result);
        ctx.body = 200;
        ctx.body = result.affectedRows ? {message: "removed from cart"} : {message: "error"};
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

    async function seeCart(ctx) {
    try
    {
        const userid = ctx.state.user.ID;
        const result = await getCart(userid);
        if(result.length){
            const books = [];
            for(i = 0; i < result.length; i++) {
                books.push(await model.getById(result[i].bookID));
            }
            ctx.status = 200;
            ctx.body = books;
        } else{
            ctx.status = 200;
            ctx.body = {message: "Cart is empty"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function checkIfInCart(ctx) {
    try {
        const userid = ctx.state.user.ID;
        const bookid = parseInt(ctx.params.id);
        const result = await checkCart(userid, bookid);        
        ctx.status = 200;
        ctx.body = {
            inList: result ? result : false
        };
    } catch (error) {
        console.error("Error in checkIfInCart:", error);
        ctx.status = 500;
        ctx.body = { error: error };
    }
}

async function addWishlist(ctx) {
    try{
        console.log("addwishlist")
        const userid = ctx.state.user.ID;
        const bookid = parseInt(ctx.params.id);
        const result = await addToWishlist(userid, bookid);
        console.log(result);
        ctx.status = 200;
        ctx.body = result.affectedRows ? {message: "added to wishlist"} : {message: "error"};
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function removeWishlist(ctx) {
    try 
    {
        console.log("addwishlist")
        const userid = ctx.state.user.ID;
        const bookid = parseInt(ctx.params.id);
        const result = await removeFromWishlist(userid, bookid);
        console.log(result);
        ctx.status = 200;
        ctx.body = result.affectedRows ? {message: "removed from wishlist"} : {message: "error"};
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function seeWishlist(ctx) {
    try 
    {
        const userid = ctx.state.user.ID;
        const result = await getWishlist(userid);
        if(result.length){
            const books = [];
            for(i = 0; i < result.length; i++) {
                books.push(await model.getById(result[i].bookID));
            }
            ctx.status = 200;
            ctx.body = books;
        } else{
            ctx.status = 200;
            ctx.body = {message: "Wishlist is empty"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function checkIfInWishlist(ctx) {
    try {
        const userid = ctx.state.user.ID;
        const bookid = parseInt(ctx.params.id);
        const result = await checkWishlist(userid, bookid);        
        ctx.status = 200;
        ctx.body = {
            inList: result ? result : false
        };
    } catch (error) {
        console.error("Error in checkIfInWishlist:", error);
        ctx.status = 500;
        ctx.body = { error: error };
    }
}

module.exports = router
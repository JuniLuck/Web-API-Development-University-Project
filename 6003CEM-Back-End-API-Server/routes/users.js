const Router = require("koa-router");
const model = require("../models/users");
const bodyParser = require("koa-bodyparser");
const {validateUser} = require("../controllers/user_validation");
const jwtAuth = require("../strategies/jwt")
const userPerms = require("../permissions/jwt_roles");

const router = Router({prefix: "/api/v1/users"});

router.get("/", jwtAuth.jwtAuthentication, getAllUsers);
router.post("/", bodyParser(), validateUser, createUser);
router.get('/:id([0-9]{1,})', jwtAuth.jwtAuthentication, getById);
router.put('/:id([0-9]{1,})', jwtAuth.jwtAuthentication, bodyParser(), updateUser);  
router.del('/:id([0-9]{1,})', jwtAuth.jwtAuthentication, deleteUser);  

async function getAllUsers(ctx) {
    try{
        if (await userPerms.checkAccess("admin", ctx) == true) {
            console.log("getAllUsers started");
            let userList = await model.getAllUsers();
            console.log(userList);
            ctx.status = 200;
            ctx.body = userList;
        }
        else {
            ctx.status = 401;
            ctx.body = {message: "You lack the access level required to view all user accounts"};
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
        if (await userPerms.checkAccess("admin", ctx) == true || id == ctx.state.user.ID) {
            let user = await model.getUserById(id);
            if (user.length) {
                ctx.status = 200;
                ctx.body = user[0];
            }
            else{
                ctx.status = 401;
                ctx.body = {message: "User not found"}
            }
        }
        else {
            ctx.status = 402;
            ctx.body = {message: "Only admins can access other people's accounts"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function createUser(ctx) {
    try{
        const body = ctx.request.body;
        let result = await model.addUser(body);
        if (result) {
            ctx.status = 200;
            ctx.body = {ID: result.insertId}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function updateUser(ctx) {
    console.log("update user")
    try
    {
        const id = ctx.params.id;
        if (await userPerms.checkAccess("admin", ctx) == true || id == ctx.state.user.ID) {
            const body = ctx.request.body;
            let result = await model.updateUser(body, id);
            if (result) {
                ctx.status = 200
                ctx.body = {ID: id};
            }
            else {
                ctx.status = 401
                ctx.body = {message: "User not found"}
            }
        }
        else {
            ctx.status = 402;
            ctx.body = {message: "Only admins can edit other people's accounts"}
        }
    }
    catch(error) {
        console.error("Error: ", error)
        ctx.body.status = 500;
        ctx.body = {error: error};
    }
}

async function deleteUser(ctx) {
    try {
        let id = ctx.params.id;
        if (await userPerms.checkAccess("admin", ctx) == true || id == ctx.state.user.ID) {
            const result = await model.deleteUser(id);
            if (result.affectedRows) {
                ctx.status = 200;
                ctx.body = {userDeleted: id}
            }
            else {
                ctx.status = 401;
                ctx.body = {message: "user not found"}
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

module.exports = router
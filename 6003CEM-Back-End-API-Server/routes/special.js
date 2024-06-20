const Router = require("koa-router");
const bodyParser = require("koa-bodyparser");
const basicAuth = require("../strategies/basic");
const jwtAuth = require("../strategies/jwt")

const prefix = "/api/v1";
const router = Router({prefix: prefix});
router.get("/", publicAPI);
router.get("/login", basicAuth.basicStrategy, userLogged);

function publicAPI(ctx) {
  ctx.body = {
    message: "PUBLIC PAGE"
  }
}

function userLogged(ctx) {
  try 
  {
    const user = ctx.state.user;
    const token = jwtAuth.generateToken(user);
    const link = { self:  `${ctx.protocol}://${ctx.host}${prefix}/users/${user.ID}` }
    ctx.status = 200;
    ctx.body = {
      token: token,
      ID: user.ID ,
      username: user.username,
      email: user.email,
      avatar: user.avatarURL,
      links: link
    }
  }
  catch(error) {
      console.error("Error: ", error)
      ctx.body.status = 500;
      ctx.body = {error: error};
  }
}


module.exports = router;

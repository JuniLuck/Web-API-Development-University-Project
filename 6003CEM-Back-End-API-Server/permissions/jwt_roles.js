const jwt = require('jsonwebtoken');

async function checkAccess(accessRequired, ctx) {
    let token = ctx.headers.authorization;
    if(!token) {
        console.log("No token")
        ctx.body = { error: "No token" };
        return false;
    }
    try {
        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token.split(" ")[1], "A3ACB164C22AE94FEE4334CB28D0B0CF", (err, decoded) => {
                if (err) reject(err);
                resolve(decoded);
            });
        });

        if (decoded.access == accessRequired) {
            console.log(`${accessRequired} access granted to ${decoded.username}`);
            return true;
        } else {
            console.log("Unauthorized access")
            ctx.body = { error: `Unauthorized access: ${accessRequired} required` };
            return false;
        }
    } catch (error) {
        console.log("Token invalid");
        ctx.body = { error: "Token invalid" }
        return false;
    }
}

module.exports = {checkAccess};
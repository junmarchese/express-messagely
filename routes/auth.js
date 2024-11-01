const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_KEY, BCRYPT_WORK_FACTOR } = require("../config");
const User = require("../models/user");
const ExpressError = require("../expressError");
const router = new express.Router();


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const isAuthenticated = await User.authenticate(username, password);
        if (isAuthenticated) {
            const token = jwt.sign({ username }, SECRET_KEY);
            await User.updateLoginTimestamp(username);
            return res.json({ token });
        } else {
            const err = new ExpressError("Invalid username or password", 400);
            return next(err);
        }
    } catch (err) {
        return next(err);
    }
});

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post("/register", async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const user = await User.register({
            username,
            password: hashedPassword,
            first_name,
            last_name,
            phone
        });
        const token = jwt.sign({ username: user.username }, SECRET_KEY);
        await User.updateLoginTimestamp(username);
        return res.json({ token });
    } catch(err) {
        return next(err);
    }
});


module.exports = router;

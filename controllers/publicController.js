const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');
const db = require('../models/index');
const User = db.users;

exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        password = await bcryptjs.hash(password, 10);
        const user = new User({ username, email, password });
        await user.save();
        const token = await jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: process.env.TEMP_EXP })
        sendEmail({ email: user.email, subject: "email verification", message: `Here is your token: ${token}` });
        res.status(201).json({ message: "User created!" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ err: err || `Something went wrong pls contact admin` });
    }
}

exports.verify = async (req, res) => {
    try {
        const { token } = req.body;
        let obj = await jwt.verify(token, process.env.SECRET);
        await User.update({ verified: true }, { where: { id: obj.id } });
        res.status(200).json({ message: "User Verified" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err || "Something went wrong" })
    }
}
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ where: { email: email } });
        if (user === null) {
            res.status(400).json({ message: "Invalid credential" });
        }
        else {
            let valid = await bcryptjs.compare(password, user.password)
            if (valid) {
                let token = await jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1d' });
                res.status(200).json({ message: "Login Successfully", token: token });
            } else {
                res.status(400).json({ message: "not valid" });
            }
        }
        await User.update({ verified: true }, { where: { id: obj.id } });
        res.status(200).json({ message: "User Verified" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err || "Something went wrong" })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { email: email } })
        if (user) {
            const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: process.env.TEMP_EXP })
            sendEmail({ email: user.email, subject: "forgot password", message: `Here is your token ${token}` })
            res.status(200).json({ message: "Email sent" });
        }
        else {
            res.status(400).json({ err: "EmailId not eixsts" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err || "Something went wrong" })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        let obj = await jwt.verify(token, process.env.SECRET);
        let user = await User.findOne({ where: { id: obj.id } });
        if (!user) {
            res.status(400).json({ message: "User not exists" })
        } else {
            let newpassword = await bcryptjs.hash(password,10)
            await User.update({password:newpassword},{where:{id:user.id}})
            res.status(200).json({ message: "Password updated!" })
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err || "Something went wrong" })
    }
}

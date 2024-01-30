require('dotenv').config();

const express = require("express")
const cors = require("cors")
const nodemailer = require('nodemailer')
const app = express()
const PORT = process.env.PORT || 4000;

app.use(
    cors({
        origin: ['http://localhost:3000', 'https://coderhassan.vercel.app'],
        credentials: true,
    })
);

app.use(express.json())


app.get('/', (req, res) => {
    res.send('ok')
})

app.post('/mail', async (req, res) => {

    let { name, email, subject, message } = req.body

    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: parseInt(process.env.SMPT_PORT || '587'),
        service: process.env.SMPT_SERVICES,
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
        },
        secure: true
    });

    await new Promise((resolve, reject) => {
        transporter.verify(function (error, success) {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Server is ready to take our messages");
                resolve(success);
            }
        });
    });

    const mailOptions = {
        from: email,
        to: process.env.SMPT_MAIL,
        subject: subject,
        html: `
        <h1>${name}</h1>
        <p>${message}</p>
        `
    };

    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });
    

    res.status(200).send('mail send')

})

app.listen(PORT, () => {
    console.log('server run successfully');
})
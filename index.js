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

app.post('/mail', (req, res) => {

    const sendMail = async (data) => {

        let { name, email, subject, message } = data

        const transporter = nodemailer.createTransport({
            host: process.env.SMPT_HOST,
            port: parseInt(process.env.SMPT_PORT || '587'),
            service: process.env.SMPT_SERVICES,
            auth: {
                user: process.env.SMPT_MAIL,
                pass: process.env.SMPT_PASSWORD
            },
        });

        const mailOptions = {
            from: process.env.SMPT_MAIL,
            to: email,
            subject: subject,
            html: `
            <h1>${name}</h1>
            <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions)
    }

    sendMail(req.body)

    res.send('mail send')

})

app.listen(PORT, () => {
    console.log('server run successfully');
})
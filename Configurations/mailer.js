// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'tasnimjalshair2002@gmail.com', // بريدك الإلكتروني
//         pass: 'mzlwqwdemddsznze'
//     }
// });

// const sendEmail = (to, subject, text) => {

//     if (!to || !subject || !text) {
//         console.error('Missing email parameters');}

//     const mailOptions = {
//         from: 'totaj.sh@gmail.com',
//         to: to,
//         subject: subject,
//         text: text
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.log('Error occurred:', error);
//         } else {
//             console.log('Email sent: ' + info.response);
//         }
//     });
// };

// module.exports = sendEmail;

const mailer = require('nodemailer');
const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAILPASS
    }
})
const sendEmail = (to, subject, text) => {
    if (!to || !subject || !text) {
        console.error('Missing email parameters');
        return;
    }

    const mailOptions = {
        from: 'process.env.EMAIL',
        to: to,
        subject: subject,
        text: text
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error);
        } else {
            console.error('Email sent: ' + info.response);
        }
    }
)
}
module.exports = sendEmail;
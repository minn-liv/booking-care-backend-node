require("dotenv").config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });
    let emailHTML = getBodyHTMLEmail(dataSend);
    // async..await is not allowed in global scope, must use a wrapper
    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Min Min 👻" <min4510471@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: emailHTML, // html body
    });
};

let getBodyHTMLEmail = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email vì đã đặt lịch khám bệnh trên Booking Care</p>
        <p>Thông tin đặt lịch khám bệnh:</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu các thông tin trên là đúng, vui lòng click vào đường link bên dưới để hoàn tất xác nhận đặt lịch khám bệnh.</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Xin chân thành cảm ơn</div>
        `;
    }
    if (dataSend.language === "en") {
        result = `<h3>Dear ${dataSend.patientName}!</h3>
        <p>You receive an Email because you have booked a medical appointment on Booking Care</p>
        <p>Information on scheduling medical examinations:</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is correct, please click on the link below to complete the confirmation of medical examination appointment.</p>
        <div>
            <a href=${dataSend.redirectLink} target="_blank">Click here</a>
        </div>
        <div>Thank you</div>
        `;
    }
    return result;
};

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });
            let emailHTML = getBodyHTMLEmailRemedy(dataSend);
            let info = await transporter.sendMail({
                from: '"Min Min 👻" <min4510471@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả đặt lịch khám bệnh",
                html: emailHTML,
                attachments: [
                    {
                        filename: `remedy-${
                            dataSend.patientId
                        }-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: "base64",
                    },
                ],
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = "";
    if (dataSend.language === "vi") {
        result = `<h3>Xin chào ${dataSend.patientName}!</h3>
        <p>Bạn nhận được Email vì đã đặt lịch khám bệnh trên Booking Care thành công</p>
        <p>Thông tin đơn thuốc/ hóa đơn được gửi trong file đính kèm:</p>
       
        <div>Xin chân thành cảm ơn</div>
        `;
    }
    if (dataSend.language === "en") {
        result = `<h3>Dear ${dataSend.patientName}!</h3>
        <p>You receive an Email because you have booked a medical appointment on Booking Care</p>
        <p>Information on scheduling medical examinations:</p>
       
        <div>Thank you</div>
        `;
    }
    return result;
};
module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
};

const sendGridAPIKey ='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'
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (eamil,name)=>{
    sgMail.send({
        to:eamil,
        from:'f20201976@pilani.bits-pilani.ac.in',
        subject:'Welcome to Task Manager',
        text:`Welcome to the app, ${name}. Start creating tasks now.`
    })
}

const sendCancelEmail = (eamil,name)=>{
    sgMail.send({
        to:eamil,
        from:'f20201976@pilani.bits-pilani.ac.in',
        subject:'Sorry to see you go!',
        text:`Goodbye ${name}, it would be great if you could provide review.`
    })
}

module.exports={
    sendWelcomeEmail,
    sendCancelEmail
}
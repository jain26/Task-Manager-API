const sgmail=require('@sendgrid/mail')
sgmail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email,name) => {
    sgmail.send({
        to:email,
        from:'ayush.j26@gmail.com',
        Subject:'Welcome',
        text:'Welcome to task manager API '+name+',Please give feedback.'
    })
}
const sendCancelationEmail=(email,name)=>{
    sgmail.send({
        to:email,
        from:'ayush.j26@gmail.com',
        Subject:'GoodBye',
        text:'Hope to see you again'+name+',Have a nice day.'
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}

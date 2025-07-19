// const cron = require('node-cron');
// const {Task} = require('../Models');  // استيراد الـ Model الخاص بالمهام
// const sendEmail = require('./mailer');  // استيراد دالة إرسال البريد الإلكتروني
// const dbConnection = require('./dbConnection'); // للإتصال بقاعدة البيانات

// cron.schedule('56 20 * * *', async () => {
//     try {
//         console.log('Running cron job to check tasks for the next day.');

//         const usersCollection = await dbConnection('users');
//         const users = await usersCollection.find({}).toArray(); 

//         for (let user of users) {
//             const userId = user._id.toString();  

//             const result = await Task.getendOfNextDay(userId); 
//             const tasks = result.data? result.data : [];

//             tasks.forEach(task => {
             
//                 const emailText = `Dear ${user.userName},\n\nYour task "${task.title}" is due tomorrow. Please complete it on time!`;
//                 sendEmail(user.email, 'Task Due Tomorrow', emailText); 
//             });
//         }

//     } catch (error) {
//         console.error('Error in cron job:', error);
//     }
// });
const cron = require('node-cron');
const dbConnection = require('./dbConnection'); // للإتصال بقاعدة البيانات
const {Task}=require('../Models');
const sendEmail = require('./mailer'); // استيراد دالة إرسال البريد الإلكتروني
cron.schedule('* 10 * * *', async () => {
    console.log('Cron job is running every minute');
    try{
        const usersCollection= await dbConnection('users');
        const users = await usersCollection.find({}).toArray();
        for(let user of users){
          const userId = user._id.toString(); 
          const result = await Task.getendOfNextDay(userId); // استدعاء الدالة للحصول على المهام التي تنتهي في اليوم التالي
          const tasks = result.data ? result.data : [];
          tasks.forEach(task => {
              const emailText = `Dear ${user.userName},\n\nYour task "${task.title}" is due tomorrow. Please complete it on time!`;
              sendEmail(user.email, 'Task Due Tomorrow', emailText); // إرسال البريد الإلكتروني
          });
        }
    }catch (error) {
        console.error('Error in cron job:', error);
    }

})
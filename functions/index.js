//SECTION1:ADMIN SECTION THIS IS COMMAN FOR ALL THE FIREBASE  CODES


const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


// SECION2:TRIGGERING SECTION THIS WILL WATCHING YOUR DATABASE DAY AND NIGHT


exports.Triger = functions.firestore.document("/discussion/{documents}").onCreate((creation, context) => {

    const newDoc = creation.data();

    const receiver = newDoc.destinataireUid;
    const sender = newDoc.expediteurUid;
    const messageis = newDoc.content;
    const type = newDoc.type;


    //SECTION3:GETING THE FCM CODE OF RECEIVER 

    const toUser = admin.firestore().collection("comptes").where('pseudo', '==', receiver).get();


    return Promise.all([toUser]).then(async result => { // as it is in array you can perfom more promisses now just leavae it as it is

        const tokenId = result[0].token; //we are geting the his fcm tokenId


        /////// SECTION4: PREPARING A NOTIFICATION

        var notificationContent;

        switch (type) {
            case "text":
                notificationContent = {
                    notification: {
                        icon: "default",
                        title: sender, //we use the sender name to show in notification
                        body: messageis, //we use the receiver's name and message to show in notifcation
                        icon: "default", //you can change the icon on the app side too
                        sound: "default" //also you can change the sound in app side
                    }
                };
                break;

            case "image":
                notificationContent = {
                    notification: {
                        icon: "default",
                        title: sender, //we use the sender name to show in notification
                        body: "Photo", //we use the receiver's name and message to show in notifcation
                        icon: "default", //you can change the icon on the app side too
                        sound: "default" //also you can change the sound in app side
                    }
                };
                break;

            default:
                notificationContent = {
                    notification: {
                        icon: "default",
                        title: sender, //we use the sender name to show in notification
                        body: "unknown", //we use the receiver's name and message to show in notifcation
                        icon: "default", //you can change the icon on the app side too
                        sound: "default" //also you can change the sound in app side
                    }
                };
                break;
        }



        ///SECTION 5 SENDING  NOTIFICATIONS 


        return admin.messaging().sendToDevice(
            "cVYYWJjwpDU:APA91bHOQMVqQheRPo3vyJU3bIzH04iZ9xWyU4nIxSUg4XqOLUJZmZDLZEhVbAu-M5YReyiCd3xHs5o1TmALHepaFitUNZdOm2h3HF_fEaZPALhS7pRtaruNzDPQOsi63gOCLEGvREId", //here we use the receiver's fcm token id to send notifcations
            notificationContent //this is the notication content which is on the line 46 to 52
        ).
        then(result => {
            console.log("Notification sent!");
            //admin.firestore().collection("notifications").doc(userEmail).collection("userNotifications").doc(notificationId).delete();
        });
    });

});
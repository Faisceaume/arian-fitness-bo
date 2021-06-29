const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();


const os = require('os');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const fs = require('fs');


import { Storage } from '@google-cloud/storage';
const uuid = require('uuid');
const storage = new Storage({
    projectId: 'arian-fitness',
    keyFilename: path.join(__dirname, 'keyfilename.json')
});






function getSingleExercice(id: string) {
    return new Promise<any>((resolve, reject) => {
      const museums = db.collection('exercices').where('id', '==', id);
      museums.get().then((querySnapshot: any) =>  {
        querySnapshot.forEach((doc:any) => {
          resolve(
            {id: doc.id,
              ...doc.data()}
            );
        });
      });
    });
}

function updateSubCollectionExerciceOnSerieFixe(exercice: any) {
    getSingleExercice(exercice.id).then((currentExercice: any) => {
      if (currentExercice.seriefixeid) {
        currentExercice.seriefixeid.forEach((element:any) => {
          const nextDocument1 = db.collection('seriesfixes')
                            .doc(element).collection('exercices').doc(currentExercice.id);
          const batch = db.batch();
          batch.update(nextDocument1, currentExercice);
          batch.commit().then(() => {
              //console.log('Denormalization success')
          }).catch((error: Error) => { console.error('Error updating document: ', error.message); });
        });
      }
    }).catch((err: Error) => console.log('Erreur......getSingleExercice'));
}


function newUpdateVersion(element: any, attribut: string, value: any) {
    const batch = db.batch();
    const nextDocument1 = db.collection('exercices').doc(element.id);
    batch.update(nextDocument1, `${attribut}`, value);
    batch.commit().then(() => {
      updateSubCollectionExerciceOnSerieFixe(element);
    }).catch((error: Error) => { console.error('Error updating document: ', error.message); });
}







// exports.generateThumbnailsByUploading = functions.storage.object().onFinalize(async (object: any) => {
//     //const object = event.data;
//     const fileBucket = object.bucket;
//     const filePath = object.name;
//     const contentType = object.contentType;

//     if (!contentType.startsWith("image/")) {
//         //console.log('This is not an image.');
//         return;
//     }


//     if(path.basename(filePath).startsWith("thumb_")) {
//         //console.log('Already Existing...');
//         return;
//     }
//     if (!filePath.startsWith("medias/exercices/images/")) {
//         //console.log('Image not uploaded in medias/exercices/images/');
//         return;
//     }
//     const destinationBucket = admin.storage().bucket(fileBucket);
//     const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
//     const metadata = {contentType: contentType};

//     await destinationBucket.file(filePath).download({
//         destination: tempFilePath
//     });

//     await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);

//     await destinationBucket.upload(tempFilePath, {
//         destination: path.join(path.dirname(filePath), 'thumb_' + path.basename(filePath)),
//         metadata: metadata
//     });

//     const [url] = await destinationBucket.file( path.join(path.dirname(filePath), 'thumb_' + path.basename(filePath)) ).getSignedUrl({
//         version: 'v2',
//         action: 'read',
//         expires: '03-09-2025'
//     });


//     //const batch = db.batch();
//     const id = path.parse(path.basename(filePath)).name as string;
//     const ref = db.doc(`exercices/${id}`);
//     const exoDoc = await ref.get();
//     const exercice = exoDoc.exists ? exoDoc.data() : null;
//     newUpdateVersion(exercice, 'photoThumbnail', url);


//     // console.log(url, id);
//     // batch.update(ref, {photoThumbnail: url });
//     // batch.commit().then().catch((error: any) => console.log(error));

//     //Delete the local file to free up disk space
//     fs.unlinkSync(tempFilePath);
//     return true;
// });


exports.generateThumbnailAuto = functions.firestore.document('exercices/{exoId}').onUpdate(async (change: any, context: any) => {
    const exoId = context.params.exoId;
    const newValue = change.after.data().photoThumbnail;
    if(newValue === 'pending...') {
        const filePath = `medias/exercices/images/${exoId}.jpg`;
        const contentType = 'image/jpeg';
        const bucket = storage.bucket('arian-fitness.appspot.com');

        if (!filePath.startsWith("medias/exercices/images/")) {
            return;
        }
        //const destinationBucket = admin.storage().bucket(fileBucket);
        const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
        const metadata = {
            contentType: contentType,
            metadata: {
            firebaseStorageDownloadTokens: uuid.v4()
        }};

        await bucket.file(filePath).download({
            destination: tempFilePath
        });

        await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);

        const linkToFile = path.join(path.dirname(filePath), '000_thumbnails' , 'thumb_' + path.basename(filePath));

        const data = await bucket.upload(tempFilePath, {
            destination: linkToFile,
            metadata: metadata
        });

        const file = data[0];
        const url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid.v4();


        const id = exoId;
        const ref = db.doc(`exercices/${id}`);
        const exoDoc = await ref.get();
        const exercice = exoDoc.exists ? exoDoc.data() : null;
        newUpdateVersion(exercice, 'photoThumbnail', url);

        fs.unlinkSync(tempFilePath);
        return true;
    } else return false;
});


exports.regenerateThumbnails = functions.runWith({timeoutSeconds: 540}).firestore.document('exercices/{exoId}').onCreate(async (change: any, context: any) => {
    let exercices = [];
    if(context.params.exoId === 'trigger') {
        const snapshot = await db.collection('exercices').get()
        exercices = snapshot.docs.map((doc: any) => {if (doc.data().id && doc.data().photo && (doc.data().photoThumbnail === null || !doc.data().photoThumbnail)) return doc.data().id});
        exercices = exercices.filter((element:any) => element !== undefined);
        for(let i = 0; i < exercices.length; i++) {
                const exoId  = exercices[i];
                const filePath = `medias/exercices/images/${exoId}.jpg`;
                const contentType = 'image/jpeg';
                const bucket = storage.bucket('arian-fitness.appspot.com');
    
    
                if (!filePath.startsWith("medias/exercices/images/")) {
                    //console.log('Image not uploaded in medias/exercices/images/');
                    return;
                }
                //const destinationBucket = admin.storage().bucket(fileBucket);
                const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
                const metadata = {
                  contentType: contentType,
                  metadata: {
                  firebaseStorageDownloadTokens: uuid.v4()
                }};
    
                await bucket.file(filePath).download({
                    destination: tempFilePath
                });
    
                await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);

                const linkToFile = path.join(path.dirname(filePath) ,'000_thumbnails' , 'thumb_' + path.basename(filePath));
    
                const data = await bucket.upload(tempFilePath, {
                    destination: linkToFile,
                    metadata: metadata
                });
    
                const file = data[0];
                const url = "https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuid.v4();
    
    
                //const idE = exoId;
                const ref = db.doc(`exercices/${exoId}`);
                const exoDoc = await ref.get();
                const exercice = exoDoc.exists ? exoDoc.data() : null;
                newUpdateVersion(exercice, 'photoThumbnail', url);
    
                fs.unlinkSync(tempFilePath);
                
            //} else return false;
        }
        db.collection('exercices').doc('trigger').delete().then(() =>console.log('success delete')).catch((error: Error) => { console.error(error.message)})
        return true;
    } else return false;
    
});


//exports.copyThumbnailsOnLocal = functions.runWith({timeoutSeconds: 540}).


// const bucketName = 'gs://arian-fitness.appspot.com';
// const prefix = ['aliments/', 'medias/'];

// function listFile(prefix$: any) {
//     const { Storage } = require('@google-cloud/storage');
//     const storage = new Storage();
//     let files: any[] = [];
//     return new Promise<any>((resolve, reject) => {
//         storage.bucket(bucketName).getFiles({prefix: prefix$}).then((data: any) => {
//             files = data[0];
//             resolve(files);
//         });     
//     }); 
// }

// function copyFiles() {
//     const { Storage } = require('@google-cloud/storage');
//     const storage = new Storage();
//     return new Promise<any>((resolve, reject) => {
//         prefix.forEach(element => {
//             listFile(element).then((files) => {
//                 files.forEach((file: any) => {
//                     const today = new Date();
//                     const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//                     storage.bucket(bucketName)
//                            .file(file.name)
//                            .copy(storage.bucket(bucketName).file('backup/' + date + '/' + file.name));
//                   });
//                 resolve();
//             }).catch(() => console.log('Erreur'));
//         });
        
//     });
    
// }
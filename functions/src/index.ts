const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const os = require('os');
const db = admin.firestore();
const storage = admin.storage();

const spawn = require('child-process-promise').spawn;
const path = require('path');
const fs = require('fs');


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
              console.log('Denormalization success')
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







exports.generateThumbnailsByUploading = functions.storage.object().onFinalize(async (object: any) => {
    //const object = event.data;
    const fileBucket = object.bucket;
    const filePath = object.name;
    const contentType = object.contentType;

    if (!contentType.startsWith("image/")) {
        console.log('This is not an image.');
        return;
    }


    if(path.basename(filePath).startsWith("thumb_")) {
        console.log('Already Existing...');
        return;
    }
    if (!filePath.startsWith("medias/exercices/images/")) {
        console.log('Image not uploaded in medias/exercices/images/');
        return;
    }
    const destinationBucket = admin.storage().bucket(fileBucket);
    const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
    const metadata = {contentType: contentType};

    await destinationBucket.file(filePath).download({
        destination: tempFilePath
    });

    await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);

    await destinationBucket.upload(tempFilePath, {
        destination: path.join(path.dirname(filePath), 'thumb_' + path.basename(filePath)),
        metadata: metadata
    });

    const [url] = await destinationBucket.file( path.join(path.dirname(filePath), 'thumb_' + path.basename(filePath)) ).getSignedUrl({
        version: 'v2',
        action: 'read',
        expires: '03-09-2025'
    });


    //const batch = db.batch();
    const id = path.parse(path.basename(filePath)).name as string;
    const ref = db.doc(`exercices/${id}`);
    const exoDoc = await ref.get();
    const exercice = exoDoc.exists ? exoDoc.data() : null;
    newUpdateVersion(exercice, 'photoThumbnail', url);


    // console.log(url, id);
    // batch.update(ref, {photoThumbnail: url });
    // batch.commit().then().catch((error: any) => console.log(error));

    //Delete the local file to free up disk space
    fs.unlinkSync(tempFilePath);
    return true;
});


exports.generateThumbnailAuto = functions.firestore.document('exercices/{exoId}').onUpdate(async (change: any, context: any) => {
    const exoId = context.params.exoId;
    const newValue = change.after.data().photoThumbnail;
    if(newValue === 'pending...') {
        const fileBucket = 'gs://arian-fitness.appspot.com';
        const filePath = `medias/exercices/images/${exoId}.jpg`;
        const contentType = 'image/jpeg';


        if (!filePath.startsWith("medias/exercices/images/")) {
            console.log('Image not uploaded in medias/exercices/images/');
            return;
        }
        const destinationBucket = admin.storage().bucket(fileBucket);
        const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));
        const metadata = {contentType: contentType};

        await destinationBucket.file(filePath).download({
            destination: tempFilePath
        });

        await spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);

        await destinationBucket.upload(tempFilePath, {
            destination: path.join(path.dirname(filePath), 'thumb_' + path.basename(filePath)),
            metadata: metadata
        });

        const [url] = await destinationBucket.file( path.join(path.dirname(filePath), 'thumb_' + path.basename(filePath)) ).getSignedUrl({
            version: 'v2',
            action: 'read',
            expires: '03-09-2025'
        });


        const id = exoId;
        const ref = db.doc(`exercices/${id}`);
        const exoDoc = await ref.get();
        const exercice = exoDoc.exists ? exoDoc.data() : null;
        newUpdateVersion(exercice, 'photoThumbnail', url);

        fs.unlinkSync(tempFilePath);
        return true;
    } else return false;
});

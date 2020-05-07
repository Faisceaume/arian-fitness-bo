const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const stripe = require('stripe')(functions.config().stripe.testkey);

exports.StripeCharge = functions.firestore.document('payments/{paymentId}').onCreate((snap: any, context: any) => {
    const dataPayment = snap.data();
    if( !dataPayment || dataPayment.charge) return;

    const paymentId = context.params.paymentId;
    const userkey = dataPayment.userkey;
    const amount = dataPayment.amount;
    const idempotencyKey = paymentId;
    const source = dataPayment.token.id;
    const currency = 'eur';
    const charge = {amount, currency, source};
    return stripe.charges.create(charge, { idempotencyKey }).then((charg: any) => {
        db.doc(`payments/${paymentId}`).update({
            charge: charg
        });
        db.doc(`users/${userkey}`).update({
        });

    }).catch((error: any) => console.log(error));
});







































































































/*
const bucketName = 'gs://arian-fitness.appspot.com';
const prefix = ['aliments/', 'medias/'];

function listFile(prefix$: any) {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    let files: any[] = [];
    return new Promise<any>((resolve, reject) => {
        storage.bucket(bucketName).getFiles({prefix: prefix$}).then((data: any) => {
            files = data[0];
            resolve(files);
        });     
    }); 
}

function copyFiles() {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    return new Promise<any>((resolve, reject) => {
        prefix.forEach(element => {
            listFile(element).then((files) => {
                files.forEach((file: any) => {
                    const today = new Date();
                    const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                    storage.bucket(bucketName)
                           .file(file.name)
                           .copy(storage.bucket(bucketName).file('backup/' + date + '/' + file.name));
                  });
                resolve();
            }).catch(() => console.log('Erreur'));
        });
        
    });
    
}

exports.scheduledExportStorageDev = functions.runWith({memory: '1GB', timeoutSeconds: 300}).pubsub.schedule('every 168 hours').onRun((context:any) => {
    return copyFiles().then(() => console.log('Copié avec succès')).catch(() => {
        console.log('Erreur lors de la sauvegarde');
    });
});


/*const firestore = require('@google-cloud/firestore');
const client = new firestore.v1.FirestoreAdminClient();
const bucket = 'gs://arian-fitness.appspot.com';

exports.scheduledExport = functions.pubsub.schedule('every 168 hours').onRun((context: any) => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');

    return client.exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: []
    }).then((responses: any) => {
        const response = responses[0];
        console.log(`Operation Name : ${response['name']}`);
        return response;
    }).catch((err: any) => {
        console.log( err );
        throw new Error('Export operation failed')
    });
 });


 /*
gcloud projects add-iam-policy-binding arian-fitness \
    --member serviceAccount:arian-fitness@appspot.gserviceaccount.com \
    --role roles/datastore.importExportAdmin

gsutil iam ch serviceAccount:arian-fitness@appspot.gserviceaccount.com:admin \
    gs://arian-fitness.appspot.com
 */
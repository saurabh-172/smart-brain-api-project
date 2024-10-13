import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

export const handleImage = (req,res, db) =>{
    const {id} = req.body;
    db('users').where('id','=',id)
    .increment('entries',1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0].entries)
    })
    .catch(err=> res.status(400).json('unable to get entries'))
    return;
}


// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = '6e1b7081ba644da99df127824b6d9f94';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = '2sc6m6lso1t2';
const APP_ID = 'my-first-application-kk33d';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';




const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

export const handleApiCall =(req,res)=>{
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            model_id: MODEL_ID,
            version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                console.log(err);
                return;
            }

            if (response.status.code !== 10000) {
                console.log("Post model outputs failed, status: " + response.status.description);
                return;
            }

            // Since we have one input, one output will exist here
            const output = response.outputs[0];

            console.log("Predicted concepts:");
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
            }
            res.json(response)
        }

    );
}
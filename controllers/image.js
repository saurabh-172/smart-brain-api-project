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
const PAT = process.env.API_PAT;
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = process.env.API_USER_ID;
const APP_ID = process.env.API_APP_ID;
// Change these to whatever model and image URL you want to use
const MODEL_ID = process.env.API_MODEL_ID;
const MODEL_VERSION_ID = process.env.API_MODEL_VERSION_ID;
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';




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
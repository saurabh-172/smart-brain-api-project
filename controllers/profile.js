export const handleProfileUpdate = (req,res,db) =>{
    const {email, username, avatar, id } = req.body;
    db('users').where('id','=',id)
    .update({
        email: email,
        username: username,
        avatar: avatar
    })
    .returning('*')
    .then(user =>{
        if(user[0].id){
            res.json(user[0])
        }else{
            res.status(400).json('unable to update')
        }
    })
    .catch(err=> res.status(400).json('unable to get update'))
}
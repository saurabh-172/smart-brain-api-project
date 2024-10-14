export const handleProfileUpdate = (req,res,db) =>{
    const {email, username, avatar, id } = req.body;
    db.transactions(trx => {
        trx('login')
        .where('id',id)
        .update({ email })
        .then(()=>{
            return trx('users')
            .where('id',id)
            .update({ email, username, avatar })
            .returning('*')
        }).then(user=>{
            if(user[0].id){
                return res.json(user[0])
            }else{
                res.status(400).json('unable to update')
            }
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    //     ('users').where('id','=',id)
    // .update({
    //     email: email,
    //     username: username,
    //     avatar: avatar
    // })
    // .returning('*')
    // .then(user =>{
    //     if(user[0].id){
    //         res.json(user[0])
    //     }else{
    //         res.status(400).json('unable to update')
    //     }
    // })
    // .catch(err=> res.status(400).json('unable to get update'))
}
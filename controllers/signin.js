

const handleSignin = (req, res, db, bcrypt) =>{
    const {email, password} = req.body
    if(!email || !password) {
        return res.status(400).json("incorrect form submission");
    }
    db.select("email", "password").from("login")
    .where("email", "=", email)
    .then(async data =>{
        
         const isValid = await bcrypt.compare(password, data[0].password);
         if(isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => {
            res.json(user[0])
          })
            .catch(err => res.status(400).json("unable to load the user"))
             }
         
         else{
             res.status(400).json("wrong credentials")
         }
    })
    .catch(err => res.status(400).json("wrong credentials"))
}

  module.exports = {
    handleSignin: handleSignin
}

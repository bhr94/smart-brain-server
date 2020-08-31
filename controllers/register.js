

const saltRounds = 10;

const handleRegister = (req, res, db, bcrypt, saltRounds) =>{
    const {password, email, name} = req.body;
    if(!email || !password || !name) {
        return res.status(400).json("incorrect form submission");
    }
    bcrypt.genSalt(saltRounds, function(err, salt) {
       bcrypt.hash(password, salt) 
       .then(hash =>{
        db.transaction(trx =>{
            trx.insert({
                hash:hash,
                email:email
            })
            .into("login")
            .returning("email")
            .then(async loginEmail =>{
                const user = await db("users")
                    .returning("*")
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    });
                res.json(user[0]);
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
       .catch(err =>{
           res.status(400).json("error: this user already exists")
       })
        });         
       })
            // Store hash in your password DB.
            
        }

        module.exports = {
            handleRegister: handleRegister
        }


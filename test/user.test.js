const request=require('supertest')
const User=require('../src/db/models/user')
const app=require("../src/app")
const { userOne,userOneID,preData } = require('./fixtures/db')



beforeEach(preData)

test('should signup a new user',async()=>{
    const response=await request(app).post('/users').send({
        name:'Ayush',
        email:'ayush.jndksndksn26@gmail.com',
        password:'aj@chillout'
    }).expect(201)

    const user=await User.findById(response.body.user._id)
    expect(user).not.toBeNull()


    expect(response.body).toMatchObject({
        user:{
            name:'Ayush',
            email:'ayush.jndksndksn26@gmail.com'
        },
        token: user.tokens[0].token
    })
})
test('should login existing user',async()=>{
    const response=await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)
    const user=await User.findById(userOneID)
    expect(response.body.token).toBe(user.tokens[1].token)
})
test('should not login non-existing user',async()=>{
    await request(app).post('/users/login').send({
        email:userOne.email,
        password:"vhgsygyftgdshy"
    }).expect(400)
})
test('should get profile for user',async()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})
test('should not get profile for unauthentic user',async()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})
test('Should delete authentic user',async()=>{
    await request(app)
        .delete('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user=await User.findById(userOneID)
    expect(user).toBeNull()
})
test('Should not delete un-authentic user',async()=>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})
test('Should add avatar image',async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','./test/fixtures/pic.jpg')
        .expect(200)
    
    const user=await User.findById(userOneID)
    expect(user.avatar).toEqual(expect.any(Buffer))
})
test('Should be able to update',async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            name:"tyagi"
        })
        .expect(200)
    const user=await User.findById(userOneID)
    expect(user.name).toEqual('tyagi')
})
test('Should not be able to update',async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'tyagi'
        })
        .expect(400)
})
const request=require('supertest')
const Task=require('../src/db/models/task')
const app=require("../src/app")
const { userOne,userOneID,preData } = require('./fixtures/db')

beforeEach(preData)

test('Should create Task' ,async()=>{
    await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            Description:"This is test task"
        })
        .expect(201)
})
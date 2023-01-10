/**
 * @description: Redis cache implementation for a excel file parser in node js
 * @author : Pooja Seethur
 */

/**
 * Include node modules
 */

const express = require('express');
const redis = require('redis');
const app = express();
const bodyParser = require('body-parser');
const authorizeToken = require('./middleWare/authorizeToken');
const reroute = require('./reroute');
const REDIS_PORT = 6379;

/**
 * Use middleware
 */

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
/**
 * Create redis client
 */

const client = redis.createClient(REDIS_PORT);

client.on('connect', function() {
    console.log('Connected!');
})

/**
 * 
 */
app.post('/reRoute', (req, res) => {
    console.log(`UserId: ${req.body.userId}, API key: ${req.body.apiKey}, Request body: ${req.body.requestBody}`);
    let reqqType = req.body.apiKey+'reqType';
    client.hget(req.body.userId, req.body.apiKey, (error, apiUrlObj) => {
        if(error){
            res.send("Error in retrieving redis data")
        }
        client.hget(req.body.userId, reqqType, (error, reqTypeObj) => {
            console.log('request type obj '+ reqTypeObj)
            reroute.redirect(req.body.requestBody, reqTypeObj, apiUrlObj, (data) => {
                try{
                    res.send(JSON.stringify(data))
                }catch(error){
                    res.send("Error in retrieving redis data")
                }
            })
        })
    })

});

app.post('/setRedis', (req, res) => {
    console.log(`UserId: ${req.body.userId}, API key: ${req.body.apiKey}, Request body: ${req.body.requestBody}`);
    let reqqType = req.body.apiKey+'reqType';
    console.log(reqqType)
    client.hset(req.body.userId, req.body.apiKey, req.body.endPoint, redis.print);
    client.hset(req.body.userId, reqqType, req.body.reqType, redis.print);
    res.send('Updated in redis DB')

})

app.listen(2000, () => {
    console.log('Server running on 2000')
})
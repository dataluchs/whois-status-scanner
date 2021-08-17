const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/', async (req, res) => {
    
    try {

        const API_KEY = process.env.API_KEY
        const DOMAIN_NAME = process.env.DOMAIN_NAME
        const CREDITS = process.env.CREDITS
        const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT

        const uri = encodeURI(
            `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${API_KEY}&domainName=${DOMAIN_NAME}&credits=${CREDITS}&outputFormat=${OUTPUT_FORMAT}`
        )

        const headers = {
                'Content-Type': 'application/json',
        }
        
        const response = await axios.get(
            uri, 
            headers,
            { withCredentials: true })
        return res.status(200).json(response.data)

    } 
    
    catch (err) {
        console.error(err.message)
        return res.status(400).json({ msg: 'Bad request.' })
    }
})

module.exports = router

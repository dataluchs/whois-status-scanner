const express = require("express");
const axios = require("axios");
const router = express.Router();
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/", async (req, res) => {
  try {
    const API_KEY = process.env.API_KEY;
    const DOMAIN_NAME = process.env.DOMAIN_NAME;
    const CREDITS = process.env.CREDITS;
    const OUTPUT_FORMAT = process.env.OUTPUT_FORMAT;
    const SEND_TO_EMAIL = process.env.SEND_TO_EMAIL;
    const SEND_FROM_EMAIL = process.env.SEND_FROM_EMAIL;

    const uri = encodeURI(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${API_KEY}&domainName=${DOMAIN_NAME}&credits=${CREDITS}&outputFormat=${OUTPUT_FORMAT}`
    );

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await axios.get(uri, headers, { withCredentials: true });

    const whoisResponse = response.data;

    const domainName = whoisResponse.WhoisRecord.domainName;
    const domainStatus = whoisResponse.WhoisRecord.registryData.status;
    let checkFor = "clientHold";

    if (domainStatus.includes(checkFor)) {
      console.log("Domain status is still on client hold.");
    } else {
      console.log("Domain status is not on client hold anymore!");
      const msg = {
        to: SEND_TO_EMAIL,
        from: SEND_FROM_EMAIL, // Use the email address or domain you verified above
        subject: `Domain ${domainName} NOT ON CLIENT HOLD ANYMORE!`,
        text: "Domain not on client hold anymore, lets buy the domain, friend :)",
        html: "<strong>Domain not on client hold anymore, lets buy the domain, friend :)</strong>",
      };
      (async () => {
        try {
          await sgMail.send(msg);
        } catch (error) {
          console.error(error);

          if (error.response) {
            console.error(error.response.body);
          }
        }
      })();
    }
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({ msg: "Bad request." });
  }
});

module.exports = router;

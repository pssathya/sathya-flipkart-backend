import formidable from 'formidable';
import https from 'https';

import paytmchecksum from '../paytm/PaytmChecksum.cjs';
import { paytmParams, PAYTM_MERCHANT_KEY } from '../index.js';

export const addPaymentGateway = async (request, response) => {
    let paytmCheckSum = await paytmchecksum.generateSignature(paytmParams, PAYTM_MERCHANT_KEY);
    try {
        let params = {
            ...paytmParams,
            'CHECKSUMHASH': paytmCheckSum
        };
        response.json(params);
    } catch (error) {
        console.log(error);
    }
}

export const paymentResponse = (request, response) => {
    console.log(">>>>",request.body);
    const form = new formidable.IncomingForm();
    let paytmCheckSum = request.body.CHECKSUMHASH;
    delete request.body.CHECKSUMHASH;

    var isVerifySignature = paytmchecksum.verifySignature(request.body, PAYTM_MERCHANT_KEY, paytmCheckSum);
    console.log(isVerifySignature);
    if (isVerifySignature) {
        var paytmParams = {};
        paytmParams["MID"] = request.body.MID;
        paytmParams["ORDERID"] = request.body.ORDERID;

        paytmchecksum.generateSignature(paytmParams, PAYTM_MERCHANT_KEY).then(function (checksum) {

            paytmParams["CHECKSUMHASH"] = checksum;

            var post_data = JSON.stringify(paytmParams);

            var options = {

                hostname: 'securegw-stage.paytm.in',
                port: 443,
                path: '/order/status',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };

            var res = "";
            var post_req = https.request(options, function (post_res) {
                post_res.on('data', function (chunk) {
                    res += chunk;
                });

                post_res.on('end', function () {
                    let result = JSON.parse(res)
                    response.redirect(`http://localhost:3000/`)
                });
            });
            post_req.write(post_data);
            post_req.end();
        });
    } else {
        console.log("Checksum Mismatched");
    }
    console.log('//////////////end')
}
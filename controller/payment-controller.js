import formidable from 'formidable';
import https from 'https';
import paytmchecksum from 'paytmchecksum';
import { v4 as uuid } from 'uuid';

import { PAYTM_MID, PAYTM_MERCHANT_KEY, PAYTM_WEBSITE, PAYTM_CHANNEL_ID, PAYTM_INDUSTRY_TYPE_ID, PAYTM_CALLBACK_URL } from '../index.js';

export const addPaymentGateway = async (request, response) => {

    try {
        var paymentDetails = {
            amount: request.body.amount,
            customerId: request.body.name,
            customerEmail: request.body.email,
            customerPhone: request.body.phone
        }
        if (!paymentDetails.amount || !paymentDetails.customerId || !paymentDetails.customerEmail || !paymentDetails.customerPhone) {
            response.status(400).send('Payment failed')
        } else {

            var paytmParams = {};
            paytmParams['MID'] = PAYTM_MID;
            paytmParams['WEBSITE'] = PAYTM_WEBSITE;
            paytmParams['CHANNEL_ID'] = PAYTM_CHANNEL_ID;
            paytmParams['INDUSTRY_TYPE_ID'] = PAYTM_INDUSTRY_TYPE_ID;
            paytmParams['ORDER_ID'] = uuid();
            paytmParams['CUST_ID'] = paymentDetails.customerId;
            paytmParams['TXN_AMOUNT'] = String(paymentDetails.amount);
            paytmParams['CALLBACK_URL'] = PAYTM_CALLBACK_URL;
            paytmParams['EMAIL'] = paymentDetails.customerEmail;
            paytmParams['MOBILE_NO'] = paymentDetails.customerPhone;

            console.log(">>>>", paytmParams);

            var paytmChecksum = paytmchecksum.generateSignature(paytmParams, PAYTM_MERCHANT_KEY);
            
            paytmChecksum.then(function (paytmCheckSum) {
                var txn_url = "https://securegw-stage.paytm.in/theia/processTransaction"; // for staging
                // var txn_url = "https://securegw.paytm.in/theia/processTransaction"; // for production

                let params = {
                    ...paytmParams,
                    'CHECKSUMHASH': paytmCheckSum
                };

                var form_fields = "";
                for (var x in params) {
                    form_fields += "<input type='hidden' name='" + x + "' value='" + params[x] + "' >";
                }

                response.writeHead(200, { 'Content-Type': 'text/html' });
                response.write('<html><head><title>Merchant Checkout Page</title></head><body><center><h1>Please do not refresh this page...</h1></center><form method="post" action="' + txn_url + '" name="f1">' + form_fields + '</form><script type="text/javascript">document.f1.submit();</script></body></html>');
                response.end();
            }).catch(function (error) {
                console.log(error);
                response.status(500).json({ error: error.message });
            });
        }
    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
}

export const paymentResponse = (request, response) => {
    console.log(">>>>", request.body);
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
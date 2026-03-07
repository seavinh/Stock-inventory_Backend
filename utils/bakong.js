const { BakongKHQR, khqrData } = require("bakong-khqr");

/**
 * @typedef {Object} khqrData
 * @property {Object} currency
 * @property {number} currency.usd
 * @property {number} currency.khr
 */

/**
 * @typedef {"merchant" | "individual"} merchantType
 */

/**
 * @typedef {Object} IndividualInfo
 * @property {string} bakongAccountID
 * @property {string} merchantName
 * @property {string} [merchantCity]
 * @property {string} [accountInformation]
 * @property {string} acquiringBank
 * @property {number} [currency]
 * @property {number} [amount]
 * @property {string} [billNumber]
 * @property {string} [storeLabel]
 * @property {string} [terminalLabel]
 * @property {string} [mobileNumber]
 * @property {string} [purposeOfTransaction]
 * @property {string} [languagePreference]
 * @property {string} [merchantNameAlternateLanguage]
 * @property {string} [merchantCityAlternateLanguage]
 * @property {string} [upiMerchantAccount]
 */

/**
 * @typedef {IndividualInfo & { merchantID: string }} MerchantInfo
 */

/**
 * @typedef {Object} KHQRResponse
 * @property {Object} status
 * @property {number} status.code
 * @property {number|null} status.errorCode
 * @property {string|null} status.message
 * @property {any|null} data
 */

const CURRENCY = { usd: khqrData.currency.usd, khr: khqrData.currency.khr };

/**
 * Generate a Bakong KHQR string using generateMerchant.
 * @param {number} amount
 * @param {'usd'|'khr'} currencyCode
 * @param {string} billNumber 
 * @returns {{ qrString: string, md5: string } | null}
 */
const generateQR = (amount, currencyCode = 'usd', billNumber = '') => {
    try {
        const bill = (billNumber || `INV${Date.now()}`).slice(0, 25);

        const khrAmount = currencyCode === 'usd'
            ? Math.round(amount * 4100)
            : Math.round(amount);

        const expirationTimestamp = Date.now() + 15 * 60 * 1000;

        /** @type {MerchantInfo} */
        const merchantInfo = {
            merchantID: "1456",
            // bakongAccountID: "bun_sengtri@bkrt",
            bakongAccountID: process.env.BAKONG_ID,
            merchantName: process.env.MERCHANT_NAME,
            acquiringBank: process.env.ACQUIRING_BANK,
            mobileNumber: process.env.PHONE_NUMBER ,
            merchantCity: "Phnom Penh",
            currency: CURRENCY.khr,
            amount: khrAmount,
            billNumber: bill,
            expirationTimestamp: expirationTimestamp
        };

        const khqr = new BakongKHQR();
        const res = khqr.generateMerchant(merchantInfo);

        console.log('[Bakong] status:', JSON.stringify(res?.status));

        if (!res || res.status.code !== 0 || !res.data) {
            console.error('[Bakong] failed:', JSON.stringify(res?.status));
            return { failedStatus: res?.status };
        }

        return { qrString: res.data.qr, md5: res.data.md5 };
    } catch (err) {
        console.error('[Bakong] exception:', err.message || err);
        return { exceptionMessage: err.message, stack: err.stack };
    }
};

const fs = require('fs');
try {
    const debugOut = generateQR(1, 'usd', 'DEBUG_BILL');
    fs.writeFileSync(__dirname + '/debug_bakong.txt', JSON.stringify(debugOut, null, 2));
} catch (e) {
    fs.writeFileSync(__dirname + '/debug_bakong.txt', JSON.stringify({ uncaught: e.message }));
}

/**
 * Verify payment via Bakong API check_transaction_by_md5
 * @param {string} md5 
 * @returns {Promise<{ isPaid: boolean, data: any }>}
 */
const verifyPayment = async (md5) => {
    const token = process.env.BAKONG_TOKEN;
    const baseUrl = process.env.BAKONG_API_URL || 'https://api-bakong.nbc.gov.kh';
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${baseUrl}/v1/check_transaction_by_md5`, {
        method: 'POST', headers,
        body: JSON.stringify({ md5 }),
    });
    console.log('Checking Md5', md5);
    const json = await res.json();
    console.log('[Bakong Check] Response:', JSON.stringify(json, null, 2));

    const isPaid = json?.responseCode === 0 && !!json?.data;

    return { isPaid, data: json };
};

module.exports = { generateQR, verifyPayment, CURRENCY };
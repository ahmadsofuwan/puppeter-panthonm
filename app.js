const port = 8910;
const puppeteer = require('puppeteer');
const express = require("express");
const soketio = require('socket.io');
const { exec } = require('child_process');
const http = require('http')
const app = express();
const server = http.createServer(app);
const io = soketio(server);
const moment = require('moment')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var Username = 'itbot';
var Password = '123m4sukaja';
var headlessStatus = true;// true No IU :  false UI

let linkPp = 'https://portal.beebeenet.id:1805/rad-customers/ppp';
let linkLogin = 'https://portal.beebeenet.id:1805/rad-admin';
let linkAdd = 'https://portal.beebeenet.id:1805/rad-customers/ppp-add';

let elUsername = 'body > div > div > div > form > div.wrap-input100.validate-input.m-b-23 > input';
let elPassword = 'body > div > div > div > form > div:nth-child(5) > input';
let elLoginBtn = 'body > div > div > div > form > div.container-login100-form-btn > div > button';
let elSearch = '#customers-ppp_filter > label > input';
let elEdit = '#customers-ppp > tbody > tr > td:nth-child(11) > a.btn.btn-info.btn-sm.fa.fa-pencil-square-o';
let elDate = '#service-plan > div:nth-child(13) > div > div > input';
let elMenu2 = '#modal-form > ul > li:nth-child(2) > a';
let elAktif = '#customers-ppp > tbody > tr > td:nth-child(10) > a.btn.btn-primary.btn-sm.fa.fa-bolt';
let elAktifed = '#customers-ppp > tbody > tr:nth-child(1) > td:nth-child(10) > a.btn.btn-default.btn-sm.fa.fa-bolt';
let elTypeAktif = '#active-period-calculation';
let elBtnSumitAktive = '#modal-form > div:nth-child(14) > button';
let elBtnFinish = '#finish_btn';
let elPP = '#PPP';
let elEditName = '#fullname';
let elEditAddres = '#address';
let elEditPhoneNumber = '#phonenumber';



function daftar(data, callback) {
    (async () => {


        const browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(linkLogin);

        await page.type(elUsername, Username);
        await page.type(elPassword, Password);
        await page.click(elLoginBtn);
        await page.waitForSelector('img').then(() =>
            page.goto(linkAdd)
        );

        await page.click(elPP);
        await page.select('#service-plan > div:nth-child(6) > div > div > select', '1');
        await page.select('#nasporttype', 'Ethernet');
        await page.select('#server_id', data[8]);

        await page.waitForSelector('#plan > option:nth-child(101)').then(() =>
            page.select('#plan', data[7])
        );

        await page.evaluate((data) => {
            document.querySelector('#memberId').value = data[0];
            document.querySelector('#fullname').value = data[1];
            document.querySelector('#email').value = data[2];
            document.querySelector('#identity_number').value = data[3];
            document.querySelector('#phonenumber').value = data[4];
            document.querySelector('#address').value = data[5];
            document.querySelector('#username > div').innerHTML = "<input minlength='3' maxlength='50' type='text' class='form-control' id='username' name='username' value = '" + data[6] + "'> "
            document.querySelector('#password > div > div').innerHTML = "<input minlength='0' maxlength='50' type='text' class='form-control' id='password' name='password' placeholder='Password' value='12345678'>;"
            document.querySelector('#cpassword > div > div').innerHTML = " <input minlength='0' maxlength='50' type='text' class='form-control' id='cpassword' name='cpassword' placeholder='Konfirmasi Password' value='12345678'>";
            document.querySelector('#portalpassword').value = '12345678';

        }, data);
        try {
            await page.waitForSelector('#modal-form > div > div:nth-child(5) > button').then(() =>
                page.click('#modal-form > div > div:nth-child(5) > button')
            );
            await page.waitForSelector('#finish_btn').then(() =>
                browser.close()
            );
            callback(null, 'success')
        } catch (err) {
            browser.close()
            callback(null, 'fail')
        }
    })()
};
function update(data, callback) {
    (async () => {


        const browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto('https://portal.beebeenet.id:1805/rad-admin');
        let elUsername = 'body > div > div > div > form > div.wrap-input100.validate-input.m-b-23 > input';
        let elPassword = 'body > div > div > div > form > div:nth-child(5) > input';
        let elSearch = '#customers-ppp_filter > label > input';
        let elEdit = '#customers-ppp > tbody > tr > td:nth-child(11) > a.btn.btn-info.btn-sm.fa.fa-pencil-square-o';
        let elPaket = '#select2-plan-container';
        let elSubPaket = 'body > span > span > span.select2-search.select2-search--dropdown > input';
        let elMenu2 = '#modal-form > ul > li:nth-child(2) > a';
        let elSubmit = '#modal-form > div:nth-child(6) > button';
        let elFinis = 'body > div.wrapper > aside > div > section > div > div.pull-left.image';

        let ID = data.id;
        let NewPaket = data.paket;



        await page.type(elUsername, Username);
        await page.type(elPassword, Password);
        await page.click('body > div > div > div > form > div.container-login100-form-btn > div > button');
        await page.waitForSelector('img').then(() =>
            page.goto('https://portal.beebeenet.id:1805/rad-customers/ppp')
        );
        await page.waitForSelector('img').then(() =>
            page.type(elSearch, ID)
        );
        await page.waitForTimeout(2000);
        await page.click(elEdit);
        await page.waitForTimeout(2000);
        await page.click(elMenu2);
        await page.waitForTimeout(2000);
        await page.click(elPaket);
        await page.waitForTimeout(1000);
        await page.type(elSubPaket, NewPaket + '\n');
        await page.waitForTimeout(2000);
        await page.click(elSubmit);
        try {
            await page.waitForSelector(elFinis).then(() =>
                page.click(elFinis)
            );
            browser.close()
            callback(null, 'success')
        } catch (err) {
            browser.close()
            callback(null, 'fail')
        }
    })()
};
function aktif(data, callback) {
    (async () => {

        let ID = data.id;

        const browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(linkLogin);


        await page.type(elUsername, Username);
        await page.type(elPassword, Password);
        await page.click(elLoginBtn);
        await page.waitForSelector('img').then(() =>
            page.goto(linkPp)
        );

        await page.waitForSelector('img').then(() =>
            page.type(elSearch, ID)
        );
        await page.waitForTimeout(3000);
        let langAktif = await page.evaluate((elAktif) => {
            return document.querySelectorAll(elAktif).length
        }, elAktif);

        if (langAktif == 0) {
            let langAktifed = await page.evaluate((elAktifed) => {
                return document.querySelectorAll(elAktifed).length
            }, elAktifed);
            if (langAktifed == 0) {
                browser.close();
                return callback(null, 'bad');
            } else {
                browser.close();
                return callback(null, 'already');
            }
        } else if (langAktif !== 1) {
            browser.close()
            return callback(null, 'bad')
        }
        await page.click(elEdit);
        await page.waitForTimeout(2000);
        await page.click(elMenu2);
        await page.waitForTimeout(2000);
        let date = await page.evaluate((elDate) => {
            return document.querySelector(elDate).value
        }, elDate)
        let date_now = new Date();
        date = new Date(date);
        var startDate = moment(date_now, 'YYYY-M-DD')
        var endDate = moment(date, 'YYYY-M-DD')
        var secondsDiff = endDate.diff(startDate, 'seconds')
        // jika mines = kurang dari hari ini
        if (secondsDiff < 0) {
            aktif(1);
        } else {
            aktif();
        }
        function aktif(param = 0) {
            (async () => {
                await page.goto(linkPp);
                await page.waitForSelector('img').then(() =>
                    page.type(elSearch, ID)
                );
                await page.waitForTimeout(3000);
                await page.click(elAktif);
                await page.waitForTimeout(3000);

                await page.evaluate((param, elTypeAktif) => {
                    document.querySelector(elTypeAktif).selectedIndex = param;
                }, param, elTypeAktif);
                await page.click(elBtnSumitAktive);
                await page.waitForTimeout(2000);
                await page.waitForSelector(elBtnFinish).then(() =>
                    page.click(elBtnFinish)
                );
                browser.close()
                callback(null, 'success');
            })()

        }

    })()
};
function cek_data(data, callback) {
    (async () => {
        var res = {}
        let ID = data.id;

        const browser = await puppeteer.launch({ headless: headlessStatus, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.goto(linkLogin);


        await page.type(elUsername, Username);
        await page.type(elPassword, Password);
        await page.click(elLoginBtn);
        await page.waitForSelector('img').then(() =>
            page.goto(linkPp)
        );

        await page.waitForSelector('img').then(() =>
            page.type(elSearch, ID)
        );
        await page.waitForTimeout(3000);
        let langAktif = await page.evaluate((elAktif) => {
            return document.querySelectorAll(elAktif).length
        }, elAktif);

        let langAktifed = await page.evaluate((elAktifed) => {
            return document.querySelectorAll(elAktifed).length
        }, elAktifed);

        if (langAktif == 0 && langAktifed == 0) {
            res['status'] = 'bad';
            return callback(null, res);
        }

        await page.click(elEdit);
        await page.waitForTimeout(2000);
        let name = await page.evaluate((elEditName) => { return $(elEditName).val() }, elEditName);
        let address = await page.evaluate((elEditAddres) => { return $(elEditAddres).val() }, elEditAddres);
        let phone = await page.evaluate((elEditPhoneNumber) => { return $(elEditPhoneNumber).val() }, elEditPhoneNumber);
        await page.waitForTimeout(2000);
        await page.click(elMenu2);
        await page.waitForTimeout(2000);
        let date = await page.evaluate((elDate) => { return $(elDate).val() }, elDate)

        res['name'] = name;
        res['address'] = address;
        res['phone'] = phone;
        res['date'] = moment(new Date(date)).format('DD / M / YYYY');
        res['status'] = 'success';
        return callback(null, res);
    })()
}

server.listen(port, function () {
    console.log('server bejalan di port ' + port)
})
app.post('/daftar', (req, res) => {
    let reqs = req.body.array;
    daftar(reqs, function (err, data) {
        if (data == 'success') {
            res.status(200).json({
                status: true,
                response: data
            })
        } else {
            res.status(200).json({
                status: true,
                response: data
            })
        }

    })


})
app.post('/update', (req, res) => {
    let reqs = req.body;
    update(reqs, function (err, data) {
        if (data == 'success') {
            res.status(200).json({
                status: true,
                response: data
            })
            console.log('res = ' + data);
        } else {
            res.status(200).json({
                status: true,
                response: data
            })
            console.log('res = ' + data);
        }

    })


})
app.post('/aktif', (req, res) => {
    let reqs = req.body;
    aktif(reqs, function (err, data) {
        if (data == 'success') {
            res.status(200).json({
                status: true,
                response: data
            })
        } else {
            res.status(200).json({
                status: true,
                response: data
            })
        }

    })


})
app.post('/chekdata', (req, res) => {
    let reqs = req.body;
    cek_data(reqs, function (err, data) {
        if (data.status == 'success') {
            res.status(200).json({
                status: true,
                response: data
            })
        } else {
            res.status(200).json({
                status: true,
                response: data
            })
        }

    })


})
app.get("/", (req, res) => {
    res.sendFile("test.html", { root: __dirname });
})
var bodyParser = require('body-parser');

var services = require('../services');
var middleware = require('../middleware');
var requests = require('../requests');
var roles = require('../utils/roles');

var router = require('express').Router();


function updateCheckInByUserId (req, res, next) {
    req.body.userId = req.params.id;
    services.CheckInService
        .updateCheckIn(req.body)
        .then(function (response){
            res.body = response.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchCheckInByUserId (req, res, next) {
    services.CheckInService
        .findCheckInByUserId(req.params.id)
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function fetchCheckInByUser (req, res, next) {
    services.CheckInService
        .findCheckInByUserId(req.user.id)
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        });
}

function createCheckIn (req, res, next) {
    req.body.userId = req.params.id;
    services.CheckInService
        .createCheckIn(req.body)
        .then(function (checkin){
            res.body = checkin.toJSON();
            return next();
        })
        .catch(function (error){
            return next(error);
        })
}


router.use(bodyParser.json());
router.use(middleware.auth);

router.post('/user/:id(\\d+)', middleware.request(requests.CreateCheckInRequest),
    middleware.permission(roles.ORGANIZERS), createCheckIn);
router.put('/user/:id(\\d+)', middleware.request(requests.UpdateCheckInRequest),
    middleware.permission(roles.ORGANIZERS), updateCheckInByUserId);
router.get('/user/:id(\\d+)', middleware.permission(roles.ORGANIZERS), fetchCheckInByUserId);
router.get('/', fetchCheckInByUser);

router.use(middleware.response);
router.use(middleware.errors);


module.exports.router = router;
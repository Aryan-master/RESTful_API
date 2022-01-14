"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var connections_1 = require("./connections");
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
var express_validator_1 = require("express-validator");
var uuid_1 = require("uuid");
var PORT = 4000;
app.listen(PORT, function () {
    console.log('The application is listening '
        + 'on port http://localhost:' + PORT);
});
app.get('/users', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var sql, rows, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                sql = "SELECT * FROM users";
                return [4 /*yield*/, connections_1.client.query(sql)];
            case 1:
                rows = (_a.sent()).rows;
                res.send(rows);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                throw error_1;
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/users', [
    express_validator_1.check('firstname').notEmpty().withMessage('firstname cannot be empty'),
    express_validator_1.check('lastname').notEmpty().withMessage('lastname cannot be empty'),
    express_validator_1.check('location').notEmpty().withMessage('lastname cannot be empty').isAlpha('en-US', { ignore: ' ' }),
], function (req, res) {
    var errors = express_validator_1.validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        var user = req.body;
        // console.log(user);
        var id = uuid_1.v4();
        var insertQuery = "insert into users(id, firstname, lastname, location) values('" + id + "','" + user.firstname + "', '" + user.lastname + "', '" + user.location + "')";
        connections_1.client.query(insertQuery, function (err, result) {
            if (!err) {
                res.status(201).send("Added new user");
            }
            else {
                console.log(err);
            }
        });
    }
    catch (err) {
        console.error("400");
    }
    // client.end;
});
app.put('/users', function (req, res) {
    try {
        var id = req.query.id;
        var user = req.body;
        var updateQuery = "update users set firstname =$1,lastname = $2,\n    location = $3 where id = $4";
        connections_1.client.query(updateQuery, [user.firstname, user.lastname, user.location, id], function (err, result) {
            if (!err) {
                res.status(201).send('Update was successful');
            }
            else {
                console.log(err.message);
            }
        });
    }
    catch (err) {
        console.error("400");
    }
});
app.delete('/users/:id', function (req, res) {
    try {
        var insertQuery = "delete from users where firstname=" + req.params.id;
        connections_1.client.query(insertQuery, function (err, result) {
            if (!err) {
                res.send('Deletion was successful');
            }
            else {
                console.log(err.message);
            }
        });
    }
    catch (err) {
        console.error("400");
    }
});

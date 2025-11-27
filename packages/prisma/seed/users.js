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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
// Helper to hash passwords (in production, you'd use bcrypt)
var hashPassword = function (password) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcrypt.hash(password, 10)];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
export var createUsers = function () { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, hashPassword('password123')];
            case 1:
                hashedPassword = _a.sent();
                return [2 /*return*/, [
                        {
                            id: 'user-tourist-1',
                            name: 'John Doe',
                            email: 'john.doe@example.com',
                            password_hash: hashedPassword,
                            contact_no: '+94771234567',
                            role: UserRole.tourist,
                        },
                        {
                            id: 'user-tourist-2',
                            name: 'Jane Smith',
                            email: 'jane.smith@example.com',
                            password_hash: hashedPassword,
                            contact_no: '+94772345678',
                            role: UserRole.tourist,
                        },
                        {
                            id: 'user-guide-1',
                            name: 'Nimal Perera',
                            email: 'nimal.perera@example.com',
                            password_hash: hashedPassword,
                            contact_no: '+94773456789',
                            role: UserRole.guide,
                        },
                        {
                            id: 'user-guide-2',
                            name: 'Sunil Fernando',
                            email: 'sunil.fernando@example.com',
                            password_hash: hashedPassword,
                            contact_no: '+94774567890',
                            role: UserRole.guide,
                        },
                        {
                            id: 'user-accommodation-1',
                            name: 'Paradise Hotels Ltd',
                            email: 'contact@paradisehotels.com',
                            password_hash: hashedPassword,
                            contact_no: '+94775678901',
                            role: UserRole.accommodation_provider,
                        },
                        {
                            id: 'user-accommodation-2',
                            name: 'Beach Resorts Inc',
                            email: 'info@beachresorts.com',
                            password_hash: hashedPassword,
                            contact_no: '+94776789012',
                            role: UserRole.accommodation_provider,
                        },
                        {
                            id: 'user-admin-1',
                            name: 'Admin User',
                            email: 'admin@wbth.com',
                            password_hash: hashedPassword,
                            contact_no: '+94777890123',
                            role: UserRole.admin,
                        },
                    ]];
        }
    });
}); };
export var tourists = [
    {
        user_id: 'user-tourist-1',
        country: 'United States',
        dob: new Date('1990-05-15'),
    },
    {
        user_id: 'user-tourist-2',
        country: 'United Kingdom',
        dob: new Date('1988-11-22'),
    },
];

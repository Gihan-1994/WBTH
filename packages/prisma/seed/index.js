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
import { prisma } from '../src/client';
import { createUsers, tourists } from './users';
import { guides } from './guides';
import { accommodationProviders, accommodations } from './accommodations';
import { events } from './events';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var usersData, _i, usersData_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🌱 Starting database seed...\n');
                    // Clear existing data (in order to respect foreign key constraints)
                    console.log('🗑️  Clearing existing data...');
                    return [4 /*yield*/, prisma.booking.deleteMany()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, prisma.payment.deleteMany()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, prisma.notification.deleteMany()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, prisma.rating.deleteMany()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, prisma.event.deleteMany()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, prisma.accommodation.deleteMany()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, prisma.accommodationProvider.deleteMany()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, prisma.guide.deleteMany()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, prisma.tourist.deleteMany()];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, prisma.admin.deleteMany()];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, prisma.user.deleteMany()];
                case 11:
                    _a.sent();
                    console.log('✓ Existing data cleared\n');
                    // 1. Create Users
                    console.log('👥 Creating users...');
                    return [4 /*yield*/, createUsers()];
                case 12:
                    usersData = _a.sent();
                    _i = 0, usersData_1 = usersData;
                    _a.label = 13;
                case 13:
                    if (!(_i < usersData_1.length)) return [3 /*break*/, 16];
                    user = usersData_1[_i];
                    return [4 /*yield*/, prisma.user.create({ data: user })];
                case 14:
                    _a.sent();
                    _a.label = 15;
                case 15:
                    _i++;
                    return [3 /*break*/, 13];
                case 16:
                    console.log("\u2713 Created ".concat(usersData.length, " users\n"));
                    // 2. Create Tourists
                    console.log('🧳 Creating tourists...');
                    return [4 /*yield*/, prisma.tourist.createMany({ data: tourists })];
                case 17:
                    _a.sent();
                    console.log("\u2713 Created ".concat(tourists.length, " tourists\n"));
                    // 3. Create Guides
                    console.log('🗺️  Creating guides...');
                    return [4 /*yield*/, prisma.guide.createMany({ data: guides })];
                case 18:
                    _a.sent();
                    console.log("\u2713 Created ".concat(guides.length, " guides\n"));
                    // 4. Create Accommodation Providers
                    console.log('🏢 Creating accommodation providers...');
                    return [4 /*yield*/, prisma.accommodationProvider.createMany({ data: accommodationProviders })];
                case 19:
                    _a.sent();
                    console.log("\u2713 Created ".concat(accommodationProviders.length, " accommodation providers\n"));
                    // 5. Create Accommodations
                    console.log('🏨 Creating accommodations...');
                    return [4 /*yield*/, prisma.accommodation.createMany({ data: accommodations })];
                case 20:
                    _a.sent();
                    console.log("\u2713 Created ".concat(accommodations.length, " accommodations\n"));
                    // 6. Create Events
                    console.log('🎉 Creating events...');
                    return [4 /*yield*/, prisma.event.createMany({ data: events })];
                case 21:
                    _a.sent();
                    console.log("\u2713 Created ".concat(events.length, " events\n"));
                    console.log('✅ Database seeding completed successfully!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error('❌ Error during seeding:');
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });

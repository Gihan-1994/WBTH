export declare const createUsers: () => Promise<({
    id: string;
    name: string;
    email: string;
    password_hash: string;
    contact_no: string;
    role: "tourist";
} | {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    contact_no: string;
    role: "guide";
} | {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    contact_no: string;
    role: "accommodation_provider";
} | {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    contact_no: string;
    role: "admin";
})[]>;
export declare const tourists: {
    user_id: string;
    country: string;
    dob: Date;
}[];
//# sourceMappingURL=users.d.ts.map
const request = require('supertest')
const app = require('../server');


describe('Post Register Endpoint', () => {
    it('should create a new user using register endpoint', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                firstName: process.env.TEST_FIRSTNAME_REGISTER,
                lastName: process.env.TEST_LASTNAME_REGISTER,
                login: process.env.TEST_EMAIL_REGISTER,
                password: process.env.TEST_PASSWORD_REGISTER,
            })
        expect(res.statusCode).toEqual(201)
    });
});

describe('Post Login Endpoints', () => {
    it('should login user using login endpoint', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                login: process.env.TEST_EMAIL,
                password: process.env.TEST_PASSWORD,
            })
        expect(res.statusCode).toEqual(201)
    });
});

describe('Post delete register data entry', () => {
    it('should delete the user data that was used in Register Endpoint', async () => {
        const res = await request(app)
            .post('/api/deleteusertest')
            .send({
                login: process.env.TEST_EMAIL_REGISTER,
            })
        expect(res.statusCode).toEqual(201)
    });
});

describe('Post verifies the user email by sending a code', () => {
    it('should turn the isVerified statment in DB to be true', async () => {
        const res = await request(app)
            .post('/api/verifyemail')
            .send({
                userID: process.env.TEST_USERID,
                code: process.env.DEV_CHEATCODE,
            })
        expect(res.statusCode).toEqual(201)
    });
});

describe('Post send the email with the code to verify the user to recover the password', () => {
    it('should send email verification code for password recovery ', async () => {
        const res = await request(app)
            .post('/api/sendrecoveryemail')
            .send({
                userID: process.env.TEST_USERID,
            })
        expect(res.statusCode).toEqual(200)
    });
});

describe('Post change user password using the correct verification code', () => {
    it('should reset password if forgot using set verification code', async () => {
        const res = await request(app)
            .post('/api/resetpassword')
            .send({
                userID: process.env.TEST_USERID,
                code: process.env.DEV_CHEATCODE,
                newPassword: process.env.TEST_CHANGE_PASSWORD,
            })
        expect(res.statusCode).toEqual(201)
    });
    it('set password back to original password', async () => {
        const res = await request(app)
            .post('/api/resetpassword')
            .send({
                userID: process.env.TEST_USERID,
                code: process.env.DEV_CHEATCODE,
                newPassword: process.env.TEST_PASSWORD,
            })
        expect(res.statusCode).toEqual(201)
    });
});

describe('Post change user password back to ', () => {
    it('should reset password if forgot using set verification code', async () => {
        const res = await request(app)
            .patch('/api/changepassword')
            .send({
                userID: process.env.TEST_USERID,
                oldPassword: process.env.TEST_PASSWORD,
                newPassword: process.env.TEST_CHANGE_PASSWORD,
            })
        expect(res.statusCode).toEqual(201)
    });
    it('set password back to original password', async () => {
        const res = await request(app)
            .patch('/api/changepassword')
            .send({
                userID: process.env.TEST_USERID,
                oldPassword: process.env.TEST_CHANGE_PASSWORD,
                newPassword: process.env.TEST_PASSWORD,
            })
        expect(res.statusCode).toEqual(201)
    });
});

describe('Post turn isVerified back to false', () => {
    it('should turn isVerified back to false', async () => {
        const res = await request(app)
            .post('/api/changefalse')
            .send({
                userID: process.env.TEST_USERID,
            })
        expect(res.statusCode).toEqual(201)
    });
});
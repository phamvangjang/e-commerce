// login.test.js
const { login, register } = require('../../controllers/user');
const User = require('../../models/user');
const { generateAccessToken, generateRefreshToken } = require('../../middleware/jwt');
const asyncHandler = require('express-async-handler');
const httpMocks = require('node-mocks-http');
const sendMail = require('../../ultils/sendMail');

jest.mock('../../models/user');
jest.mock('../../middleware/jwt');
jest.mock('../../ultils/sendMail', () => jest.fn());

describe('login', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('nên trả về lỗi nếu thiếu email hoặc mật khẩu', async () => {
        req.body = { email: '', password: '' };
        await login(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            success: false,
            mes: 'Missing inputs'
        });
    });



    it('nên trả về lỗi nếu không tìm thấy user', async () => {
        req.body = { email: 'test@example.com', password: 'password' };
        User.findOne.mockResolvedValue(null);
        await login(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Login failed'));
    });

    it('nên trả về lỗi nếu sai mật khẩu', async () => {
        req.body = { email: 'test@example.com', password: 'password' };
        const user = { isCorrectPassword: jest.fn().mockResolvedValue(false) };
        User.findOne.mockResolvedValue(user);
        await login(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Login failed'));
    });

    it('nên trả về token nếu đăng nhập thành công', async () => {
        req.body = { email: 'test@example.com', password: 'password' };
        const user = {
            _id: '671da634ea0431a927534b15',
            role: 'user',
            isCorrectPassword: jest.fn().mockResolvedValue(true),
            toObject: jest.fn().mockReturnValue({
                _id: '671da634ea0431a927534b15',
                firstname: 'thao',
                lastname: 'tran',
                email: 'thao16068@gmail.com',
                mobile: '0923467784',
                wishlist: [],
                isBlocked: false,
                cart: [],
                createdAt: '2024-10-27T02:32:20.468Z',
                updatedAt: '2024-10-27T02:33:19.642Z',
                __v: 0
            })
        };
        User.findOne.mockResolvedValue(user);
        generateAccessToken.mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzFkYTYzNGVhMDQzMWE5Mjc1MzRiMTUiLCJyb2xlIjoiMTk3NiIsImlhdCI6MTcyOTk5NjYxOCwiZXhwIjoxNzMwNjAxNDE4fQ.UN3qQV8ExJztilPscyaDRDOs-7qXb2WcMfA0zmW7FX0');
        generateRefreshToken.mockReturnValue('newRefreshToken');
        await login(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            success: true,
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzFkYTYzNGVhMDQzMWE5Mjc1MzRiMTUiLCJyb2xlIjoiMTk3NiIsImlhdCI6MTcyOTk5NjYxOCwiZXhwIjoxNzMwNjAxNDE4fQ.UN3qQV8ExJztilPscyaDRDOs-7qXb2WcMfA0zmW7FX0',
            userData: {
                _id: '671da634ea0431a927534b15',
                firstname: 'thao',
                lastname: 'tran',
                email: 'thao16068@gmail.com',
                mobile: '0923467784',
                wishlist: [],
                isBlocked: false,
                cart: [],
                createdAt: '2024-10-27T02:32:20.468Z',
                updatedAt: '2024-10-27T02:33:19.642Z',
                __v: 0
            }
        });
        expect(res.cookies.refreshToken.value).toBe('newRefreshToken');
    });

});


describe('register', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('nên trả về lỗi nếu thiếu email hoặc mật khẩu', async () => {
        req.body = { email: '@123', password: '', firstname: '', lastname: '', mobile: '' };
        await register(req, res, next);
        expect(res.statusCode).toBe(400);
        expect(res._getJSONData()).toEqual({
            success: false,
            mes: 'Missing inputs'
        });
    });

    it('nên trả về lỗi nếu email đã tồn tại', async () => {
        req.body = { email: 'test@example.com', password: 'password', firstname: 'thao', lastname: 'tran', mobile: '0923467784' };
        User.findOne.mockResolvedValue(true);
        await register(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('User has existed'));
    });

    it('nên đăng ký thành công nếu thông tin hợp lệ', async () => {
        req.body = { email: 'test@example.com', password: 'password', firstname: 'thao', lastname: 'tran', mobile: '0923467784' };
        User.findOne.mockResolvedValue(null);
        const newUser = {
            _id: '671da634ea0431a927534b15',
            email: 'test@example.com',
            password: 'hashedpassword',
            firstname: 'thao',
            lastname: 'tran',
            mobile: '0923467784',
            save: jest.fn().mockResolvedValue({
                _id: '671da634ea0431a927534b15',
                email: 'test@example.com',
                password: 'hashedpassword',
                firstname: 'thao',
                lastname: 'tran',
                mobile: '0923467784'
            })
        };
        User.create.mockResolvedValue(newUser);
        generateAccessToken.mockReturnValue('token');
        sendMail.mockResolvedValue(true);
        await register(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            success: true,
            mes: 'Please check your email to active account'
        });
        // expect(res.Cookies['refreshToken'].value).toBe('refresh token'); // Kiểm tra giá trị cookie đúng cách
    });
});

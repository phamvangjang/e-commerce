// user.test.js
const { login } = require('../../controllers/user');
const User = require('../../models/user');
const { generateAccessToken, generateRefreshToken } = require('./utils/token');
const asyncHandler = require('express-async-handler');
const httpMocks = require('node-mocks-http');

jest.mock('./models/User');
jest.mock('./utils/token');

describe('login', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
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

    it('nên trả về lỗi nếu không tìm thấy người dùng', async () => {
        req.body = { email: 'test@example.com', password: 'password' };
        User.findOne.mockResolvedValue(null);
        await login(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Login failed'));
    });

    it('nên trả về lỗi nếu mật khẩu không đúng', async () => {
        req.body = { email: 'test@example.com', password: 'password' };
        const user = { isCorrectPassword: jest.fn().mockResolvedValue(false) };
        User.findOne.mockResolvedValue(user);
        await login(req, res, next);
        expect(next).toHaveBeenCalledWith(new Error('Login failed'));
    });

    it('nên trả về thành công nếu đăng nhập đúng', async () => {
        req.body = { email: 'test@example.com', password: 'password' };
        const user = {
            _id: 'userId',
            role: 'user',
            isCorrectPassword: jest.fn().mockResolvedValue(true),
            toObject: jest.fn().mockReturnValue({
                email: 'test@example.com',
                role: 'user',
                refreshToken: 'oldToken'
            })
        };
        User.findOne.mockResolvedValue(user);
        generateAccessToken.mockReturnValue('accessToken');
        generateRefreshToken.mockReturnValue('newRefreshToken');
        await login(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toEqual({
            success: true,
            accessToken: 'accessToken',
            userData: {
                email: 'test@example.com',
                role: 'user'
            }
        });
        expect(res.cookies.refreshToken.value).toBe('newRefreshToken');
    });
});
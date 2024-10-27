const axios = require('axios');

test('POST /api/user/login returns expected response', async () => {
    // Define the request body
    const body = {
        email: 'thao16068@gmail.com',
        password: '123456'
    };

    const res = await axios.post("http://localhost:5000/api/user/login", body, {
        headers: { 'Content-Type': 'application/json' }
    });

    // Assert the expected response structure
    expect(res.data.userData).toEqual({

        _id: "671da634ea0431a927534b15",
        firstname: "thao",
        lastname: "tran",
        email: "thao16068@gmail.com",
        mobile: "0923467784",
        wishlist: [],
        isBlocked: false,
        cart: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0


    });
});

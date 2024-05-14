const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    // PRODUCTS: 'products',
    PRODUCTS: ':category',
    BLOGS: 'blogs',
    OUR_SERVICE: 'services',
    FAQ: 'faqs',
    DETAIL_PRODUCT_CATEGORY_PID_TITLE: ':category/:pid/:title',
    DETAIL_PRODUCT: 'san-pham',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',

    //admin
    ADMIN: 'admin',
    DASHBOARD : 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCTS: 'manage-products',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCTS: 'create-products',

    //member
    MEMBER: 'member',
    PERSONAL: 'personal',

}
export default path
import path from "./path"
import icons from "./icons"

export const navigation = [
    {
        id: 1,
        value: 'HOME',
        path: `/${path.HOME}`
    },
    {
        id: 2,
        value: 'PRODUCTS',
        path: `/${path.PRODUCTS}`
    },
    {
        id: 3,
        value: 'BLOGS',
        path: `/${path.BLOGS}`
    },
    {
        id: 4,
        value: 'OUR SERVICE',
        path: `/${path.OUR_SERVICE}`
    },
    {
        id: 5,
        value: 'FAQs',
        path: `/${path.FAQ}`
    }
]

export const productInforTabs = [
    {
        id: 1,
        name: 'DESCRIPTION',
        content: `Technology: GSM / HSPA / LTE
        Dimensions: 153.8 x 75.5 x 7.6 mm
        Weight: 154 g
        Display: IPS LCD 5.5 inches
        Resolution: 720 x 1280
        OS: Android OS, v6.0 (Marshmallow)
        Chipset: Octa-core
        CPU: Octa-core
        Internal: 32 GB, 4 GB RAM
        Camera: 13MB - 20 MP`
    },
    {
        id: 2,
        name: 'WARRANTY',
        content: `WARRANTY INFORMATION
        LIMITED WARRANTIES
        Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
        
        Frames Used In Upholstered and Leather Products
        Limited Lifetime Warranty
        A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`
    },
    {
        id: 3,
        name: 'DELIVERY',
        content: `PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store`
    },
    {
        id: 4,
        name: 'PAYMENT',
        content: `Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery`
    },
    // {
    //     id: 5,
    //     name: 'CUSTOMERREVIEW',
    //     content: `CUSTOMER REVIEWS
    //     Based on 3 reviews
    //     Write a review`
    // }
]

export const color = [
    'Brown',
    'Gray',
    'Silver',
    'Pink',
    'Blue',
    'Red',
    'Black Leather',
    'MINERAL BLACK',
    'Gold',
    'White',
    'Black',
    'Carbon gray',
    'Quite black',
    'Dazzling white',
]

export const sorts = [
    {
        id: 1,
        value: '-sort',
        text: 'Best selling'
    },
    {
        id: 2,
        value: 'title',
        text: 'Anphabetically, A-Z'
    },
    {
        id: 3,
        value: '-title',
        text: 'Anphabetically, Z-A'
    },
    {
        id: 4,
        value: '-price',
        text: 'Price, high to low'
    },
    {
        id: 5,
        value: 'price',
        text: 'Price, low to high'
    },
    {
        id: 6,
        value: '-createdAt',
        text: 'Date, new to old'
    },
    {
        id: 7,
        value: 'createdAt',
        text: 'Date, old to new '
    },
]

export const voteOptions = [
    {
        id: 5,
        text: 'Perfect'
    },
    {
        id: 4,
        text: 'Good'
    },
    {
        id: 3,
        text: 'Neutral'
    },
    {
        id: 2,
        text: 'Bad'
    },
    {
        id: 1,
        text: 'Terrible'
    },
]

const { MdDashboard, MdGroups, AiFillProduct, RiBillLine } = icons
export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOARD}`,
        icons: <MdDashboard size={24}/>
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icons: <MdGroups size={24} />
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Manage products',
        icons: <AiFillProduct size={24} />,
        submenu: [
            {
                text: 'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`
            },
            {
                text: 'Manage product',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`
            },
        ]
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage order',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icons: <RiBillLine size={24} />
    },
]

export const memberSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Personal',
        path: `/${path.MEMBER}/${path.PERSONAL}`,
        icons: <MdDashboard size={24}/>
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'My cart',
        path: `/${path.MEMBER}/${path.MY_CART}`,
        icons: <MdGroups size={24} />
    },
    {
        id: 3,
        type: 'SINGLE',
        text: 'Buy histories',
        path: `/${path.MEMBER}/${path.HISTORY}`,
        icons: <RiBillLine size={24} />
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Wish list',
        path: `/${path.MEMBER}/${path.WISHLIST}`,
        icons: <RiBillLine size={24} />
    },
]

export const roles = [
    {
        code: 1973,
        value: 'Admin'
    },
    {
        code: 1976,
        value: 'User'
    },
]

export const blockStatus = [
    {
        code: true,
        value: 'Blocked'
    },
    {
        code: false,
        value: 'Active'
    },
]
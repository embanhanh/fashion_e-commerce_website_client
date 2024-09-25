import Auth from '../pages/Auth/Auth.jsx'
import Home from '../pages/Home/Home.jsx'
import Info from '../pages/Profile/Info.jsx'
import Orders from '../pages/Profile/Orders.jsx'
import Wishlists from '../pages/Profile/Wishlists.jsx'
import Addresses from '../pages/Profile/Addresses.jsx'
import SavedCards from '../pages/Profile/SavedCards.jsx'
import Notifications from '../pages/Profile/Notifications.jsx'
import Settings from '../pages/Profile/Settings.jsx'
import ProfileLayout from '../layouts/ProfileLayout/ProfileLayout.jsx'
import { Children, Fragment } from 'react'
import ProductList from '../pages/ProductList/ProductList.jsx'
import ProductDetail from '../pages/ProductDetail/ProductDetail.jsx'
import Cart from '../pages/Cart/Cart.jsx'
import ProductManagement from '../pages/admin/ProductManagement.jsx'
import Adminlayout from '../layouts/AdminLayout.jsx'
import CreateProduct from '../pages/admin/CreateProduct.jsx'

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/cart', element: Cart },
    {
        path: '/products',
        element: ProductList,
    },
    {
        path: '/products/:product_name',
        element: ProductDetail,
    },
    { path: '/user/login', element: Auth, layout: Fragment },
    { path: '/user/signup', element: Auth, layout: Fragment },
    {
        path: '/user/profile',
        element: ProfileLayout,
        children: [
            { path: '', element: Info, layout: Fragment }, // Thông tin cá nhân
            { path: 'orders', element: Orders, layout: Fragment }, // Đơn hàng
            { path: 'wishlists', element: Wishlists, layout: Fragment }, // Danh sách yêu thích
            { path: 'addresses', element: Addresses, layout: Fragment }, // Địa chỉ
            { path: 'savedcards', element: SavedCards, layout: Fragment }, // Thẻ đã lưu
            { path: 'notifications', element: Notifications, layout: Fragment }, // Thông báo
            { path: 'settings', element: Settings, layout: Fragment }, // Cài đặt
        ],
    },
    { path: '/seller/products', element: ProductManagement, layout: Adminlayout },
    { path: '/seller/products/create', element: CreateProduct, layout: Adminlayout },
]
const privateRoutes = []

export { publicRoutes, privateRoutes }

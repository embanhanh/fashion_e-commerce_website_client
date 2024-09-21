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
import { Fragment } from 'react'

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/user/login', element: Auth, layout: Fragment },
    { path: '/user/signup', element: Auth, layout: Fragment },
    {
        path: '/user/profile',
        element: ProfileLayout,
        children: [
            { path: '', element: Info },  // Thông tin cá nhân
            { path: 'orders', element: Orders },  // Đơn hàng
            { path: 'wishlists', element: Wishlists },  // Danh sách yêu thích
            { path: 'addresses', element: Addresses },  // Địa chỉ
            { path: 'savedcards', element: SavedCards },  // Thẻ đã lưu
            { path: 'notifications', element: Notifications },  // Thông báo
            { path: 'settings', element: Settings }  // Cài đặt
        ]
    },
]

const privateRoutes = []

export { publicRoutes, privateRoutes }

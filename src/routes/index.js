import Auth from '../pages/Auth/Auth.jsx'
import Home from '../pages/Home/Home.jsx'
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
import MainManager from '../pages/admin/MainManager.jsx'
import ShopManagerment from '../pages/admin/ShopManagerment.jsx'
import DesignShop from '../pages/admin/DesignShop.jsx'
import Profile from '../pages/Profile/Profile.jsx'
import CreateBanner from '../pages/admin/CreateBanner.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import VoucherManagement from '../pages/admin/VoucherManagement.jsx'
import CreateVoucher from '../pages/admin/CreateVoucher.jsx'
import OrderManagement from '../pages/admin/OrderManagement.jsx'
import InvoicePage from '../pages/Invoice/InvoicePage.jsx'
import PromotionalCombos from '../pages/admin/PromotionalCombos.jsx'
import CreatePromotionalCombos from '../pages/admin/CreatePromotionalCombos.jsx'
import CustomerManagement from '../pages/admin/CustomerManagement.jsx'
import Chat from '../pages/admin/Chat.jsx'
import Statistic from '../pages/admin/Statistic.jsx'
import RatingDemo from '../components/RatingDemo.jsx'
import Privacy from '../pages/Policy/Privacy.jsx'
import Terms from '../pages/Policy/Terms.jsx'
import Refund from '../pages/Policy/Refund.jsx'
import Delivery from '../pages/Policy/Delivery.jsx'
import Payment from '../pages/Policy/Payment.jsx'
import Check from '../pages/Policy/Check.jsx'
import DetailOrder from '../components/DetailOrder.jsx'
import Vouchers from '../pages/Profile/Vouchers.jsx'

const publicRoutes = [
    { path: '/', element: Home },
    { path: '/policy/privacy', element: Privacy },
    { path: '/policy/terms', element: Terms },
    { path: '/policy/refund', element: Refund },
    { path: '/policy/delivery', element: Delivery },
    { path: '/policy/payment', element: Payment },
    { path: '/policy/check', element: Check },
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
    { path: '/user/forgot-password', element: Auth, layout: Fragment },
    { path: '/404', element: NotFound, layout: Fragment },
    { path: '*', element: NotFound, layout: Fragment },
]
const privateRoutes = [
    {
        path: '/user/account',
        element: ProfileLayout,
        allowedRoles: ['user', 'admin'],
        children: [
            { path: 'profile', element: Profile, layout: Fragment },
            { path: 'orders/:order_id', element: DetailOrder, layout: Fragment },
            { path: 'orders', element: Orders, layout: Fragment },
            { path: 'wishlists', element: Wishlists, layout: Fragment },
            { path: 'addresses', element: Addresses, layout: Fragment },
            { path: 'vouchers', element: Vouchers, layout: Fragment },
            { path: 'notifications', element: Notifications, layout: Fragment },
            { path: 'settings', element: Settings, layout: Fragment },
        ],
    },
    { path: '/cart/edit/:order_id', element: Cart, allowedRoles: ['user', 'admin'] },
    { path: '/cart', element: Cart, allowedRoles: ['user', 'admin'] },
    {
        path: '/seller/products/edit/:product_name',
        element: CreateProduct,
        layout: Adminlayout,
        allowedRoles: ['admin'],
    },
    { path: '/seller/products/create', element: CreateProduct, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/products', element: ProductManagement, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/shop/infomation', element: ShopManagerment, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/shop/banner', element: DesignShop, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/shop/banner/create', element: CreateBanner, layout: Adminlayout, allowedRoles: ['admin'] },
    {
        path: '/seller/shop/banner/edit/:banner_id',
        element: CreateBanner,
        layout: Adminlayout,
        allowedRoles: ['admin'],
    },
    { path: '/seller', element: MainManager, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/voucher', element: VoucherManagement, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/voucher/edit/:voucher_id', element: CreateVoucher, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/voucher/create', element: CreateVoucher, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/combo', element: PromotionalCombos, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/combo/create', element: CreatePromotionalCombos, layout: Adminlayout, allowedRoles: ['admin'] },
    {
        path: '/seller/combo/edit/:combo_id',
        element: CreatePromotionalCombos,
        layout: Adminlayout,
        allowedRoles: ['admin'],
    },
    { path: '/seller/orders', element: OrderManagement, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/customers', element: CustomerManagement, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/chat/:user_id', element: Chat, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/chat', element: Chat, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/seller/statistic', element: Statistic, layout: Adminlayout, allowedRoles: ['admin'] },
    { path: '/invoice', element: InvoicePage, layout: Fragment, allowedRoles: ['user', 'admin'] },
    { path: '/rating', element: RatingDemo, layout: Fragment, allowedRoles: ['user', 'admin'] },
]

export { publicRoutes, privateRoutes }

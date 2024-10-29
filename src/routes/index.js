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
        path: '/user/account',
        element: ProfileLayout,
        children: [
            { path: 'profile', element: Profile, layout: Fragment },
            { path: 'orders', element: Orders, layout: Fragment },
            { path: 'wishlists', element: Wishlists, layout: Fragment },
            { path: 'addresses', element: Addresses, layout: Fragment },
            { path: 'savedcards', element: SavedCards, layout: Fragment },
            { path: 'notifications', element: Notifications, layout: Fragment },
            { path: 'settings', element: Settings, layout: Fragment },
        ],
    },
    { path: '/seller/products/edit/:product_name', element: CreateProduct, layout: Adminlayout },
    { path: '/seller/products/create', element: CreateProduct, layout: Adminlayout },
    { path: '/seller/products', element: ProductManagement, layout: Adminlayout },
    { path: '/seller/shop/infomation', element: ShopManagerment, layout: Adminlayout },
    { path: '/seller/shop/banner', element: DesignShop, layout: Adminlayout },
    { path: '/seller/shop/banner/create', element: CreateBanner, layout: Adminlayout },
    { path: '/seller/shop/banner/edit/:banner_id', element: CreateBanner, layout: Adminlayout },
    { path: '/seller', element: MainManager, layout: Adminlayout },
    { path: '/seller/voucher', element: VoucherManagement, layout: Adminlayout },
    { path: '/seller/voucher/edit/:voucher_id', element: CreateVoucher, layout: Adminlayout },
    { path: '/seller/voucher/create', element: CreateVoucher, layout: Adminlayout },
    { path: '/seller/combo', element: PromotionalCombos, layout: Adminlayout },
    { path: '/seller/combo/create', element: CreatePromotionalCombos, layout: Adminlayout },
    { path: '/seller/combo/edit/:combo_id', element: CreatePromotionalCombos, layout: Adminlayout },
    { path: '/seller/orders', element: OrderManagement, layout: Adminlayout },
    { path: '/seller/customers', element: CustomerManagement, layout: Adminlayout },
    { path: '/invoice', element: InvoicePage, layout: Fragment },
    { path: '*', element: NotFound, layout: Fragment },
]
const privateRoutes = []

export { publicRoutes, privateRoutes }

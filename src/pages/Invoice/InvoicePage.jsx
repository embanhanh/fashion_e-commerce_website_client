import './InvoicePage.scss'
import React, { Suspense, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getShopInfo } from '../../redux/slices/shopSlice'
const LazyPDFViewer = React.lazy(() => import('./lazyPDFViewer'))

const InvoicePage = () => {
    const dispatch = useDispatch()
    const { shopInfo } = useSelector((state) => state.shop)
    const [orders, setOrders] = useState([])
    useEffect(() => {
        const storedOrders = localStorage.getItem('selectedOrders')
        console.log(storedOrders)
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders))
        }
        dispatch(getShopInfo())
    }, [dispatch])

    return (
        <div>
            <Suspense fallback={<div>Đang tải PDF...</div>}>{orders.length > 0 && shopInfo && <LazyPDFViewer orders={orders} shop={shopInfo} />}</Suspense>
        </div>
    )
}

export default InvoicePage

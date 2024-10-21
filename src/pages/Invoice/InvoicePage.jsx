import './InvoicePage.scss'
import React, { Suspense, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getOrderByIdAction } from '../../redux/slices/orderSilce'
import { getShopInfo } from '../../redux/slices/shopSlice'
const LazyPDFViewer = React.lazy(() => import('./lazyPDFViewer'))

const InvoicePage = () => {
    const { order_id } = useParams()
    const dispatch = useDispatch()
    const { currentOrder } = useSelector((state) => state.order)
    const { shopInfo } = useSelector((state) => state.shop)
    useEffect(() => {
        if (order_id) {
            dispatch(getOrderByIdAction(order_id))
            dispatch(getShopInfo())
        }
    }, [dispatch, order_id])

    return (
        <div>
            <Suspense fallback={<div>Đang tải PDF...</div>}>{currentOrder && shopInfo && <LazyPDFViewer order={currentOrder} shop={shopInfo} />}</Suspense>
        </div>
    )
}

export default InvoicePage

import './ProductCard.scss'
import React, { useState, useEffect } from 'react'
import Rating from './Rating'
import { convertMoney } from '../utils/StringUtil'
import cart from '../assets/image/icons/shopping-cart.png'
import { useDispatch } from 'react-redux'
import { getPromotionalComboByProductIdAction } from '../redux/slices/promotionalComboSlice'

function ProductCard({ name, url, originalPrice, discount, rating, isFeature, productId }) {
    const price = originalPrice - (originalPrice * discount) / 100
    const dispatch = useDispatch()
    const [promotionalComboByProduct, setPromotionalComboByProduct] = useState(null)
    useEffect(() => {
        if (productId) {
            const getCombo = async () => {
                const response = await dispatch(getPromotionalComboByProductIdAction(productId))
                setPromotionalComboByProduct(response.payload)
            }
            getCombo()
        }
    }, [dispatch, productId])



    return (
        <>
            <div className="product-card d-flex flex-column w-100 shadow rounded-5 h-100">
                {discount > 0 && <div className="product-badge discount-badge">-{discount}%</div>}

                {isFeature && <div className="product-badge hot-badge">HOT</div>}
                <div className="position-relative">
                    <img src={url} alt={name} className="product-card__img w-100 rounded-top-4" loading="lazy" />
                    {promotionalComboByProduct && <div className="product-badge combo-badge">COMBO</div>}
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                    <p className="product-name text-center fw-bolder fs-3 mb-2">{name}</p>
                    <div className="mt-auto"></div>
                    <div className="d-inline-flex justify-content-between align-items-center px-3 py-1">
                        <p className="fw-medium fs-3">
                            {price == originalPrice ? convertMoney(originalPrice) : convertMoney(price)}
                        </p>
                        <p className="text-decoration-line-through" style={{ color: '#ccc' }}>
                            {price == originalPrice ? '' : convertMoney(originalPrice)}
                        </p>
                    </div>
                    <div className="d-inline-flex justify-content-between align-items-center px-3">
                        <Rating initialRating={rating} readonly gap={4} size={18} />
                        <button className="product-card__cart-btn">
                            <img className="cart-icon__img" src={cart} alt="cart" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard

import './ProductCard.scss'
import React, { useState } from 'react'
import { Rating } from './Rating'
import { convertMoney } from '../utils/StringUtil'

function ProductCard({ name, url, originalPrice, discount, rating, isFeature }) {
    const price = originalPrice - (originalPrice * discount) / 100

    return (
        <>
            <div className="product-card d-flex flex-column w-100 shadow rounded-4 h-100">
                {discount > 0 && <div className="product-badge discount-badge">-{discount}%</div>}

                {isFeature && <div className="product-badge hot-badge">HOT</div>}
                <img src={url} alt={name} className="product-card__img w-100 rounded-top-4" loading="lazy" />
                <div className="p-4 d-flex flex-column flex-grow-1">
                    <p className="product-name text-center fw-bolder fs-3 mb-2">{name}</p>
                    <div className="mt-auto"></div>
                    <div className="d-inline-flex justify-content-between align-items-center px-3 py-1">
                        <p className="fw-medium fs-3">{price == originalPrice ? convertMoney(originalPrice) : convertMoney(price)}</p>
                        <p className="text-decoration-line-through" style={{ color: '#ccc' }}>
                            {price == originalPrice ? '' : convertMoney(originalPrice)}
                        </p>
                    </div>
                    <div className="d-inline-flex justify-content-between align-items-center px-3">
                        <Rating initialRating={rating} readonly gap={4} size={18} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard

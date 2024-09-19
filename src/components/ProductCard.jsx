import './ProductCard.scss'
import React, { useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import produtc1 from '../assets/image/product_image/product_image_1.png'
import { convertMoney } from '../utils/StringUtil'

function ProductCard({ name, url, originalPrice, discount, rating }) {
    const price = originalPrice - originalPrice * discount

    return (
        <>
            <div className="product-card d-flex flex-column w-100 border border-2 rounded-2 h-100" style={{ borderColor: '#ccc' }}>
                <img src={produtc1} alt="" className="product-img w-100" />
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
                        <Rating initialValue={rating} readonly={true} size={20} />
                        <p className="fw-medium fs-3" style={{ color: '#FB7181' }}>
                            {price == originalPrice ? '' : `${discount * 100}%`}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductCard

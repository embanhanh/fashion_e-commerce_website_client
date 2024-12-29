import { Link } from 'react-router-dom'
import './ProductCard.scss'
import React, { useState, useEffect } from 'react'
import Rating from './Rating'
import { convertMoney } from '../utils/StringUtil'
import cart from '../assets/image/icons/shopping-cart.png'
import { useDispatch } from 'react-redux'

function FavoriteCard(product) {
    const price = product.product.originalPrice - (product.product.originalPrice * product.product.discount) / 100
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const images = product.product.urlImage

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
        }, 2000)

        return () => clearInterval(interval)
    }, [images.length])

    return (
        <Link to={`/products/${product.product.slug}`}>
            <div
                className="product-card d-flex flex-column w-100 shadow rounded-5 h-100"
                style={{ minHeight: '350px' }}
            >
                {product.product.discount > 0 && (
                    <div className="product-badge discount-badge">-{product.product.discount}%</div>
                )}

                {product.product.isFeature && <div className="product-badge hot-badge">HOT</div>}
                <div className="position-relative">
                    <img
                        src={images[currentImageIndex]}
                        alt={product.product.name}
                        className="product-card__img w-100 rounded-top-4"
                        loading="lazy"
                        style={{ transition: 'opacity 0.5s ease-in-out' }}
                    />

                    <div className="position-absolute bottom-0 start-50 translate-middle-x mb-2 d-flex gap-1">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className="rounded-circle"
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    backgroundColor: index === currentImageIndex ? '#ee4d2d' : '#ccc',
                                    transition: 'background-color 0.3s',
                                }}
                            />
                        ))}
                    </div>
                </div>
                <div className="p-4 d-flex flex-column flex-grow-1">
                    <p className="product-name text-center fw-bolder fs-3 mb-2">{product.product.name}</p>
                    <div className="mt-auto"></div>
                    <div className="d-inline-flex justify-content-between align-items-center px-3 py-1">
                        <p className="fw-medium fs-3">
                            {price == product.product.originalPrice
                                ? convertMoney(product.product.originalPrice)
                                : convertMoney(price)}
                        </p>
                        <p className="text-decoration-line-through" style={{ color: '#ccc' }}>
                            {price == product.product.originalPrice ? '' : convertMoney(product.product.originalPrice)}
                        </p>
                    </div>
                    <div className="d-inline-flex justify-content-between align-items-center px-3">
                        <Rating initialRating={Number(product.product.rating).toFixed(1)} readonly gap={4} size={18} />
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default FavoriteCard

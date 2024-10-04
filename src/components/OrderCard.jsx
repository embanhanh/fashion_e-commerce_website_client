import './OrderCard.scss'

function OrderCart({ product }) {
    return (
        <div className="order-cart">
            <div className="d-flex justify-content-between">
                <div className="order-image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="order-details">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-size">Size: {product.size}</p>
                    <p className="product-quantity">Số lượng: {product.quantity}</p>
                </div>
                <div className="order-price align-self-center">
                    <p>{product.price.toLocaleString()}đ</p>
                </div>
                <div className="order-action align-self-center">
                    {product.status === 'delivered' ? (
                        <button className="btn rate-btn">Đánh Giá</button>
                    ) : (
                        <button className="btn cancel-btn">Hủy Đơn Hàng</button>
                    )}
                </div>
            </div>
            <div className="d-flex justify-content-left">
                {product.status === 'delivered' ? (
                    <p className="delivered-status me-4">Đã giao hàng</p>
                ) : <p className="process-status me-4">Đang xử lý</p>}
                <p className="statusMessage">{ product.statusMessage}</p>
            </div>
        </div>
    );
}

export default OrderCart;
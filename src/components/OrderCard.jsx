import './OrderCard.scss'

function OrderCard({ order }) {
    return (
        <div className="d-flex flex-column justify-content-between bg-white my-5">
            <div className="d-flex justify-content-end my-4">
                <p className="ps-2 text-uppercase me-3">{order.status === 'processing'
                    ? <span className="text-warning">Đang xử lý</span>
                    : order.status === 'pending'
                        ? <span className="text-pending">Chờ xác nhận</span>
                        : order.status === 'delivering'
                            ? <span className="text-delivering">Đang giao hàng</span>
                            : order.status === 'delivered' ?
                                <span className="text-delivered">Đã giao</span>
                                : order.status === 'cancelled' ?
                                    <span className="text-cancelled">Đã hủy</span> : null} </p>
            </div>
            <div className="d-flex flex-column border-top">
                {order?.products.map((product, index) => (
                    <div key={index} className="d-flex justify-content-between border-bottom p-4">
                        <div className="d-flex">
                            <img src={product.product.imageUrl} alt="error" style={{ width: "50px", height: "50px" }} />
                            <div className="d-flex flex-column ms-4">
                                <p className="fs-4 text-wrap">Tên sản phẩm: {product.product.product.name}</p>
                                <p>Số lượng: {product.quantity}</p>
                                <div className="d-flex">
                                    <p>Phân loại hàng: </p>
                                    {product.product.product.categories.map((categorie, index) => (
                                        <p key={index} className="ms-2">{categorie.name}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="">
                            <span className="fs-5 text-decoration-line-through text-secondary mx-2">{product.product.price.toLocaleString('vi-VN')}đ</span>
                            <span className="fs-4 text-body">{product.product.product.originalPrice.toLocaleString('vi-VN')}đ</span>
                        </div>

                    </div>
                ))}
            </div>
            <div className=" p-5 d-flex flex-row-reverse">
                <p className="fs-3 fw-normal text-center p-1 ms-3 d-flex align-items-center">{order.productsPrice.toLocaleString('vi-VN')}đ</p>
                <p className="fs-4 fw-normal d-flex align-items-center">Thành tiền:</p>
            </div>

            <div className="order-actions p-4 border-top">
                <div className="d-flex justify-content-end gap-3">
                    {/* {order.status === 'delivered' && ( */}
                    <>
                        <button className="btn primary-btn">
                            Đã nhận hàng
                        </button>
                        <button className="btn secondary-btn">
                            Xem chi tiết đơn hàng
                        </button>

                    </>
                    {/* )} */}
                    {order.status === 'delivering' && (
                        <>
                            <button className="btn secondary-btn">
                                Xem chi tiết đơn hàng
                            </button>
                        </>
                    )}
                    {/* Thêm các điều kiện khác tùy theo status */}
                </div>
            </div>
        </div>
    )
}

export default OrderCard;

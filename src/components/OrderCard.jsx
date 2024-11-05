import './OrderCard.scss'

function OrderCard({ order }) {
    return (
        <div className="order-cart">
            <div className="d-flex flex-column justify-content-between">
                <div className="d-flex flex-column">
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
                                <span className="fs-5 text-decoration-line-through text-secondary mx-2">{product.product.product.originalPrice.toLocaleString('vi-VN')}đ</span>
                                <span className="fs-4 text-body">{product.product.product.originalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>

                        </div>
                    ))}
                </div>
                <div className="border-bottom p-5 d-flex flex-row-reverse">
                    <span className="fs-4 fw-normal text-center p-1 ms-4 ">{order.productsPrice.toLocaleString('vi-VN')}đ</span>
                    <strong className="fs-3 fw-normal">Thành tiền:</strong>

                </div>


            </div>
        </div>
    )
}

export default OrderCard;

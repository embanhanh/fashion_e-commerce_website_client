import { Modal } from 'react-bootstrap'
import { useState } from 'react'
export default function ShippingMethodModal({ showShippingMethod, setShowShippingMethod, orderData, cart, confirmShippingMethod, originalShippingMethod }) {
    const [shippingMethod, setShippingMethod] = useState(originalShippingMethod)
    return (
        <Modal show={showShippingMethod} onHide={() => setShowShippingMethod(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-2">Chọn phương thức vận chuyển</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex p-3 align-items-center border-bottom">
                    <label className="d-flex align-items-center me-3">
                        <input type="checkbox" className="input-checkbox" checked={shippingMethod === 'basic'} onChange={() => setShippingMethod('basic')} />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="fs-3">Vận chuyển cơ bản</p>
                </div>
                {orderData.products.every((product) => {
                    const shippingInfo = cart.items.find((item) => item.variant._id === product.product)?.variant.product?.shippingInfo?.find((info) => info.type === 'fast')
                    return !!shippingInfo
                }) && (
                    <div className="d-flex p-3 align-items-center border-bottom">
                        <label className="d-flex align-items-center me-3">
                            <input type="checkbox" className="input-checkbox" checked={shippingMethod === 'fast'} onChange={() => setShippingMethod('fast')} />
                            <span className="custom-checkbox"></span>
                        </label>
                        <p className="fs-3">Vận chuyển nhanh</p>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className="primary-btn px-4 py-2 shadow-none light border rounded-3" variant="secondary" onClick={() => setShowShippingMethod(false)}>
                    <p>Đóng</p>
                </div>
                <div className="primary-btn px-4 py-2 shadow-none" variant="secondary" onClick={() => confirmShippingMethod(shippingMethod)}>
                    <p>Xác nhận</p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

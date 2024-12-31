import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import paypal from '../assets/image/default/paypal.png'
import vietcombank from '../assets/image/default/vietcombank.png'
import momo from '../assets/image/default/momo.png'
import vnpay from '../assets/image/default/vnpay.png'
import zalopay from '../assets/image/default/zalopay.png'

function PaymentMethodModal({ showPaymentMethod, handleClosePaymentMethod, orderData, setOrderData }) {
    const [paymentMethod, setPaymentMethod] = useState(orderData.paymentMethod)
    const [transferOption, setTransferOption] = useState('')
    const handleConfirmPaymentMethod = () => {
        setOrderData((prev) => ({ ...prev, paymentMethod, transferOption }))
        handleClosePaymentMethod()
    }
    return (
        <>
            <Modal show={showPaymentMethod} onHide={handleClosePaymentMethod} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fs-2">Chọn phương thức thanh toán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex p-3 align-items-center border-bottom">
                            <label className="d-flex align-items-center me-3">
                                <input
                                    type="checkbox"
                                    className="input-checkbox"
                                    checked={paymentMethod === 'paymentUponReceipt'}
                                    onChange={(e) => setPaymentMethod(e.target.checked ? 'paymentUponReceipt' : '')}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                            <p className="fs-3">Thanh toán khi nhận hàng</p>
                        </div>
                        <div className="d-flex p-3 align-items-center border-bottom">
                            <label className="d-flex align-items-center me-3">
                                <input
                                    type="checkbox"
                                    className="input-checkbox"
                                    checked={paymentMethod === 'bankTransfer'}
                                    onChange={(e) => setPaymentMethod(e.target.checked ? 'bankTransfer' : '')}
                                />
                                <span className="custom-checkbox"></span>
                            </label>
                            <p className="fs-3">Thanh toán bằng chuyển khoản</p>
                        </div>
                        {paymentMethod === 'bankTransfer' && (
                            <div className="d-flex gap-5 p-3 flex-wrap justify-content-center">
                                <div className="d-flex flex-column gap-3 align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={transferOption === 'momo'}
                                                onChange={(e) => setTransferOption(e.target.checked ? 'momo' : '')}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <p className="fs-3">ví MoMo</p>
                                    </div>
                                    <img src={momo} alt="momo" style={{ width: '60px', height: '60px' }} />
                                </div>
                                <div className="d-flex flex-column gap-3 align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={transferOption === 'paypal'}
                                                onChange={(e) => setTransferOption(e.target.checked ? 'paypal' : '')}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <p className="fs-3">Paypal</p>
                                    </div>
                                    <img src={paypal} alt="paypal" style={{ width: '60px', height: '60px' }} />
                                </div>
                                <div className="d-flex flex-column gap-3 align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={transferOption === 'vietcombank'}
                                                onChange={(e) =>
                                                    setTransferOption(e.target.checked ? 'vietcombank' : '')
                                                }
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <p className="fs-3">Vietcombank</p>
                                    </div>
                                    <img src={vietcombank} alt="vietcombank" style={{ height: '60px' }} />
                                </div>
                                <div className="d-flex flex-column gap-3 align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={transferOption === 'vnpay'}
                                                onChange={(e) => setTransferOption(e.target.checked ? 'vnpay' : '')}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <p className="fs-3">VNPay</p>
                                    </div>
                                    <img src={vnpay} alt="vnpay" style={{ height: '60px' }} />
                                </div>
                                <div className="d-flex flex-column gap-3 align-items-center">
                                    <div className="d-flex align-items-center gap-3">
                                        <label className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                checked={transferOption === 'zalopay'}
                                                onChange={(e) => setTransferOption(e.target.checked ? 'zalopay' : '')}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                        <p className="fs-3">ZaloPay</p>
                                    </div>
                                    <img src={zalopay} alt="zalopay" style={{ width: '60px', height: '60px' }} />
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="px-4 py-2 light border rounded-4 bg-white"
                        variant="secondary"
                        onClick={handleClosePaymentMethod}
                    >
                        <p className="fs-3">Đóng</p>
                    </button>
                    <button
                        className="primary-btn px-4 py-2 shadow-none rounded-4"
                        variant="secondary"
                        onClick={handleConfirmPaymentMethod}
                        disabled={!paymentMethod || (paymentMethod === 'bankTransfer' && !transferOption)}
                    >
                        <p>Xác nhận</p>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default PaymentMethodModal

import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { blockClientAction, blockManyClientAction } from '../redux/slices/userSlice'

export default function BlockClientModal({ show, onClose, userIds, setNotification, setBulkAction, setSelectedClient }) {
    const dispatch = useDispatch()
    const [reason, setReason] = useState([])
    const [otherReason, setOtherReason] = useState('')
    const [loading, setLoading] = useState(false)

    const handleBlockClient = async () => {
        setLoading(true)
        try {
            if (userIds.length > 1) {
                await dispatch(blockManyClientAction({ userIds, reasons: otherReason ? [...reason, otherReason] : reason })).unwrap()
                setBulkAction('')
                setSelectedClient([])
            } else {
                await dispatch(blockClientAction({ userId: userIds[0], reasons: otherReason ? [...reason, otherReason] : reason })).unwrap()
            }
            setNotification({
                type: 'success',
                description: `Chặn ${userIds.length > 1 ? 'các' : ''} khách hàng thành công`,
                show: true,
                title: 'Thành công',
            })
            onClose()
        } catch (error) {
            setNotification({
                type: 'error',
                description: error.message,
                show: true,
                title: 'Thất bại',
            })
            if (userIds.length > 1) {
                setBulkAction('')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chặn khách hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="fs-4 fw-medium">Lý do chặn khách hàng</p>
                <div className="d-flex mt-3 align-items-cente2">
                    <label className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="input-checkbox"
                            value={'Vi phạm chính sách và điều khoản của shop'}
                            checked={reason.includes('Vi phạm chính sách và điều khoản của shop')}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setReason([...reason, e.target.value])
                                } else {
                                    setReason(reason.filter((item) => item !== e.target.value))
                                }
                            }}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Vi phạm chính sách và điều khoản của shop</p>
                </div>
                <div className="d-flex mt-3 align-items-cente2">
                    <label className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="input-checkbox"
                            value={'Hủy đơn hàng liên tiếp'}
                            checked={reason.includes('Hủy đơn hàng liên tiếp')}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setReason([...reason, e.target.value])
                                } else {
                                    setReason(reason.filter((item) => item !== e.target.value))
                                }
                            }}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Hủy đơn hàng liên tiếp</p>
                </div>
                <div className="d-flex mt-3 align-items-cente2">
                    <label className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="input-checkbox"
                            value={'Đánh giá tiêu cực không có cơ sở'}
                            checked={reason.includes('Đánh giá tiêu cực không có cơ sở')}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setReason([...reason, e.target.value])
                                } else {
                                    setReason(reason.filter((item) => item !== e.target.value))
                                }
                            }}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Đánh giá tiêu cực không có cơ sở</p>
                </div>
                <div className="d-flex mt-3 align-items-cente2">
                    <label className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            className="input-checkbox"
                            value={'Có hành vi gian lận hoặc lạm dụng'}
                            checked={reason.includes('Có hành vi gian lận hoặc lạm dụng')}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setReason([...reason, e.target.value])
                                } else {
                                    setReason(reason.filter((item) => item !== e.target.value))
                                }
                            }}
                        />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Có hành vi gian lận hoặc lạm dụng</p>
                </div>
                <div className=" mt-2">
                    <p className="fs-4 fw-medium me-2">Khác:</p>
                    <div className="input-form d-flex align-items-center flex-grow-1 h-auto">
                        <textarea type="text" rows={4} className="input-text w-100" placeholder="Nhập lý do" value={otherReason} onChange={(e) => setOtherReason(e.target.value)} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button disabled={loading || (reason.length === 0 && otherReason === '')} className="primary-btn shadow-none rounded-0 px-3 py-2" onClick={handleBlockClient}>
                    <p>Chặn</p>
                    {loading && (
                        <div className="dot-spinner ms-4">
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                            <div className="dot-spinner__dot"></div>
                        </div>
                    )}
                </button>
                <button className="border bg-white rounded-0 px-3 py-2" onClick={onClose}>
                    <p>Hủy</p>
                </button>
            </Modal.Footer>
        </Modal>
    )
}

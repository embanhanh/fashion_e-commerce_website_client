import Modal from 'react-bootstrap/Modal'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateClientTypeAction, updateManyClientTypeAction } from '../redux/slices/userSlice'

function UpdateClientTypeModal({ userIds, show, onClose, setNotification, setBulkAction, setSelectedClient }) {
    const dispatch = useDispatch()
    const [clientType, setClientType] = useState('')
    const [loading, setLoading] = useState(false)

    const handleUpdateClientType = async () => {
        try {
            setLoading(true)
            if (userIds.length > 1) {
                await dispatch(updateManyClientTypeAction({ userIds, clientType })).unwrap()
                setBulkAction('')
                setSelectedClient([])
            } else {
                await dispatch(updateClientTypeAction({ userId: userIds[0], clientType })).unwrap()
            }
            setNotification({
                show: true,
                title: 'Thành công',
                description: 'Cập nhật loại khách hàng thành công',
                type: 'success',
            })
            onClose()
        } catch (error) {
            setNotification({
                show: true,
                title: 'Thất bại',
                description: 'Cập nhật loại khách hàng thất bại: ' + error.message,
                type: 'error',
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
                <Modal.Title>Thay đổi loại khách hàng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex align-items-center">
                    <label className="d-flex align-items-center">
                        <input type="checkbox" className="input-checkbox" value="new" onChange={(e) => setClientType(e.target.value)} />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Khách hàng mới</p>
                </div>
                <div className="d-flex align-items-center">
                    <label className="d-flex align-items-center">
                        <input type="checkbox" className="input-checkbox" value="potential" onChange={(e) => setClientType(e.target.value)} />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Khách hàng tiềm năng</p>
                </div>
                <div className="d-flex align-items-center">
                    <label className="d-flex align-items-center">
                        <input type="checkbox" className="input-checkbox" value="loyal" onChange={(e) => setClientType(e.target.value)} />
                        <span className="custom-checkbox"></span>
                    </label>
                    <p className="ms-3 fs-4">Khách hàng thân thiết</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="primary-btn shadow-none rounded-0 px-3 py-2" onClick={handleUpdateClientType} disabled={loading}>
                    <p>Cập nhật</p>
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

export default UpdateClientTypeModal

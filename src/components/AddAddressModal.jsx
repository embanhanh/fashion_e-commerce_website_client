import { Form, Button, Modal, ListGroup } from 'react-bootstrap'
import { useState, useEffect, useRef } from 'react'
import TomTomMap from './TomTomMap'
import Swal from 'sweetalert2'

function AddAddressModal({ show, handleClose, onAddAddress }) {
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [location, setLocation] = useState('')
    const [type, setType] = useState('') // State cho loại địa chỉ
    const [isDefault, setIsDefault] = useState(false)
    const [address, setAddress] = useState({ lat: 21.0285, lng: 105.8542 })
    const [errors, setErrors] = useState({})
    const [suggestions, setSuggestions] = useState([])
    const [showSuggestions, setShowSuggestions] = useState(false)
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)

    useEffect(() => {
        if (show) {
            // Reset form và lỗi khi modal mở
            setName('')
            setPhone('')
            setLocation('')
            setType('') // Reset loại địa chỉ
            setIsDefault(false)
            setErrors({})
            setShowSuggestions(false)
            setSuggestions([]) // Placeholder: bạn có thể fetch gợi ý địa chỉ ở đây
        }
    }, [show])

    const handleAddressChange = (e) => {
        const value = e.target.value
        setLocation(value)
        setShowSuggestions(true)

        if (value) {
            // Fetch và lọc gợi ý địa chỉ dựa trên input
            setSuggestions([]) // Thay bằng gợi ý địa chỉ thực tế
        } else {
            setSuggestions([])
        }
    }

    const handleSuggestionClick = (suggestion) => {
        setLocation(suggestion)
        setShowSuggestions(false)
    }

    const validateForm = () => {
        const newErrors = {}
        if (!name) {
            newErrors.name = 'Vui lòng nhập họ và tên'
        }
        if (!phone) {
            newErrors.phone = 'Vui lòng nhập số điện thoại'
        }
        if (!location) {
            newErrors.location = 'Vui lòng nhập địa chỉ'
        }
        if (!type) {
            newErrors.type = 'Vui lòng chọn loại địa chỉ' // Kiểm tra loại địa chỉ
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validateForm()) {
            try {
                const newAddressData = {
                    name,
                    phone,
                    location,
                    type,
                    default: isDefault,
                    address: address,
                }
                Swal.fire({
                    title: 'Thông báo',
                    text: 'Bạn có chắc chắn muốn thêm địa chỉ này không?',
                    icon: 'warning',
                    showCancelButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        onAddAddress(newAddressData)
                        handleClose()
                    }
                })
            } catch (error) {
                setErrors({ submit: 'Có lỗi xảy ra khi thêm địa chỉ' })
                console.log(error)
            }
        }
    }

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-1">Thêm địa chỉ mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="overflow-y-auto" style={{ maxHeight: '400px' }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3 fs-4">
                            <p className="fs-4 fw-medium text-nowrap mb-2 label-width">Họ và tên:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" className="input-text w-100" placeholder="Họ và tên" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            {errors.name && <p className="text-danger">{errors.name}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3 fs-4">
                            <p className="fs-4 fw-medium text-nowrap mb-2 label-width">Số điện thoại:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input type="text" className="input-text w-100" placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            {errors.phone && <p className="text-danger">{errors.phone}</p>}
                        </Form.Group>

                        <Form.Group className="mb-3 fs-4">
                            <p className="fs-4 fw-medium text-nowrap mb-2 label-width">Địa chỉ:</p>
                            <div className="input-form d-flex align-items-center w-100">
                                <input
                                    type="text"
                                    className="input-text w-100"
                                    placeholder="Tỉnh/ Thành phố, Quận/ Huyện, Phường/ Xã"
                                    value={location}
                                    onChange={handleAddressChange}
                                    onFocus={() => setShowSuggestions(true)}
                                    ref={inputRef}
                                />
                            </div>
                            {showSuggestions && suggestions.length > 0 && (
                                <ListGroup className="suggestions-list" ref={suggestionsRef}>
                                    {suggestions.map((suggestion, index) => (
                                        <ListGroup.Item key={index} action onClick={() => handleSuggestionClick(suggestion)}>
                                            {suggestion}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                            {errors.location && <p className="text-danger">{errors.location}</p>}
                            <div className="my-3">
                                <TomTomMap initialLocation={address} onLocationChange={setAddress} height="200px" setLocation={setLocation} />
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3 fs-4">
                            <Form.Label>Loại địa chỉ</Form.Label>
                            <div className="select">
                                <div className="selected">
                                    <span>{type ? (type === 'home' ? 'Nhà riêng' : 'Cơ quan') : 'Chọn loại địa chỉ'}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="home">
                                        <input id="home-address" name="address-type" type="radio" checked={type === 'home'} value="home" onChange={(e) => setType(e.target.value)} />
                                        <label className="option" htmlFor="home-address" data-txt="Nhà riêng" />
                                    </div>
                                    <div title="work">
                                        <input id="work-address" name="address-type" type="radio" checked={type === 'work'} value="work" onChange={(e) => setType(e.target.value)} />
                                        <label className="option" htmlFor="work-address" data-txt="Cơ quan" />
                                    </div>
                                </div>
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3 fs-4">
                            <div className="checkbox-cell">
                                <label className="d-flex align-items-center">
                                    <input type="checkbox" className="input-checkbox" name="isDefault" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                                    <span className="custom-checkbox" />
                                    <span className="ms-2">Đặt làm địa chỉ mặc định.</span>
                                </label>
                            </div>
                        </Form.Group>
                    </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {errors.submit && <p className="text-danger">{errors.submit}</p>}
                <div className="d-flex flex-row">
                    <Button className="btn btn-outline-danger mx-3" onClick={handleClose}>
                        Trở lại
                    </Button>
                    <Button className="btn btn-outline-success mx-3" style={{ minWidth: '130px' }} onClick={handleSubmit}>
                        Hoàn thành
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default AddAddressModal

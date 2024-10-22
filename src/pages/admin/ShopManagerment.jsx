import './ShopManagerment.scss'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faSave, faUpload } from '@fortawesome/free-solid-svg-icons'
import { useDispatch, useSelector } from 'react-redux'
import { getShopInfo, updateShopInfo } from '../../redux/slices/shopSlice'
import { Modal } from 'react-bootstrap'
import Notification from '../../components/Notification'

function ShopManagerment() {
    const initializeWorkingHours = () => {
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        const defaultHours = {
            open: '09:00',
            close: '18:00',
        }
        return days.reduce((acc, day) => {
            acc[day] = defaultHours
            return acc
        }, {})
    }
    const dispatch = useDispatch()
    const { shopInfo, loading, error } = useSelector((state) => state.shop)
    const [isEditing, setIsEditing] = useState(false)
    const [editedShopInfo, setEditedShopInfo] = useState({
        name: '',
        description: '',
        address: '',
        email: '',
        phone: '',
        socialMedia: {
            facebook: '',
            instagram: '',
            twitter: '',
        },
        shippingPolicy: '',
        returnPolicy: '',
        promotionPolicy: '',
        workingHours: initializeWorkingHours(),
    })
    const [newLogo, setNewLogo] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [toastVariant, setToastVariant] = useState('success')

    useEffect(() => {
        dispatch(getShopInfo())
    }, [dispatch])

    useEffect(() => {
        if (shopInfo) {
            setEditedShopInfo({
                ...shopInfo,
                workingHours: shopInfo.workingHours || initializeWorkingHours(),
            })
        }
    }, [shopInfo])

    const handleEdit = () => {
        setIsEditing(true)
    }

    const handleSave = () => {
        const updatedShopInfo = {
            ...editedShopInfo,
            logo: newLogo ? newLogo.file : editedShopInfo.logo,
            oldLogoUrl: newLogo ? editedShopInfo.logo : null,
        }

        dispatch(updateShopInfo(updatedShopInfo))
            .unwrap()
            .then(() => {
                setIsEditing(false)
                setNewLogo(null)
                setToastMessage('Cập nhật thông tin shop thành công')
                setToastVariant('success')
                setShowToast(true)
            })
            .catch((error) => {
                setToastMessage('Cập nhật thông tin shop thất bại: ' + error.message)
                setToastVariant('error')
                setShowToast(true)
            })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditedShopInfo((pre) => ({ ...pre, [name]: value }))
    }

    const handleNestedInputChange = (category, field, value) => {
        setEditedShopInfo((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value,
            },
        }))
    }

    const handleLogoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setNewLogo({
                file: file,
                previewUrl: previewUrl,
            })
        }
        e.target.value = ''
    }

    const handleWorkingHoursChange = (day, field, value) => {
        setEditedShopInfo((prev) => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value,
                },
            },
        }))
    }
    const daysOfWeek = [
        { key: 'monday', label: 'Thứ 2' },
        { key: 'tuesday', label: 'Thứ 3' },
        { key: 'wednesday', label: 'Thứ 4' },
        { key: 'thursday', label: 'Thứ 5' },
        { key: 'friday', label: 'Thứ 6' },
        { key: 'saturday', label: 'Thứ 7' },
        { key: 'sunday', label: 'Chủ nhật' },
    ]

    return (
        <div className=" pb-5">
            <div className="bg-white border">
                {loading ? (
                    <div className="dot-spinner ms-4">
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                    </div>
                ) : (
                    <>
                        <div className="d-flex justify-content-between align-items-center border-bottom p-3 position-relative">
                            <p className="fs-3 fw-medium  ">Hồ sơ Shop</p>
                        </div>
                        <div className="p-3 position-relative">
                            <p className="fs-4 fw-medium d-inline-block" style={{ width: '90%' }}>
                                Thông tin cơ bản
                            </p>
                            <div className="sticky-button-container d-inline-block ">
                                {isEditing && (
                                    <button className="me-2 py-2 px-3 border bg-white d-inline-flex align-items-center gap-2" onClick={() => setIsEditing(false)}>
                                        <p className="fs-4 fw-medium">Hủy</p>
                                    </button>
                                )}
                                <button className=" py-2 px-3 border bg-white d-inline-flex align-items-center gap-2" onClick={isEditing ? handleSave : handleEdit}>
                                    <p className="fs-4 fw-medium">{isEditing ? 'Lưu' : 'Chỉnh sửa'}</p>
                                    <FontAwesomeIcon icon={isEditing ? faSave : faPen} />
                                </button>
                            </div>

                            <div className="p-5 ms-5">
                                <div className="d-flex align-items-center">
                                    <p className="fs-4 fw-medium form-label">Tên Shop</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            className="input-text w-100"
                                            name="name"
                                            placeholder="Tên Shop"
                                            value={editedShopInfo?.name}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center my-4">
                                    <p className="fs-4 fw-medium form-label">Logo Shop</p>
                                    <div className=" align-items-center w-100">
                                        <img src={newLogo ? newLogo.previewUrl : shopInfo?.logo} alt="logo-shop" style={{ height: '100px' }} />
                                        {isEditing && (
                                            <label htmlFor="logo-upload" className="cursor-pointer fs-3 ms-3">
                                                <FontAwesomeIcon icon={faPen} />
                                                <input id="logo-upload" type="file" className="d-none" onChange={handleLogoChange} accept="image/*" />
                                            </label>
                                        )}
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <p className="fs-4 fw-medium form-label">Mô tả Shop</p>
                                    <div className="input-form w-100 h-auto">
                                        <textarea
                                            type="text"
                                            name="description"
                                            className="input-text w-100 py-2 h-100"
                                            rows={5}
                                            placeholder="Mô tả Shop"
                                            value={editedShopInfo?.description}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center my-4">
                                    <p className="fs-4 fw-medium form-label">Địa chỉ</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            name="address"
                                            className="input-text w-100"
                                            placeholder="Địa chỉ"
                                            value={editedShopInfo?.address}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <p className="fs-4 fw-medium form-label">Email</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            name="email"
                                            className="input-text w-100"
                                            placeholder="Email"
                                            value={editedShopInfo?.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center my-4">
                                    <p className="fs-4 fw-medium form-label">Số điện thoại</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            name="phone"
                                            className="input-text w-100"
                                            placeholder="Số điện thoại"
                                            value={editedShopInfo?.phone}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="fs-4 fw-medium">Mạng xã hội</p>
                            <div className="p-5 ms-5">
                                <div className="d-flex align-items-center">
                                    <p className="fs-4 fw-medium form-label">Facebook</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            name="facebook"
                                            className="input-text w-100"
                                            placeholder="Url Facebook"
                                            value={editedShopInfo?.socialMedia?.facebook}
                                            onChange={(e) => handleNestedInputChange('socialMedia', 'facebook', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center my-4">
                                    <p className="fs-4 fw-medium form-label">Instagram</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            name="instagram"
                                            className="input-text w-100"
                                            placeholder="Url Instagram"
                                            value={editedShopInfo?.socialMedia?.instagram}
                                            onChange={(e) => handleNestedInputChange('socialMedia', 'instagram', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-center">
                                    <p className="fs-4 fw-medium form-label">Twitter</p>
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            name="twitter"
                                            className="input-text w-100"
                                            placeholder="Url Twitter"
                                            value={editedShopInfo?.socialMedia?.twitter}
                                            onChange={(e) => handleNestedInputChange('socialMedia', 'twitter', e.target.value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="fs-4 fw-medium">Chính sách</p>
                            <div className="p-5 ms-5">
                                <div className="d-flex align-items-start">
                                    <p className="fs-4 fw-medium form-label">Chính sách vận chuyển</p>
                                    <div className="input-form w-100 h-auto">
                                        <textarea
                                            type="text"
                                            name="shippingPolicy"
                                            className="input-text w-100 py-2 h-100"
                                            rows={5}
                                            placeholder="Chính sách vận chuyển"
                                            value={editedShopInfo?.shippingPolicy}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-start my-4">
                                    <p className="fs-4 fw-medium form-label">Chính sách đổi trả</p>
                                    <div className="input-form w-100 h-auto">
                                        <textarea
                                            type="text"
                                            name="returnPolicy"
                                            className="input-text w-100 py-2 h-100"
                                            rows={5}
                                            placeholder="Chính sách đổi trả"
                                            value={editedShopInfo?.returnPolicy}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                                <div className="d-flex align-items-start">
                                    <p className="fs-4 fw-medium form-label">Chính sách khuyến mãi</p>
                                    <div className="input-form w-100 h-auto">
                                        <textarea
                                            type="text"
                                            name="promotionPolicy"
                                            className="input-text w-100 py-2 h-100"
                                            rows={5}
                                            placeholder="Chính sách khuyến mãi"
                                            value={editedShopInfo?.promotionPolicy}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="fs-4 fw-medium">Giờ làm việc</p>
                            <div className="px-5 py-3 ms-5">
                                {daysOfWeek.map(({ key, label }) => (
                                    <div className="d-flex align-items-center my-3" key={key}>
                                        <p className="fs-4 fw-medium form-label">{label}</p>
                                        <div className="input-form d-flex align-items-center">
                                            <input
                                                type="time"
                                                className="input-text px-3"
                                                value={editedShopInfo && editedShopInfo.workingHours && editedShopInfo.workingHours[key] ? editedShopInfo.workingHours[key].open : '08:00'}
                                                onChange={(e) => handleWorkingHoursChange(key, 'open', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                        <span className="mx-3">-</span>
                                        <div className="input-form d-flex align-items-center">
                                            <input
                                                type="time"
                                                className="input-text px-3"
                                                value={editedShopInfo && editedShopInfo.workingHours && editedShopInfo.workingHours[key] ? editedShopInfo.workingHours[key].close : '22:00'}
                                                onChange={(e) => handleWorkingHoursChange(key, 'close', e.target.value)}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
            <Modal show={showToast} onHide={() => setShowToast(false)} centered>
                <Notification type={toastVariant} title="Thông báo" description={toastMessage} />
            </Modal>
        </div>
    )
}

export default ShopManagerment

import './CreatePromotionalCombos.scss'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import ProductModal from '../../components/ProductModal'
import { useDispatch, useSelector } from 'react-redux'
import { createPromotionalComboAction, getPromotionalComboByIdAction, updatePromotionalComboAction } from '../../redux/slices/promotionalComboSlice'
import Notification from '../../components/Notification'
import Modal from 'react-bootstrap/Modal'

function CreatePromotionalCombos() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { combo_id } = useParams()
    const { promotionalCombo } = useSelector((state) => state.promotionalCombo)
    const [comboData, setComboData] = useState({
        name: '',
        startDate: new Date(),
        endDate: new Date(),
        limitCombo: 0,
        comboType: 'percentage',
        discountCombos: [
            {
                quantity: 0,
                discountValue: 0,
            },
        ],
        products: [],
    })
    const [errors, setErrors] = useState({})
    const [showProductModal, setShowProductModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showNotification, setShowNotification] = useState({
        show: false,
        description: '',
        type: 'success',
        title: '',
    })

    useEffect(() => {
        if (combo_id) {
            dispatch(getPromotionalComboByIdAction(combo_id))
        }
    }, [combo_id])

    useEffect(() => {
        if (promotionalCombo) {
            setComboData({
                ...promotionalCombo,
                products: promotionalCombo.products.map((product) => product._id),
            })
        }
    }, [promotionalCombo])

    const validateField = (name, value) => {
        let error = ''
        switch (name) {
            case 'name':
                if (!value) error = 'Tên combo không được để trống'
                break
            case 'startDate':
            case 'endDate':
                if (!value) error = 'Vui lòng chọn ngày'
                break
            case 'limitCombo':
                if (!value) error = 'Giới hạn đặt hàng không được để trống'
                break
            case 'discountCombos':
                if (comboData.discountCombos.length === 0 || comboData.discountCombos.some((discount) => !discount.quantity || !discount.discountValue))
                    error = 'Phải có ít nhất 1 mức ưu đãi và không được để trống số lượng và giá trị giảm'
                break
            case 'products':
                if (comboData.products.length === 0) error = 'Phải chọn ít nhất 1 sản phẩm'
                break
        }
        return error
    }

    const validateForm = () => {
        const newErrors = {}
        Object.keys(comboData).forEach((key) => {
            const error = validateField(key, comboData[key])
            if (error) newErrors[key] = error
        })
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChangeComboData = (name, value) => {
        delete errors[name]
        setComboData({ ...comboData, [name]: value })
    }

    const handleConfirm = (products) => {
        setComboData({ ...comboData, products })
        setShowProductModal(false)
    }

    const handleSubmit = async () => {
        if (validateForm()) {
            setLoading(true)
            try {
                if (combo_id) {
                    await dispatch(updatePromotionalComboAction({ combo_id, promotionalComboData: comboData })).unwrap()
                } else {
                    await dispatch(createPromotionalComboAction(comboData)).unwrap()
                }
                setShowNotification({
                    show: true,
                    description: `${combo_id ? 'Cập nhật' : 'Tạo'} combo khuyến mãi thành công`,
                    type: 'success',
                    title: 'Thành công',
                })
            } catch (error) {
                setShowNotification({
                    show: true,
                    description: error.message,
                    type: 'error',
                    title: 'Thất bại',
                })
            } finally {
                setLoading(false)
            }
        }
    }

    return (
        <div className="d-flex flex-column gap-4 align-items-center pb-5">
            <div className="bg-white rounded-4 shadow-sm create-promotional-combos-container">
                <p className="fs-3 fw-medium p-3 border-bottom">Tạo Combo khuyến mãi</p>
                <div className="p-4">
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Tên combo:
                        </p>
                        <div className="w-100 d-flex align-items-center">
                            <div className={`input-form d-flex align-items-center ${errors.name ? 'border-danger-subtle' : ''}`}>
                                <input type="text" value={comboData.name} onChange={(e) => handleChangeComboData('name', e.target.value)} className="input-text w-100" placeholder="Tên combo" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Thời gian chạy combo:
                        </p>
                        <div className="w-100 d-flex">
                            <DatePicker
                                selected={comboData.startDate}
                                onChange={(date) => handleChangeComboData('startDate', date)}
                                selectsStart
                                startDate={comboData.startDate}
                                endDate={comboData.endDate}
                                className="input-form fs-4 ps-3"
                                placeholderText="Chọn ngày bắt đầu"
                            />
                            <span className="mx-3 fs-2">-</span>
                            <DatePicker
                                selected={comboData.endDate}
                                onChange={(date) => handleChangeComboData('endDate', date)}
                                selectsEnd
                                startDate={comboData.startDate}
                                endDate={comboData.endDate}
                                minDate={comboData.startDate}
                                className="input-form fs-4 ps-3"
                                placeholderText="Chọn ngày kết thúc"
                            />
                        </div>
                    </div>
                    <div className="d-flex mt-5  align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Loại combo:
                        </p>
                        <div className="w-100 d-flex align-items-center">
                            <div className="select">
                                <div className="selected" data-one="Theo phần trăm" data-two="Theo số tiền">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512" className="arrow">
                                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                                    </svg>
                                </div>
                                <div className="options">
                                    <div title="option-1">
                                        <input
                                            id="option-1"
                                            name="option"
                                            type="radio"
                                            value="percentage"
                                            checked={comboData.comboType === 'percentage'}
                                            onChange={(e) => handleChangeComboData('comboType', e.target.value)}
                                        />
                                        <label className="option" htmlFor="option-1" data-txt="Theo phần trăm" />
                                    </div>
                                    <div title="option-2">
                                        <input
                                            id="option-2"
                                            name="option"
                                            type="radio"
                                            value="fixedamount"
                                            checked={comboData.comboType === 'fixedamount'}
                                            onChange={(e) => handleChangeComboData('comboType', e.target.value)}
                                        />
                                        <label className="option" htmlFor="option-2" data-txt="Theo số tiền" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex mt-5 align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Các mức ưu đãi:
                        </p>
                        <div className="py-3 px-4 border rounder-1 w-100">
                            {comboData.discountCombos.map((discount, index) => (
                                <div key={index} className="d-flex align-items-center py-2 my-2">
                                    <p className="fs-4 me-2">Mua</p>
                                    <div className={`input-form d-flex align-items-center ${errors.discountCombos && !comboData.discountCombos[index].quantity ? 'border-danger-subtle' : ''}`}>
                                        <input
                                            type="number"
                                            value={discount.quantity}
                                            onChange={(e) =>
                                                handleChangeComboData(
                                                    'discountCombos',
                                                    comboData.discountCombos.map((discount, ind) => (ind === index ? { ...discount, quantity: e.target.value } : discount))
                                                )
                                            }
                                            className="input-text w-100"
                                            placeholder="Số lượng"
                                        />
                                    </div>
                                    <p className="fs-4 mx-2">để được giảm</p>
                                    <div className={`input-form d-flex align-items-center ${errors.discountCombos && !comboData.discountCombos[index].discountValue ? 'border-danger-subtle' : ''}`}>
                                        <span className="fs-4 px-2 border-end text-body-tertiary fw-medium">{comboData.comboType === 'percentage' ? '%' : 'VNĐ'}</span>
                                        <input
                                            type="number"
                                            value={discount.discountValue}
                                            onChange={(e) =>
                                                handleChangeComboData(
                                                    'discountCombos',
                                                    comboData.discountCombos.map((discount, ind) => (ind === index ? { ...discount, discountValue: e.target.value } : discount))
                                                )
                                            }
                                            className="input-text w-100"
                                            placeholder="Giá trị giảm"
                                        />
                                    </div>
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        className="fs-3 mx-2 p-2 hover-icon"
                                        color="#e74c3c"
                                        onClick={() =>
                                            handleChangeComboData(
                                                'discountCombos',
                                                comboData.discountCombos.filter((_, ind) => ind !== index)
                                            )
                                        }
                                    />
                                </div>
                            ))}
                            {comboData.discountCombos.length < 3 && (
                                <button className="p-3 border bg-white" onClick={() => handleChangeComboData('discountCombos', [...comboData.discountCombos, { quantity: 0, discountValue: 0 }])}>
                                    <p className="fs-4 fw-medium">
                                        Thêm mức ưu đãi <FontAwesomeIcon className="ms-2 fs-5" icon={faPlus} />
                                    </p>
                                </button>
                            )}
                        </div>
                    </div>
                    {errors.discountCombos && <p className="text-danger mt-3">{errors.discountCombos}</p>}
                    <div className="d-flex mt-5 align-items-center">
                        <p className="text-nowrap me-4 w-25">
                            <span style={{ color: 'red' }}>*</span> Giới hạn đặt hàng:
                        </p>
                        <div className="w-100 d-flex align-items-center">
                            <div className={`input-form d-flex align-items-center ${errors.limitCombo ? 'border-danger-subtle' : ''}`}>
                                <input
                                    type="number"
                                    value={comboData.limitCombo}
                                    onChange={(e) => handleChangeComboData('limitCombo', e.target.value)}
                                    className="input-text w-100"
                                    placeholder="Số lượng"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-4 shadow-sm create-promotional-combos-container">
                <p className="fs-3 fw-medium p-3 border-bottom">Sản phẩm của Combo khuyến mãi</p>
                <div className="p-4">
                    <p className="fs-4">Đã có {comboData.products.length} sản phẩm được chọn</p>
                    <button className="p-3 border bg-white mt-3" onClick={() => setShowProductModal(true)}>
                        <p className="fs-4 fw-medium">
                            Chọn sản phẩm <FontAwesomeIcon className="ms-2 fs-5" icon={faPlus} />
                        </p>
                    </button>
                    {errors.products && <p className="text-danger mt-3">{errors.products}</p>}
                </div>
            </div>
            <section className="d-flex flex-row-reverse mt-4">
                <div className="">
                    <div className="d-flex flex-row-reverse">
                        <button className="primary-btn px-4 py-2 shadow-none ms-4 rounded-4" onClick={handleSubmit}>
                            <p>Xác nhận</p>
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
                        <button className="border px-4 py-2 ms-4 bg-white rounded-4" onClick={() => navigate(-1)}>
                            <p>Hủy</p>
                        </button>
                    </div>
                </div>
            </section>
            {showProductModal && <ProductModal show={showProductModal} onHide={() => setShowProductModal(false)} handleConfirm={handleConfirm} comboData={comboData} />}
            {showNotification.show && (
                <Modal show={showNotification.show} onHide={() => setShowNotification({ ...showNotification, show: false })} centered>
                    <Notification title={showNotification.title} description={showNotification.description} type={showNotification.type} />
                </Modal>
            )}
        </div>
    )
}

export default CreatePromotionalCombos

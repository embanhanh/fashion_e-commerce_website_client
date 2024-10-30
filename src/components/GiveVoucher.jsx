import Modal from 'react-bootstrap/Modal'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getVouchersAction, giveVoucherAction, giveVoucherManyAction } from '../redux/slices/voucherSlice'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase.config'

function GiveVoucher({ isOpen, onClose, userId, setNotification, setBulkAction, setSelectedClient }) {
    const dispatch = useDispatch()
    const { vouchers, status } = useSelector((state) => state.voucher)
    const [filteredVouchers, setFilteredVouchers] = useState([])
    const [filter, setFilter] = useState({
        searchVoucher: '',
        status: 'ongoing',
    })
    const [voucherImages, setVoucherImages] = useState([])
    const [giveVoucherData, setGiveVoucherData] = useState({
        voucher: [],
        message: '',
    })
    const [loading, setLoading] = useState(false)

    const fetchVoucherImages = async () => {
        const vouchersRef = ref(storage, 'vouchers')
        try {
            const result = await listAll(vouchersRef)
            const urlPromises = result.items.map((imageRef) => getDownloadURL(imageRef))
            const urls = await Promise.all(urlPromises)
            setVoucherImages(urls)
        } catch (error) {
            console.error('Error fetching voucher images:', error)
        }
    }

    const handleGiveVoucher = async () => {
        try {
            setLoading(true)
            if (userId.length > 1) {
                await dispatch(giveVoucherManyAction({ userIds: userId, voucherIds: giveVoucherData.voucher, message: giveVoucherData.message })).unwrap()
                setBulkAction('')
                setSelectedClient([])
            } else {
                await dispatch(giveVoucherAction({ userId: userId[0], voucherIds: giveVoucherData.voucher, message: giveVoucherData.message })).unwrap()
            }
            onClose()
            setNotification({
                show: true,
                title: 'Thành công',
                description: 'Tặng voucher thành công',
                type: 'success',
            })
        } catch (error) {
            setNotification({
                show: true,
                title: 'Thất bại',
                description: error.message,
                type: 'error',
            })
            if (userId.length > 1) {
                setBulkAction('')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchVoucherImages()
    }, [])

    useEffect(() => {
        dispatch(getVouchersAction())
    }, [dispatch])

    useEffect(() => {
        setFilteredVouchers(
            vouchers.filter((voucher) => {
                return (
                    ((filter.status === 'ongoing' && new Date(voucher.validFrom) <= new Date() && new Date(voucher.validUntil) >= new Date()) ||
                        (filter.status === 'upcoming' && new Date(voucher.validFrom) > new Date())) &&
                    voucher.code.toLowerCase().trim().includes(filter.searchVoucher.toLowerCase().trim())
                )
            })
        )
    }, [filter, vouchers])

    return (
        <>
            <Modal show={isOpen} onHide={onClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Tặng voucher</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex align-items-center pb-3">
                        <p className="fs-3 ">Mã voucher</p>
                        <div className="input-form d-flex align-items-center mx-3 flex-grow-1">
                            <input
                                type="text"
                                autoComplete="off"
                                className="input-text w-100"
                                placeholder="Nhập mã"
                                value={filter.searchVoucher}
                                onChange={(e) => setFilter({ ...filter, searchVoucher: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <p
                            className={`fs-4 py-2 px-4 flex-grow-1 order-tab-item text-center ${filter.status === 'ongoing' ? 'active' : ''}`}
                            onClick={() => setFilter({ ...filter, status: 'ongoing' })}
                        >
                            Đang diễn ra
                        </p>
                        <p
                            className={`fs-4 py-2 px-4 flex-grow-1 order-tab-item text-center ${filter.status === 'upcoming' ? 'active' : ''}`}
                            onClick={() => setFilter({ ...filter, status: 'upcoming' })}
                        >
                            Sắp diễn ra
                        </p>
                    </div>
                    <div className="my-2" style={{ height: 260, overflowY: 'auto' }}>
                        {filteredVouchers.map((voucher) => {
                            return (
                                <div key={voucher._id} className="d-flex p-3 align-items-center my-2 border rounded-3">
                                    <img
                                        src={
                                            voucher.voucherType === 'all' && voucher.discountType === 'percentage'
                                                ? voucherImages[3]
                                                : voucher.voucherType === 'all' && voucher.discountType === 'fixedamount'
                                                ? voucherImages[2]
                                                : voucher.voucherType === 'product' && voucher.discountType === 'percentage'
                                                ? voucherImages[1]
                                                : voucher.voucherType === 'product' && voucher.discountType === 'fixedamount'
                                                ? voucherImages[0]
                                                : null
                                        }
                                        alt=""
                                        width={120}
                                        height={50}
                                    />
                                    <p className="ms-3 fs-4 fw-medium">{voucher.code}</p>
                                    <div className="mx-4 flex-grow-1">
                                        {voucher.discountType === 'percentage' && (
                                            <p className="fs-4 ">
                                                Giảm <strong>{voucher.discountValue}%</strong> giảm tối đa <strong>{voucher.maxDiscountValue}đ </strong>
                                            </p>
                                        )}
                                        {voucher.discountType === 'fixedamount' && (
                                            <p className="fs-4 ">
                                                Giảm tối đa <strong>{voucher.discountValue}đ </strong>
                                            </p>
                                        )}
                                        <p className="fs-4 ">
                                            Đơn tối thiểu <strong>{voucher.minOrderValue}đ </strong>
                                        </p>
                                        <p className="fs-5 text-body-tertiary">
                                            HSD: đến hết <strong className="text-dark">{new Date(voucher.validUntil).toLocaleDateString('vi-VN')} </strong>
                                        </p>
                                    </div>
                                    <label className="d-flex align-items-center ms-3">
                                        <input
                                            type="checkbox"
                                            className="input-checkbox"
                                            checked={giveVoucherData.voucher.includes(voucher._id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setGiveVoucherData({ ...giveVoucherData, voucher: [...giveVoucherData.voucher, voucher._id] })
                                                } else {
                                                    setGiveVoucherData({ ...giveVoucherData, voucher: giveVoucherData.voucher.filter((v) => v !== voucher._id) })
                                                }
                                            }}
                                        />
                                        <span className="custom-checkbox"></span>
                                    </label>
                                </div>
                            )
                        })}
                    </div>
                    <div className="input-form d-flex align-items-center flex-grow-1 h-auto">
                        <textarea
                            type="text"
                            rows={4}
                            className="input-text w-100"
                            placeholder="Nhập lời nhắn"
                            value={giveVoucherData.message}
                            onChange={(e) => setGiveVoucherData({ ...giveVoucherData, message: e.target.value })}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button disabled={loading} className="primary-btn shadow-none rounded-0 px-3 py-2" onClick={handleGiveVoucher}>
                        <p>Tặng</p>
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
                    <button className="secondary-btn bg-white border px-3 py-2" onClick={onClose}>
                        <p>Hủy</p>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default GiveVoucher

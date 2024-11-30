import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { useSelector, useDispatch } from 'react-redux'
import { fetchVouchers } from '../redux/slices/userSlice'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase.config'

const VoucherModal = ({ showVoucher, handleCloseVoucher, orderData, setOrderData, cart, originalVouchers }) => {
    const dispatch = useDispatch()
    const { vouchers } = useSelector((state) => state.user)
    const [voucherList, setVoucherList] = useState([])
    const [voucherSelected, setVoucherSelected] = useState(originalVouchers)
    const [searchVoucher, setSearchVoucher] = useState('')
    const [voucherImages, setVoucherImages] = useState([])

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

    const handleSelectVoucher = (e, voucher) => {
        if (e.target.checked) {
            setVoucherSelected((prev) => {
                if (voucher.voucherType === 'all' || voucher.discountType === 'product') {
                    const findVoucher = prev.find((v) => v.voucherType === 'all' || v.discountType === 'product')
                    if (findVoucher) {
                        return [...prev.filter((v) => v.voucherType !== 'all' && v.discountType !== 'product'), voucher]
                    }
                } else if (voucher.voucherType === 'shipping') {
                    const findVoucher = prev.find((v) => v.voucherType === 'shipping')
                    if (findVoucher) {
                        return [...prev.filter((v) => v.voucherType !== 'shipping'), voucher]
                    }
                }
                return [...prev, voucher]
            })
        } else {
            setVoucherSelected((prev) => prev.filter((v) => v._id !== voucher._id))
        }
    }

    const isVoucherValid = (voucher) => {
        const now = new Date()
        return (
            voucher.minOrderValue <= orderData.totalPrice &&
            new Date(voucher.validFrom) <= now &&
            new Date(voucher.validUntil) >= now &&
            voucher.used < voucher.usageLimit &&
            (voucher.voucherType === 'all' ||
                voucher.voucherType === 'shipping' ||
                (voucher.voucherType === 'product' &&
                    orderData.products.every((product) =>
                        voucher.applicableProducts.some(
                            (p) =>
                                p._id ===
                                cart.items.find((item) => item.variant?._id === product.product)?.variant?.product?._id
                        )
                    )))
        )
    }

    useEffect(() => {
        fetchVoucherImages()
    }, [])

    useEffect(() => {
        dispatch(fetchVouchers())
    }, [dispatch])

    useEffect(() => {
        console.log(vouchers)
        setVoucherList(vouchers)
    }, [vouchers])

    useEffect(() => {
        setVoucherList(vouchers.filter((voucher) => voucher.voucher.code.includes(searchVoucher)))
    }, [searchVoucher])

    return (
        <Modal show={showVoucher} onHide={handleCloseVoucher} centered>
            <Modal.Header closeButton>
                <Modal.Title className="fs-2">Chọn voucher giảm giá</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="">
                    <div className="d-flex align-items-center pb-3 border-bottom">
                        <p className="fs-3 ">Mã voucher</p>
                        <div className="input-form d-flex align-items-center mx-3 flex-grow-1">
                            <input
                                type="text"
                                autoComplete="off"
                                className="input-text w-100"
                                placeholder="Nhập mã"
                                value={searchVoucher}
                                onChange={(e) => setSearchVoucher(e.target.value)}
                            />
                        </div>
                    </div>
                    <p className="fs-3 my-3">Mã của bạn</p>
                    <div className="my-2" style={{ maxHeight: 260, overflowY: 'auto' }}>
                        {voucherList.length > 0 ? (
                            voucherList.map((voucher) => {
                                const isValid = isVoucherValid(voucher.voucher)
                                return (
                                    <div
                                        key={voucher.voucher?._id}
                                        className="d-flex p-3 align-items-center my-2 border rounded-3"
                                        style={{ opacity: isValid ? 1 : 0.5 }}
                                    >
                                        <img
                                            src={
                                                voucher.voucher?.voucherType === 'all' &&
                                                voucher.voucher?.discountType === 'percentage'
                                                    ? voucherImages[3]
                                                    : voucher.voucher?.voucherType === 'all' &&
                                                      voucher.voucher?.discountType === 'fixedamount'
                                                    ? voucherImages[2]
                                                    : voucher.voucher?.voucherType === 'product' &&
                                                      voucher.voucher?.discountType === 'percentage'
                                                    ? voucherImages[1]
                                                    : voucher.voucher?.voucherType === 'product' &&
                                                      voucher.voucher?.discountType === 'fixedamount'
                                                    ? voucherImages[0]
                                                    : null
                                            }
                                            alt=""
                                            width={120}
                                            height={50}
                                        />
                                        <div className="mx-4 flex-grow-1">
                                            {voucher.voucher?.discountType === 'percentage' && (
                                                <p className="fs-4 ">
                                                    Giảm <strong>{voucher.voucher?.discountValue}%</strong> giảm tối đa{' '}
                                                    <strong>{voucher.voucher?.maxDiscountValue}đ </strong>
                                                </p>
                                            )}
                                            {voucher.voucher?.discountType === 'fixedamount' && (
                                                <p className="fs-4 ">
                                                    Giảm tối đa <strong>{voucher.voucher?.discountValue}đ </strong>
                                                </p>
                                            )}
                                            <p className="fs-4 ">
                                                Đơn tối thiểu <strong>{voucher.voucher?.minOrderValue}đ </strong>
                                            </p>
                                            <p className="fs-5 text-body-tertiary">
                                                HSD: đến hết{' '}
                                                <strong className="text-dark">
                                                    {new Date(voucher.voucher?.validUntil).toLocaleDateString('vi-VN')}{' '}
                                                </strong>
                                            </p>
                                        </div>
                                        <label className="d-flex align-items-center ms-3">
                                            <input
                                                type="checkbox"
                                                className="input-checkbox"
                                                disabled={!isValid}
                                                checked={!!voucherSelected.find((v) => v._id === voucher.voucher?._id)}
                                                onChange={(e) => handleSelectVoucher(e, voucher.voucher)}
                                            />
                                            <span className="custom-checkbox"></span>
                                        </label>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="fs-4 text-center">Không tìm thấy voucher nào</p>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <div
                    className="primary-btn px-4 py-2 shadow-none light border rounded-3"
                    variant="secondary"
                    onClick={handleCloseVoucher}
                >
                    <p>Đóng</p>
                </div>
                <div
                    className="primary-btn px-4 py-2 shadow-none"
                    variant="secondary"
                    onClick={() => {
                        setOrderData((pre) => ({
                            ...pre,
                            vouchers: voucherSelected,
                        }))
                        handleCloseVoucher()
                    }}
                >
                    <p>Xác nhận</p>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default VoucherModal

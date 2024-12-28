import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase.config'

function VoucherCard({ voucher }) {
    const [showDetailVoucher, setShowDetailVoucher] = useState(false)
    const [voucherImages, setVoucherImages] = useState([])

    console.log(voucher)

    // Fetch voucher images from Firebase
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

    useEffect(() => {
        fetchVoucherImages()
    }, [])

    // Kiểm tra voucher hết hạn hoặc hết số lượng
    const isExpired = () => {
        const now = new Date()
        const validUntil = new Date(voucher?.voucher.validUntil)
        const remainingQuantity = voucher?.voucher.usageLimit - voucher?.voucher.used
        return now > validUntil || remainingQuantity <= 0
    }

    // Get voucher image based on type
    const getVoucherImage = () => {
        if (voucher?.voucherType === 'all' && voucher?.discountType === 'percentage') {
            return voucherImages[3]
        } else if (voucher?.voucherType === 'all' && voucher?.discountType === 'fixedamount') {
            return voucherImages[2]
        } else if (voucher?.voucherType === 'product' && voucher?.discountType === 'percentage') {
            return voucherImages[1]
        } else {
            return voucherImages[0]
        }
    }

    // Format discount text
    const getDiscountText = () => {
        if (voucher?.voucher.discountType === 'percentage') {
            return `Giảm ${voucher?.voucher.discountValue}% tối đa ${voucher?.voucher.maxDiscountValue?.toLocaleString(
                'vi-VN'
            )}đ`
        }
        return `Giảm ${voucher?.voucher.discountValue?.toLocaleString('vi-VN')}đ`
    }

    return (
        <>
            <div
                className="card border-1 rounded-2 my-2"
                style={{
                    minWidth: '400px',
                    opacity: isExpired() ? '0.6' : '1',
                }}
            >
                <div className="row g-0">
                    <div className="col-3">
                        <img
                            src={getVoucherImage()}
                            className="img-fluid p-1 bg-white rounded-2"
                            alt="Voucher"
                            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="col-9">
                        <div className="card-body p-3 fs-4">
                            <div className="d-flex align-items-center mb-1">
                                <span
                                    className="badge me-2"
                                    style={{
                                        backgroundColor: '#ffeee8',
                                        color: '#ee4d2d',
                                    }}
                                >
                                    Còn lại: {voucher?.voucher.usageLimit - voucher?.voucher.used}
                                </span>
                                <span className="text-danger small">{getDiscountText()}</span>
                            </div>

                            <p className="text-secondary small mb-2">
                                Đơn tối thiểu {voucher?.voucher.minOrderValue?.toLocaleString('vi-VN')}đ
                            </p>

                            <div className="d-flex justify-content-between align-items-center">
                                <span className="text-secondary smaller">
                                    HSD: {new Date(voucher?.voucher.validUntil).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default VoucherCard

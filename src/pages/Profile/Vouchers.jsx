import VoucherCard from '../../components/VoucherCard'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVouchers } from '../../redux/slices/userSlice'
import { useEffect } from 'react'

function Vouchers() {
    const dispatch = useDispatch()
    const vouchers = useSelector((state) => state.user.vouchers)

    // const voucherItems = [
    //     {
    //         voucherType: 'all',
    //         discountType: 'percentage',
    //         validFrom: '2024-01-01',
    //         validUntil: '2024-01-01',
    //         usageLimit: 20,
    //         used: 0,
    //         discountValue: 10,
    //         maxDiscountValue: 100000,
    //         minOrderValue: 1000000,
    //     },
    //     {
    //         voucherType: 'all',
    //         discountType: 'fixedamount',
    //         validFrom: '2024-01-01',
    //         validUntil: '2024-01-01',
    //         usageLimit: 100,
    //         used: 0,
    //         discountValue: 10,
    //         maxDiscountValue: 100000,
    //         minOrderValue: 1000000,
    //     },
    //     {
    //         voucherType: 'all',
    //         discountType: 'percentage',
    //         validFrom: '2024-01-01',
    //         validUntil: '2024-01-01',
    //         usageLimit: 100,
    //         used: 0,
    //         discountValue: 10,
    //         maxDiscountValue: 100000,
    //         minOrderValue: 1000000,
    //     },
    //     {
    //         voucherType: 'all',
    //         discountType: 'percentage',
    //         validFrom: '2024-12-16',
    //         validUntil: '2024-12-30',
    //         usageLimit: 100,
    //         used: 0,
    //         discountValue: 10,
    //         maxDiscountValue: 100000,
    //         minOrderValue: 1000000,
    //     },
    //     {
    //         voucherType: 'all',
    //         discountType: 'percentage',
    //         validFrom: '2024-01-01',
    //         validUntil: '2024-01-01',
    //         usageLimit: 100,
    //         used: 0,
    //         discountValue: 10,
    //         maxDiscountValue: 100000,
    //         minOrderValue: 1000000,
    //     },
    //     {
    //         voucherType: 'all',
    //         discountType: 'percentage',
    //         validFrom: '2024-01-01',
    //         validUntil: '2024-01-01',
    //         usageLimit: 100,
    //         used: 0,
    //         discountValue: 10,
    //         maxDiscountValue: 100000,
    //         minOrderValue: 1000000,
    //     },
    // ]
    useEffect(() => {
        dispatch(fetchVouchers())
    }, [dispatch])

    useEffect(() => {
        console.log(vouchers)
    }, [vouchers])
    return (
        <div className="d-flex flex-wrap justify-content-center mt-5" style={{ gap: '10px' }}>
            {vouchers.length > 0 ? (
                vouchers.map((voucher) => <VoucherCard voucher={voucher} />)
            ) : (
                <div className="text-center fs-1 mt-5">Hiện tại bạn không có voucher nào</div>
            )}
        </div>
        // <div className="d-flex flex-wrap justify-content-center mt-5" style={{ gap: '10px' }}>
        //     {voucherItems.map((voucher) => (
        //         <VoucherCard voucher={voucher} />
        //     ))}
        // </div>
    )
}

export default Vouchers

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getShopInfo } from '../../redux/slices/shopSlice'
import TomTomMap from '../../components/TomTomMap'

const Contact = () => {
    const dispatch = useDispatch()
    const { shopInfo } = useSelector((state) => state.shop)
    const [location, setLocation] = useState('')

    useEffect(() => {
        dispatch(getShopInfo())
    }, [dispatch])

    // Khởi tạo vị trí mặc định hoặc lấy từ shopInfo
    const initialLocation = {
        lat: shopInfo?.location?.lat || 10.825248658375957,
        lng: shopInfo?.location?.lng || 106.79194207536178,
    }

    const handleLocationChange = (newLocation) => {
        console.log('Vị trí mới:', newLocation)
        // Xử lý khi vị trí thay đổi nếu cần
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-6">
                    <div className="contact-details">
                        <h1 className="company-name">{shopInfo?.name}</h1>
                        <p className="fs-3">
                            <strong>Địa chỉ:</strong> {shopInfo?.address}
                        </p>
                        <p className="fs-3">
                            <strong>Email:</strong> <a href={`mailto:${shopInfo?.email}`}>{shopInfo?.email}</a>
                        </p>
                        <p className="fs-3">
                            <strong>Website:</strong>
                            <a href={'http://localhost:3000'} target="_blank" rel="noopener noreferrer">
                                www.hearti.com
                            </a>
                        </p>

                        <h4 className="mt-3">Hotline</h4>
                        <p>
                            <strong>Số điện thoại:</strong> {shopInfo?.phone}
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="map-container">
                        <TomTomMap
                            initialLocation={initialLocation}
                            onLocationChange={handleLocationChange}
                            height="400px"
                            setLocation={setLocation}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact

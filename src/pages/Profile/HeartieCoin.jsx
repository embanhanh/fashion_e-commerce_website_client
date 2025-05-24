import React from 'react'
import './HeartieCoin.scss' // Optional: Add custom styles here
import coin_image from '../../assets/image/logo/heirtie_coin.svg'

const HeartieCoin = () => {
    const days = [
        { label: "Hôm nay", reward: 100, claimed: false, current: true },
        { label: "Ngày 2", reward: 100, claimed: false, current: false },
        { label: "Ngày 3", reward: 100, claimed: false, current: false },
        { label: "Ngày 4", reward: 100, claimed: false, current: false },
        { label: "Ngày 5", reward: 100, claimed: false, current: false },
        { label: "Ngày 6", reward: 100, claimed: false, current: false },
        { label: "Ngày 7", reward: 100, claimed: false, current: false },
    ]

    return (
        <div className="container">
            <div className='h-100vh bg-light p-3 rounded shadow-sm my-4'>
                <div className='d-flex justify-content-left gap-4 mt-4'>
                    <img src={coin_image} alt="Heartie Coin" className="" style={{ width: '48px', height: '48px' }} />
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <p className="fs-1">0</p>
                        <p className="fs-2 fw-medium">Xu đang có</p>
                    </div>
                </div>

                <div className="d-fex justify-content-center align-items-center daily-checkin-container">
                    <div className="">
                        <div className="row g-2 mb-3">
                            {days.map((day, index) => (
                                <div key={index} className={`col day-container ${day.current ? "current" : 'normal'}`}>
                                    <div className="d-flex flex-column align-items-center rounded-3 p-2 shadow-sm">
                                        <p className="">+{day.reward}</p>
                                        <div className="">
                                            <img src={coin_image} alt="Coin" className="" style={{ width: '48px', height: '48px' }} />
                                        </div>
                                        <div className="fs-4">{day.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="btn btn-primary w-100 claim-button">Nhận ngày 100 xu</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default HeartieCoin


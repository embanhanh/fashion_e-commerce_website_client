import React from 'react'
import './HeartieCoin.scss' // Optional: Add custom styles here
import coin_image from '../../assets/image/logo/heirtie_coin.svg'
import coin_tick from '../../assets/image/logo/coin_tick.svg'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, checkinCoinsAction } from '../../redux/slices/userSlice'

const HeartieCoin = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const userStorage = JSON.parse(localStorage.getItem('user')) || {}
    const localClaimedDays = JSON.parse(localStorage.getItem('claimedDays')) || []

    // Khởi tạo days dựa trên dữ liệu từ backend
    const initializeDays = () => {
        const currentIndex = user?.currentDayIndex || 0

        return [
            { label: 'Ngày 1', reward: 100, claimed: false, current: currentIndex === 0 },
            { label: 'Ngày 2', reward: 100, claimed: false, current: currentIndex === 1 },
            { label: 'Ngày 3', reward: 100, claimed: false, current: currentIndex === 2 },
            { label: 'Ngày 4', reward: 100, claimed: false, current: currentIndex === 3 },
            { label: 'Ngày 5', reward: 100, claimed: false, current: currentIndex === 4 },
            { label: 'Ngày 6', reward: 100, claimed: false, current: currentIndex === 5 },
            { label: 'Ngày 7', reward: 100, claimed: false, current: currentIndex === 6 },
        ]
    }

    const [days, setDays] = useState([])

    // Gọi fetchUser để lấy thông tin người dùng từ backend
    useEffect(() => {
        if (userStorage.id || user?.id) {
            dispatch(fetchUser())
        }
    }, [dispatch])

    // Cập nhật days khi có dữ liệu user từ backend
    useEffect(() => {
        if (user) {
            const updatedDays = initializeDays()

            // Ưu tiên dữ liệu từ backend, nếu không có thì dùng localStorage
            updatedDays.forEach((day, index) => {
                if (user.claimedDays && Array.isArray(user.claimedDays)) {
                    day.claimed = user.claimedDays[index] || localClaimedDays[index] || false
                } else {
                    day.claimed = localClaimedDays[index] || false
                }
            })

            setDays(updatedDays)

            // Đồng bộ localStorage với dữ liệu mới nhất
            const newClaimedDays = updatedDays.map(day => day.claimed)
            localStorage.setItem('claimedDays', JSON.stringify(newClaimedDays))
        }
    }, [user])

    // Kiểm tra và cập nhật ngày mới
    const checkNewDay = async () => {
        if (!user) return

        const today = new Date().toDateString()
        const lastCheckinDate = user.lastCheckinDate
        const lastUpdateDate = user.lastUpdateDate

        // Nếu đã qua ngày mới và đã điểm danh hôm qua
        if (lastUpdateDate !== today && lastCheckinDate === lastUpdateDate) {
            // Gọi API để cập nhật ngày mới
            try {
                await dispatch(fetchUser()) // Refresh user data từ backend
            } catch (error) {
                console.error('Error updating new day:', error)
            }
        }
    }

    // Kiểm tra ngày mới khi component mount và mỗi phút
    useEffect(() => {
        if (user) {
            checkNewDay()
            const interval = setInterval(checkNewDay, 60000)
            return () => clearInterval(interval)
        }
    }, [user])

    // Tìm ngày hiện tại
    const getCurrentDay = () => {
        return days.find(day => day.current)
    }

    // Xử lý điểm danh
    const handleCheckin = async () => {
        const currentDay = getCurrentDay();

        if (currentDay && !currentDay.claimed && canCheckin()) {
            try {
                const currentIndex = days.findIndex(day => day.current);
                const result = await dispatch(checkinCoinsAction({
                    reward: currentDay.reward,
                    dayIndex: currentIndex
                }));

                if (result.type.endsWith('/fulfilled')) {
                    // Cập nhật claimedDays trong UI
                    const updatedDays = days.map((day, index) =>
                        index === currentIndex ? { ...day, claimed: true } : day
                    );

                    setDays(updatedDays);

                    // Lưu claimedDays vào localStorage
                    const newClaimedDays = updatedDays.map(day => day.claimed);
                    localStorage.setItem('claimedDays', JSON.stringify(newClaimedDays));

                    // Cập nhật lại thông tin user
                    dispatch(fetchUser());
                }
            } catch (error) {
                console.error('Error during checkin:', error);
            }
        }
    };


    // Kiểm tra xem có thể điểm danh không
    const canCheckin = () => {
        if (!user || !user.lastCheckinDate) return false

        const today = new Date().toDateString()
        const lastCheckin = new Date(user.lastCheckinDate).toDateString()

        const currentDay = getCurrentDay()
        if (!currentDay) return false

        return today !== lastCheckin && !currentDay.claimed
    }

    // kiểm tra days
    useEffect(() => {
        console.log('Days:', days)
    }, [user])

    return (
        <div className="container">
            <div className='h-100vh bg-light p-3 rounded shadow-sm my-4'>
                <div className='d-flex justify-content-left gap-4 mt-4'>
                    <img src={coin_image} alt="Heartie Coin" className="" style={{ width: '48px', height: '48px' }} />
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <p className="fs-1">{user?.coins}</p>
                        <p className="fs-2 fw-medium">Xu đang có</p>
                    </div>
                </div>

                <div className="d-fex justify-content-center align-items-center daily-checkin-container">
                    <div className="row gap-4 mb-3">
                        {days.map((day, index) => (
                            <div key={index} className={`col day-container ${day.current ? "current" : 'normal'} d-flex flex-column align-items-center rounded-3 p-2 shadow-sm`}>
                                <p className="">+{day.reward}</p>
                                {day.claimed ? (
                                    <img src={coin_tick} alt="Coin" className="" style={{ width: '48px', height: '48px' }} />
                                ) : (
                                    <img src={coin_image} alt="Coin" className="" style={{ width: '48px', height: '48px' }} />
                                )}
                                <div className="fs-4">{day.current ? "Hôm nay" : day.label}</div>
                            </div>
                        ))}
                    </div>
                    <button
                        className={`btn w-100 claim-button ${!canCheckin() ? 'disabled' : ''}`}
                        onClick={handleCheckin}
                        disabled={!canCheckin()}
                    >
                        {canCheckin() ? 'Điểm danh hôm nay' : 'Đã điểm danh hôm nay'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HeartieCoin
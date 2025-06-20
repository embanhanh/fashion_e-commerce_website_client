import React, { useState, useEffect } from 'react'
import './HeartieCoin.scss'
import coin_image from '../../assets/image/logo/heirtie_coin.svg'
import coin_tick from '../../assets/image/logo/coin_tick.svg'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUser, checkinCoinsAction } from '../../redux/slices/userSlice'

const DAYS_IN_WEEK = 7
const BASE_REWARD = 100
const REWARD_INCREMENT_PER_WEEK = 50

const HeartieCoin = () => {
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const userStorage = JSON.parse(localStorage.getItem('user')) || {}
    const [days, setDays] = useState([])
    const claimedDays = JSON.parse(localStorage.getItem('claimedDays')) || []

    // Lấy thông tin streak và ngày checkin cuối
    const getStreakInfo = () => {
        const streak = user?.checkinStreak || userStorage.checkinStreak || 0
        const lastCheckinDate = user?.lastCheckinDate || userStorage.lastCheckinDate || null
        return { streak, lastCheckinDate }
    }

    // Kiểm tra 2 ngày có liền kề nhau không
    const isConsecutive = (lastDateStr, todayStr) => {
        if (!lastDateStr) return false
        const last = new Date(lastDateStr)
        const today = new Date(todayStr)
        const diff = (today - last) / (1000 * 60 * 60 * 24)
        return diff === 1
    }

    // Tính thưởng dựa trên streak hiện tại
    const calculateReward = (streak) => {
        const weekNumber = Math.floor(streak / DAYS_IN_WEEK)
        return BASE_REWARD + weekNumber * REWARD_INCREMENT_PER_WEEK
    }

    // Khởi tạo mảng ngày cho UI
    const initializeDays = () => {
        const { streak } = getStreakInfo()
        const currentIndex = streak % DAYS_IN_WEEK
        let arr = []
        for (let i = 0; i < DAYS_IN_WEEK; i++) {
            arr.push({
                label: `Ngày ${i + 1}`,
                reward: calculateReward(streak),
                claimed: i < currentIndex,
                current: i === currentIndex,
            })
        }
        return arr
    }

    // Lấy dữ liệu user khi component mount
    useEffect(() => {
        if (userStorage.id || user?.id) {
            dispatch(fetchUser())
        }
        // eslint-disable-next-line
    }, [])

    // Cập nhật UI khi user thay đổi
    useEffect(() => {
        setDays(initializeDays())
        // eslint-disable-next-line
    }, [user])

    // Kiểm tra mất chuỗi để reset UI
    useEffect(() => {
        if (!user) return
        const today = new Date().toDateString()
        const { lastCheckinDate } = getStreakInfo()

        if (
            lastCheckinDate &&
            !isConsecutive(lastCheckinDate, today) &&
            today !== new Date(lastCheckinDate).toDateString()
        ) {
            setDays(initializeDays())
        }
        // eslint-disable-next-line
    }, [user])

    // Kiểm tra xem có thể điểm danh hôm nay không
    const canCheckin = () => {
        if (!user) return false
        const today = new Date().toDateString()
        const { lastCheckinDate } = getStreakInfo()
        return today !== new Date(lastCheckinDate).toDateString()
    }
    // Cập nhật days sau khi checkin thành công, tăng streak cục bộ và đánh dấu ngày hiện tại claimed
    const updateDaysAfterCheckin = (currentStreak) => {
        const nextStreak = currentStreak + 1
        const currentIndex = currentStreak % DAYS_IN_WEEK
        const newDays = days.map((day, index) => {
            if (index < currentIndex) {
                return { ...day, claimed: true, current: false }
            } else if (index === currentIndex) {
                return { ...day, claimed: true, current: false }
            } else if (index === nextStreak % DAYS_IN_WEEK) {
                return { ...day, claimed: false, current: true }
            } else {
                return { ...day, claimed: false, current: false }
            }
        })
        setDays(newDays)
    }

    const handleCheckin = async () => {
        if (!canCheckin()) return

        const { streak, lastCheckinDate } = getStreakInfo()
        const today = new Date().toDateString()

        let newStreak = streak
        if (
            lastCheckinDate &&
            !isConsecutive(lastCheckinDate, today) &&
            today !== new Date(lastCheckinDate).toDateString()
        ) {
            newStreak = 0
        }

        const dayIndex = newStreak % DAYS_IN_WEEK
        const reward = calculateReward(newStreak)

        try {
            const result = await dispatch(
                checkinCoinsAction({
                    reward,
                    dayIndex,
                    resetStreak: newStreak === 0,
                })
            )
            if (result.type.endsWith('/fulfilled')) {
                // Cập nhật days ngay sau checkin thành công
                updateDaysAfterCheckin(newStreak)
                // dispatch(fetchUser())
            }
        } catch (error) {
            console.error('Error during checkin:', error)
        }
    }



    return (
        <div className="container">
            <div className='h-100vh bg-light p-3 rounded shadow-sm my-4'>
                <div className='d-flex justify-content-left gap-4 mt-4'>
                    <img src={coin_image} alt="Heartie Coin" style={{ width: '48px', height: '48px' }} />
                    <div className="d-flex justify-content-center align-items-center gap-2">
                        <p className="fs-1">{user?.coins}</p>
                        <p className="fs-2 fw-medium">Xu đang có</p>
                    </div>
                </div>
                <div className="d-fex justify-content-center align-items-center daily-checkin-container">
                    <div className="row gap-4 mb-3">
                        {days.map((day, index) => (
                            <div key={index} className={`col day-container ${day.current ? "current" : 'normal'} d-flex flex-column align-items-center rounded-3 p-2 shadow-sm`}>
                                <p>+{day.reward}</p>
                                {day.claimed ? (
                                    <img src={coin_tick} alt="Đã nhận" style={{ width: '48px', height: '48px' }} />
                                ) : day.current ? (
                                    <img src={coin_image} alt="Ngày hiện tại" style={{ width: '48px', height: '48px' }} />
                                ) : (
                                    <img src={coin_image} alt="Chưa nhận" style={{ width: '48px', height: '48px' }} />
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

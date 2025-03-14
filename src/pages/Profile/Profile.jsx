import './Profile.scss' // Đổi tên file SCSS nếu cần
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { v4 as uuidv4 } from 'uuid'
import { fetchUser, updateUserProfile } from '../../redux/slices/userSlice'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../../firebase.config' // Đảm bảo đường dẫn đúng
import Notification from '../../components/Notification' // Import component Notification

function Profile() {
    const dispatch = useDispatch()
    const { user, loading, error, success } = useSelector((state) => state.user)

    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [birth, setBirth] = useState('')
    const [gender, setGender] = useState('male')
    const [urlImage, setUrlImage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [showNotification, setShowNotification] = useState(false) // State để quản lý hiển thị thông báo

    useEffect(() => {
        dispatch(fetchUser())
    }, [dispatch])

    useEffect(() => {
        if (user) {
            setUserName(user.name || '')
            setEmail(user.email || '')
            setPhone(user.phone || '')
            setBirth(formatDate(user.birthday)) // Định dạng ngày tháng đúng
            setGender(user.gender || '')
            setUrlImage(user.urlImage || '')
        }
    }, [user])

    useEffect(() => {
        if (success && isSuccess) {
            setShowNotification(true) // Hiển thị thông báo khi cập nhật thành công
            // setTimeout(() => setShowNotification(false), 3000); // Ẩn thông báo sau 3 giây
            setIsSuccess(false)
        }
    }, [success])

    const formatDate = (dateString) => {
        if (!dateString) return '' // Kiểm tra nếu ngày tháng null hoặc undefined
        const date = new Date(dateString) // Chuyển đổi string thành đối tượng Date
        const year = date.getFullYear() // Lấy năm
        const month = String(date.getMonth() + 1).padStart(2, '0') // Lấy tháng, cộng thêm 1 do tháng bắt đầu từ 0
        const day = String(date.getDate()).padStart(2, '0') // Lấy ngày
        return `${year}-${month}-${day}` // Trả về định dạng yyyy-MM-dd
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            let avatarUrl = urlImage

            if (urlImage && !urlImage.startsWith('https://firebasestorage.googleapis.com')) {
                avatarUrl = await uploadImage(urlImage) // Upload the new image if necessary
            }

            const userData = {
                name: userName,
                gender,
                birthday: birth,
                phone,
                urlImage: avatarUrl,
            }

            await dispatch(updateUserProfile(userData)) // Update user profile with Firebase URL
            setIsSuccess(true)
        } catch (error) {
            console.error('Error updating user profile:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Function to upload image to Firebase
    const uploadImage = async (imageFile) => {
        const imageRef = ref(storage, `avatars/${uuidv4()}`)
        const response = await fetch(imageFile)
        const blob = await response.blob()
        await uploadBytes(imageRef, blob)
        return getDownloadURL(imageRef)
    }

    // Handle image upload and display preview
    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const fileURL = URL.createObjectURL(file)
            setUrlImage(fileURL) // Display the selected image as a preview
        } else {
            alert('Please select a valid image format: .JPEG, .PNG')
        }
    }

    if (loading && isLoading)
        return (
            <div class="d-flex justify-content-center" style={{ height: "100vh" }}>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    if (error) {
        console.error(error)
        return <div>Error: {error}</div> // Hiển thị lỗi cho người dùng
    }

    return (
        <div className="profile-container">
            <div className="z-3 position-absolute end-0 top">
                {showNotification && (
                    <Modal show={showNotification} onHide={() => setShowNotification(false)} centered>
                        <Notification title="Cập nhật thành công" description="Thông tin hồ sơ của bạn đã được cập nhật." type="success" isClosed={true} />
                    </Modal>
                )}
            </div>

            <div className="profile-header">
                <h1 className="profile-title">Hồ sơ của tôi</h1>
                <div className="profile-subtitle">Quản lý thông tin hồ sơ để bảo mật tài khoản</div>
            </div>
            <div className="profile-body">
                <div className="profile-form col-8">
                    <form onSubmit={handleSubmit}>
                        <div className="form-content">
                            <div className="row mb-3">
                                <div className="col-4 label-cell">
                                    <label className="fs-4 fw-normal text-nowrap mb-2 text-end align-items-start">Email</label>
                                </div>
                                <div className="col-8 input-cell">
                                    <div className="readonly-input">{email}</div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-4 label-cell">
                                    <label className="fs-4 fw-normal text-nowrap mb-2 text-end align-items-start">Tên</label>
                                </div>
                                <div className="col-8 input-cell">
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="text"
                                            className="input-text w-100"
                                            placeholder="Tên"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-4 label-cell">
                                    <label className="fs-4 fw-normal text-nowrap mb-2 text-end align-items-start">Số điện thoại</label>
                                </div>
                                <div className="col-8 input-cell">
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="number"
                                            className="input-text w-100"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-4 label-cell">
                                    <label className="fs-4 fw-normal text-nowrap mb-2 text-end align-items-start">Giới tính</label>
                                </div>
                                <div className="col-8 input-cell">
                                    <div className="radio-group">
                                        <label className="radio-option">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={gender === 'male'}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            <span className="custom-radio me-2"></span> Nam
                                        </label>
                                        <label className="radio-option ms-3">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="female"
                                                checked={gender === 'female'}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            <span className="custom-radio me-2"></span> Nữ
                                        </label>
                                        <label className="radio-option ms-3">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="other"
                                                checked={gender === 'other'}
                                                onChange={(e) => setGender(e.target.value)}
                                            />
                                            <span className="custom-radio me-2"></span> Khác
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-4 label-cell">
                                    <label className="fs-4 fw-normal text-nowrap mb-2 text-end align-items-start">Ngày sinh</label>
                                </div>
                                <div className="col-8 input-cell">
                                    <div className="input-form d-flex align-items-center w-100">
                                        <input
                                            type="date"
                                            className="date-input w-100"
                                            value={birth}
                                            onChange={(e) => setBirth(e.target.value)}
                                            max={new Date().toISOString().split('T')[0]}
                                            placeholder="DD/MM/YYYY"
                                            pattern="\d{2}/\d{2}/\d{4}"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-4"></div>
                                <div className="col-8 input-cell">
                                    <button type="submit" className="btn edit-btn">
                                        Lưu
                                    </button>
                                </div>
                            </div>
                        </div>


                    </form>
                </div>
                <div className="profile-avatar col-4 border-start">
                    <div className="avatar-wrapper" style={{ backgroundImage: `url(${urlImage})` }}></div>
                    <div className="custom-file-upload">
                        <input id="file-upload" className="file-input" type="file" accept=".jpg,.jpeg,.png" onChange={handleImageUpload} />
                        <label htmlFor="file-upload" className="btn choosefile-btn">
                            Chọn ảnh
                        </label>
                    </div>
                    <div>Dụng lượng file tối đa 1 MB</div>
                    <div>Định dạng:.JPEG, .PNG</div>
                </div>
            </div>
        </div>
    )
}

export default Profile

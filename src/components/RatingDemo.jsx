import React from 'react'
import { Modal } from 'react-bootstrap'
import Rating from './Rating'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { Filter } from 'bad-words'
import { ratingProductAction } from '../redux/slices/productSlice'
import './RatingDemo.scss'

const filter = new Filter()
const vietnameseBadWords = [
    'đụ',
    'địt',
    'đéo',
    'đ.m',
    'đcm',
    'dmm',
    'dkm',
    'vcl',
    'vl',
    'đel',
    'đél',
    'ngu',
    'óc chó',
    'súc vật',
    'đần',
    'khùng',
    'điên',
    'thần kinh',
    'thổ',
    'đĩ',
    'cave',
    'phò',
    'chó',
    'sv',
    'đm',
    'vkl',
    'vlz',
    'vcll',
    'dm',
    'dcm',
    'dkm',
    'dmm',
    'dm',
    'dcm',
]
filter.addWords(...vietnameseBadWords)

const RatingDemo = ({ productId = '671c56172d85b8448f598b8f', onClose }) => {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [previews, setPreviews] = useState([])
    const [error, setError] = useState('')

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        if (files.length + selectedFiles.length > 3) {
            setError('Chỉ được tải lên tối đa 3 files')
        } else {
            const newFiles = selectedFiles.filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
            setFiles((prevFiles) => [...prevFiles, ...newFiles])
            newFiles.forEach((file) => {
                const preview = {
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith('image/') ? 'image' : 'video',
                    file: file,
                }
                setPreviews((prev) => [...prev, preview])
            })
        }
    }

    const removeFile = (index) => {
        // Xóa URL object của preview trước
        URL.revokeObjectURL(previews[index].url)

        // Tạo mảng mới không bao gồm phần tử tại index
        const newFiles = files.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)

        // Cập nhật state với mảng mới
        setFiles(newFiles)
        setPreviews(newPreviews)
    }

    useEffect(() => {
        return () => {
            previews.forEach((preview) => URL.revokeObjectURL(preview.url))
        }
    }, [])

    useEffect(() => {
        if (error.trim() !== '') {
            setError('')
        }
    }, [files, comment, rating])

    const validateComment = (text) => {
        // Kiểm tra comment có chứa từ cấm không
        try {
            // Chuyển text về lowercase để kiểm tra
            const lowerText = text.toLowerCase()

            // Kiểm tra bằng bad-words filter
            if (filter.isProfane(text)) {
                setError('Nội dung bình luận chứa từ ngữ không phù hợp')
                return false
            }

            // Kiểm tra thêm các pattern tiếng Việt
            const containsBadWord = vietnameseBadWords.some(
                (word) =>
                    lowerText.includes(word) ||
                    // Kiểm tra cả trường hợp thêm dấu cách giữa các ký tự
                    lowerText.includes(word.split('').join(' '))
            )

            if (containsBadWord) {
                setError('Nội dung bình luận chứa từ ngữ không phù hợp')
                return false
            }

            return true
        } catch (error) {
            console.error('Error validating comment:', error)
            return false
        }
    }

    const handleSubmit = async () => {
        if (!validateComment(comment)) {
            return
        }
        const formData = new FormData()
        formData.append('rating', rating)
        formData.append('comment', comment)
        files.forEach((file) => {
            formData.append('files', file)
        })
        try {
            setLoading(true)
            await dispatch(
                ratingProductAction({
                    productId: productId,
                    ratingData: formData,
                })
            ).unwrap()
            // onClose()
        } catch (error) {
            console.error('Error submitting rating:', error)
        } finally {
            setLoading(false)
        }
    }

    const validateForm = () => {
        return rating > 0 && comment.trim() !== '' && files.length > 0
    }

    return (
        <div>
            <Modal
                show={true}
                onHide={() => {
                    console.log('close')
                }}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá sản phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-start">
                        <Rating initialRating={0} size={20} onRate={(value) => setRating(value)} />
                    </div>
                    <div className="d-flex gap-3">
                        {previews.map((preview, index) => (
                            <div key={index} className="position-relative rating-preview__container" style={{ width: '100px', height: '100px' }}>
                                {preview.type === 'image' ? (
                                    <img src={preview.url} alt={`preview-${index}`} className="w-100 h-100 object-fit-cover rounded-4" />
                                ) : (
                                    <video
                                        src={preview.url}
                                        className="w-100 h-100 object-fit-cover rounded-4"
                                        controls={false}
                                        onClick={(e) => {
                                            if (e.target.paused) {
                                                e.target.play()
                                            } else {
                                                e.target.pause()
                                            }
                                        }}
                                    />
                                )}
                                <button className="position-absolute rating-preview__btn-close top-0 end-0 border-0" onClick={() => removeFile(index)}>
                                    <FontAwesomeIcon icon={faXmark} size="lg" />
                                </button>
                            </div>
                        ))}
                        {files.length < 3 && (
                            <label className="custum-file-upload px-1">
                                <div className="icon-image">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="" viewBox="0 0 24 24" className="upload-icon">
                                        <g strokeWidth={0} id="SVGRepo_bgCarrier" />
                                        <g strokeLinejoin="round" strokeLinecap="round" id="SVGRepo_tracerCarrier" />
                                        <g id="SVGRepo_iconCarrier">
                                            <path
                                                fill=""
                                                d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                                                clipRule="evenodd"
                                                fillRule="evenodd"
                                            />
                                        </g>
                                    </svg>
                                </div>
                                <div className="text w-100">
                                    <span>Thêm hình ảnh/ video</span>
                                </div>
                                <input type="file" multiple id="main-product-images" onChange={handleFileChange} accept="image/*, video/*" />
                            </label>
                        )}
                    </div>
                    <div className="input-form d-inline-flex align-items-center h-auto w-100">
                        <textarea rows={4} className="input-text w-100" placeholder="Nhập đánh giá" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    {error && <p className="text-danger">{error}</p>}
                    <button
                        className="bg-white px-4 py-2 border rounded-4 "
                        onClick={() => {
                            console.log('close')
                        }}
                    >
                        <p className="m-0">Hủy</p>
                    </button>
                    <button disabled={loading || !validateForm()} className="px-4 py-2 primary-btn shadow-none rounded-4" onClick={handleSubmit}>
                        <p className="m-0">Đánh giá</p>
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
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RatingDemo

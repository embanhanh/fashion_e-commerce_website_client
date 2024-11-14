import React from 'react'
import { Modal } from 'react-bootstrap'
import { Rating } from 'react-simple-star-rating'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ratingProductAction } from '../redux/slices/productSlice'

const RatingDemo = ({ productId = '671c56172d85b8448f598b8f', onClose }) => {
    const dispatch = useDispatch()
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const handleFileChange = (e) => {
        setFiles([...e.target.files])
    }

    const handleSubmit = async () => {
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
        return rating > 0 && comment.trim() !== ''
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
                <Modal.Body>
                    <Rating initialValue={0} size={20} onClick={setRating} />
                    <div className="d-flex align-items-center my-3">
                        <input type="file" accept="image/*, video/*" multiple onChange={handleFileChange} />
                    </div>
                    <div className="input-form d-inline-flex align-items-center h-auto w-100 my-3">
                        <textarea rows={4} className="input-text w-100" placeholder="Nhập đánh giá" value={comment} onChange={(e) => setComment(e.target.value)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="bg-white px-3 py-2 border"
                        onClick={() => {
                            console.log('close')
                        }}
                    >
                        <p className="m-0">Hủy</p>
                    </button>
                    <button disabled={loading || !validateForm()} className="px-3 py-2 primary-btn shadow-none rounded-0" onClick={handleSubmit}>
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

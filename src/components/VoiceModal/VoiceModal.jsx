import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faXmark } from '@fortawesome/free-solid-svg-icons'
import './VoiceModal.scss'

function VoiceModal({ show, onHide, onResult }) {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [status, setStatus] = useState('initial')

    useEffect(() => {
        let recognition = null

        if (show) {
            if ('webkitSpeechRecognition' in window) {
                recognition = new window.webkitSpeechRecognition()
                recognition.continuous = false
                recognition.interimResults = true
                recognition.lang = 'vi-VN'

                recognition.onstart = () => {
                    setIsListening(true)
                    setTranscript('')
                    setStatus('listening')
                }

                recognition.onresult = (event) => {
                    const current = event.resultIndex
                    const currentTranscript = event.results[current][0].transcript
                    setTranscript(currentTranscript)

                    if (event.results[current].isFinal) {
                        setStatus('completed')
                        onResult(currentTranscript)
                        setTimeout(() => onHide(), 1000)
                    }
                }

                recognition.onerror = (event) => {
                    console.error('Lỗi nhận diện giọng nói:', event.error)
                    setIsListening(false)
                    setStatus('error')
                }

                recognition.onend = () => {
                    setIsListening(false)
                }

                recognition.start()
            }
        } else {
            setStatus('initial')
        }

        return () => {
            if (recognition) {
                recognition.stop()
            }
        }
    }, [show, onResult, onHide])

    const getStatusMessage = () => {
        switch (status) {
            case 'listening':
                return 'Đang nghe...'
            case 'completed':
                return 'Đã nhận diện xong!'
            case 'error':
                return 'Có lỗi xảy ra, vui lòng thử lại'
            default:
                return 'Nhấn vào micro để bắt đầu nói'
        }
    }

    return (
        <Modal show={show} onHide={onHide} centered className="voice-modal">
            <Modal.Header>
                <Modal.Title>Tìm kiếm bằng giọng nói</Modal.Title>
                <FontAwesomeIcon icon={faXmark} className="close-btn" onClick={onHide} />
            </Modal.Header>
            <Modal.Body className="text-center">
                <div className={`mic-container ${isListening ? 'listening' : ''}`}>
                    <FontAwesomeIcon icon={faMicrophone} className="mic-icon" />
                </div>
                <p
                    className={`mt-4 instruction ${status === 'completed' ? 'text-success' : ''} ${
                        status === 'error' ? 'text-danger' : ''
                    }`}
                >
                    {getStatusMessage()}
                </p>
                {transcript && <p className="transcript mt-3">"{transcript}"</p>}
            </Modal.Body>
        </Modal>
    )
}

export default VoiceModal

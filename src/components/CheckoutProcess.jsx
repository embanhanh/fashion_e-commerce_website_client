import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faCreditCard, faFileLines, faCheck } from '@fortawesome/free-solid-svg-icons'
import './CheckoutProcess.scss'

const STEPS = [
    { icon: faLocationDot, label: 'Địa chỉ giao hàng' },
    { icon: faCreditCard, label: 'Phương thức thanh toán' },
    { icon: faFileLines, label: 'Xác nhận đơn hàng' },
]

const CheckoutProcess = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0)

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <div>Nội dung địa chỉ giao hàng</div>
            case 1:
                return <div>Nội dung phương thức thanh toán</div>
            case 2:
                return <div>Nội dung xác nhận đơn hàng</div>
            default:
                return null
        }
    }

    return (
        <Modal show={true} onHide={onClose} centered size="lg">
            <Modal.Header closeButton className="p-4">
                <Modal.Title className="fs-2 fw-bold theme-color">{STEPS[currentStep].label}</Modal.Title>
            </Modal.Header>
            <div className="position-relative mt-4 mb-5">
                <div className="checkout-process_container d-flex justify-content-between gap-5">
                    <div className="process-line" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }} />
                    {STEPS.map((step, index) => (
                        <div key={index} className="position-relative">
                            <button
                                className={`checkout-process_step rounded-circle ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
                                onClick={() => index <= currentStep && setCurrentStep(index)}
                            >
                                <FontAwesomeIcon icon={index < currentStep ? faCheck : step.icon} className="fs-3" />
                            </button>
                            <span className={`checkout-process_label ${index === currentStep ? 'active' : ''}`}>{step.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            <Modal.Body>{renderStepContent()}</Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={() => currentStep > 0 && setCurrentStep((prev) => prev - 1)} disabled={currentStep === 0}>
                    Quay lại
                </button>
                <button className="btn btn-primary" onClick={() => currentStep < STEPS.length - 1 && setCurrentStep((prev) => prev + 1)} disabled={currentStep === STEPS.length - 1}>
                    Tiếp tục
                </button>
            </Modal.Footer>
        </Modal>
    )
}

export default CheckoutProcess

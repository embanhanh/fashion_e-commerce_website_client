import './InvoicePage.scss'
import { PDFViewer } from '@react-pdf/renderer'
import InvoiceComponent from '../../components/InvoiceComponent'

const InvoicePage = () => {
    return (
        <div>
            <PDFViewer width="100%" style={{ height: '100vh' }} className="app">
                <InvoiceComponent />
            </PDFViewer>
        </div>
    )
}

export default InvoicePage

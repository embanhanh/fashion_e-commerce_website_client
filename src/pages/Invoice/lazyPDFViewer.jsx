import React from 'react'
import { PDFViewer } from '@react-pdf/renderer'
import InvoiceComponent from '../../components/InvoiceComponent'

const LazyPDFViewer = ({ orders, shop }) => {
    return (
        <PDFViewer width="100%" style={{ height: '100vh' }} className="app">
            <InvoiceComponent orders={orders} shop={shop} />
        </PDFViewer>
    )
}

export default LazyPDFViewer

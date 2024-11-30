import React, { useEffect } from 'react'
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer'
import logo from '../assets/image/logo/logo.png'
import QuicksandRegular from '../assets/fonts/Quicksand-Regular.ttf'
import QuicksandBold from '../assets/fonts/Quicksand-Bold.ttf'
import QuicksandMedium from '../assets/fonts/Quicksand-Medium.ttf'

Font.register({
    family: 'Quicksand',
    fonts: [
        { src: QuicksandRegular, fontWeight: 'normal' },
        { src: QuicksandBold, fontWeight: 'bold' },
        { src: QuicksandMedium, fontWeight: 'medium' },
    ],
})

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Quicksand',
        fontSize: 11,
        padding: 40,
        lineHeight: 1.5,
        flexDirection: 'column',
    },
    contentContainer: {
        flexDirection: 'column',
        border: `5px solid #14919b`,
        borderRadius: 12,
    },

    titleItem: {
        flex: 1,
        flexDirection: 'column',
        height: '100%',
        padding: 20,
    },

    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px dashed #0b6477',
    },

    logo: { width: 90 },

    reportTitle: { fontSize: 16, textAlign: 'center', fontWeight: 'bold', color: '#0b6477' },

    addressTitle: { fontSize: 12, fontWeight: 'bold', color: '#14919b' },

    invoice: { fontSize: 28, fontWeight: 'bold', color: '#0b6477' },

    invoiceNumber: { fontSize: 11 },

    address: { fontSize: 10 },

    theader: {
        fontSize: 10,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        height: 20,
        backgroundColor: '#aee1e1',
        borderColor: 'whitesmoke',
        borderRightWidth: 1,
        borderBottomWidth: 1,
        color: '#0b6477',
    },

    theader2: { flex: 2, borderRightWidth: 1, borderBottomWidth: 1 },

    tbody: {
        fontSize: 9,
        paddingTop: 4,
        paddingLeft: 7,
        flex: 1,
        borderColor: 'whitesmoke',
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },

    total: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1.5, borderColor: 'whitesmoke', borderBottomWidth: 1 },

    tbody2: { flex: 2, borderRightWidth: 1 },
})

// Create Document Component
const InvoiceComponent = ({ orders, shop }) => {
    return (
        <Document>
            {orders.map((order) => (
                <Page size="A5" style={styles.page} key={order._id}>
                    <View style={styles.contentContainer}>
                        <View style={styles.titleContainer}>
                            <View style={{ ...styles.titleItem, alignItems: 'center' }}>
                                <Image style={styles.logo} src={logo} />
                                <Text style={styles.reportTitle}>{shop?.name}</Text>
                            </View>
                            <View style={styles.titleItem}>
                                <Text style={styles.invoice}>Hóa đơn </Text>
                                <Text style={styles.invoiceNumber}>Mã hóa đơn: {order?._id} </Text>
                            </View>
                        </View>
                        <View style={styles.titleContainer}>
                            <View style={{ ...styles.titleItem, borderRight: '1px dashed #0b6477' }}>
                                <Text style={styles.addressTitle}>Từ: </Text>
                                <Text style={styles.address}>{shop?.address}</Text>
                            </View>
                            <View style={{ ...styles.titleItem }}>
                                <Text style={styles.addressTitle}>Tới: </Text>
                                <Text style={styles.address}>{order?.shippingAddress?.location}</Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, marginVertical: 10, marginLeft: 10 }}>Chi tiết hóa đơn</Text>
                        <View style={{ width: '100%', flexDirection: 'row', padding: '0 10px' }}>
                            <View style={[styles.theader, styles.theader2]}>
                                <Text>Sản phẩm</Text>
                            </View>
                            <View style={styles.theader}>
                                <Text>Giá</Text>
                            </View>
                            <View style={styles.theader}>
                                <Text>Số lượng</Text>
                            </View>
                            <View style={styles.theader}>
                                <Text>Thành tiền</Text>
                            </View>
                        </View>
                        {order?.products.map((product) => (
                            <View key={product._id} style={{ width: '100%', flexDirection: 'row', padding: '0 10px' }}>
                                <View style={[styles.tbody, styles.tbody2]}>
                                    <Text>{product?.product?.product?.name}</Text>
                                </View>
                                <View style={styles.tbody}>
                                    <Text>{product?.product?.price} </Text>
                                </View>
                                <View style={styles.tbody}>
                                    <Text>{product?.quantity}</Text>
                                </View>
                                <View style={styles.tbody}>
                                    <Text>{product?.product?.price * product?.quantity}đ</Text>
                                </View>
                            </View>
                        ))}
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={styles.total}>
                                <Text></Text>
                            </View>
                            <View style={styles.total}>
                                <Text> </Text>
                            </View>
                            <View style={styles.tbody}>
                                <Text>Tổng</Text>
                            </View>
                            <View style={styles.tbody}>
                                <Text>{order?.productsPrice}đ</Text>
                            </View>
                        </View>
                        <View style={{ ...styles.titleContainer, borderBottomWidth: '0' }}>
                            <View style={{ ...styles.titleItem, borderRight: '1px dashed #0b6477', borderBottom: '0' }}>
                                <Text style={styles.addressTitle}>Ngày đặt hàng </Text>
                                <Text style={styles.address}>
                                    {new Date(order?.createdAt).toLocaleDateString('vi-VN')}
                                </Text>
                            </View>
                            <View style={{ ...styles.titleItem, borderBottom: '0' }}>
                                <Text style={styles.address}>Phí vận chuyển: {order?.shippingPrice}đ</Text>
                                <Text style={styles.address}>
                                    Tổng cộng: {order?.shippingPrice + order?.productsPrice}đ
                                </Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 11, color: '#0b6477' }}>
                                    Thanh toán: {order?.totalPrice}đ
                                </Text>
                            </View>
                        </View>
                    </View>
                </Page>
            ))}
        </Document>
    )
}

export default InvoiceComponent

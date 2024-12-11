import { useState, useEffect, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { doc, getDoc, getDocs, collection } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { db } from '../../firebase.config'
import { getAdminOrders } from '../../services/OrderService'
import { getProductOutOfStock } from '../../services/ProductService'
import { getAllBanners } from '../../services/BannerService'
import { getActivePromotionalCombos } from '../../services/PromotionalComboService'
import './MainManager.scss'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function MainManager() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [productOutOfStock, setProductOutOfStock] = useState([])
    const [banners, setBanners] = useState([])
    const [activePromotionalCombos, setActivePromotionalCombos] = useState([])
    const [newRating, setNewRating] = useState([])
    const [orderCompletedToday, setOrderCompletedToday] = useState([])
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await getAdminOrders({ manyStatus: ['pending', 'processing', 'cancelled'] })
            const responseCompletedToday = await getAdminOrders({
                manyStatus: ['delivered'],
                orderEndDate: new Date().toISOString(),
                orderStartDate: new Date().toISOString(),
            })
            setOrders(response)
            setOrderCompletedToday(responseCompletedToday)
        }
        const fetchProductOutOfStock = async () => {
            const response = await getProductOutOfStock()
            setProductOutOfStock(response)
        }
        const fetchBanners = async () => {
            const response = await getAllBanners({ isActive: true })
            setBanners(response?.banners)
        }
        const fetchActivePromotionalCombos = async () => {
            const response = await getActivePromotionalCombos()
            setActivePromotionalCombos(response)
        }
        const fetchNewRating = async () => {
            const ratingsRef = collection(db, 'product_ratings')
            const today = new Date()
            const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

            try {
                const querySnapshot = await getDocs(ratingsRef)
                const recentRatings = []
                querySnapshot.forEach((doc) => {
                    const data = doc.data()

                    const filteredRatings = data.ratings.filter((rating) => {
                        const ratingDate = new Date(rating.createdAt)
                        //ratingDate >= sevenDaysAgo &&
                        return ratingDate <= today
                    })

                    recentRatings.push(...filteredRatings)
                })
                setNewRating(recentRatings)
            } catch (error) {
                console.error('Error fetching new ratings:', error)
            }
        }
        fetchOrders()
        fetchProductOutOfStock()
        fetchBanners()
        fetchActivePromotionalCombos()
        fetchNewRating()
    }, [])

    const calculateRevenueByHour = () => {
        const revenueByHour = new Array(12).fill(0)

        orderCompletedToday.forEach((order) => {
            const deliveredTime = new Date(order.deliveredAt)
            const hour = deliveredTime.getHours()
            const index = Math.floor(hour / 2)
            revenueByHour[index] += order.totalPrice
        })
        return revenueByHour
    }

    const chartData = useMemo(() => {
        return {
            labels: [
                '00:00',
                '02:00',
                '04:00',
                '06:00',
                '08:00',
                '10:00',
                '12:00',
                '14:00',
                '16:00',
                '18:00',
                '20:00',
                '22:00',
            ],
            datasets: [
                {
                    label: 'Doanh thu (VNĐ)',
                    data: calculateRevenueByHour(),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    pointStyle: 'circle',
                    pointRadius: 5,
                    pointHoverRadius: 10,
                },
            ],
        }
    }, [orderCompletedToday])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString('vi-VN') + ' đ'
                    },
                },
            },
        },
    }

    return (
        <>
            <div className="d-flex flex-column gap-4 align-items-center">
                <div className="p-4 pb-5 main-manager-section bg-white rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-bold mb-3">Danh sách cần làm</h3>
                    <div className="row g-4">
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">
                                {orders.filter((order) => order.status === 'pending').length}
                            </p>
                            <p className="fs-4 fw-medium text-center">Đơn chờ xác nhận</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">
                                {orders.filter((order) => order.status === 'processing').length}
                            </p>
                            <p className="fs-4 fw-medium text-center">Đơn chờ giao hàng</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">
                                {orders.filter((order) => order.status === 'cancelled').length}
                            </p>
                            <p className="fs-4 fw-medium text-center">Đơn hủy</p>
                        </div>
                        <div className="col-3">
                            <p className="fs-2 fw-bold text-center value-color">
                                {productOutOfStock.filter((product) => product.stockQuantity > 0).length}
                            </p>
                            <p className="fs-4 fw-medium text-center">Sản phẩm sắp hết hàng</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">
                                {productOutOfStock.filter((product) => product.stockQuantity === 0).length}
                            </p>
                            <p className="fs-4 fw-medium text-center">Sản phẩm đã hết hàng</p>
                        </div>
                        <div className="col-3 border-end border-3 ">
                            <p className="fs-2 fw-bold text-center value-color">{activePromotionalCombos.length}</p>
                            <p className="fs-4 fw-medium text-center">Khuyến mãi đang chạy</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">{banners.length}</p>
                            <p className="fs-4 fw-medium text-center">Banner đang chạy</p>
                        </div>
                        <div className="col-3">
                            <p className="fs-2 fw-bold text-center value-color">{newRating.length}</p>
                            <p className="fs-4 fw-medium text-center">Đánh giá mới từ khách hàng</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 main-manager-section bg-white rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-bold mb-1">Doanh thu hôm nay</h3>
                    <p className="fs-4 mb-2 text-body-secondary">
                        ( Hôm nay{' '}
                        {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })} )
                    </p>
                    <div style={{ height: '400px', width: '100%' }}>
                        <Line options={options} data={chartData} />
                    </div>
                </div>
                <div className="p-3 bg-white main-manager-section rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-semibold mb-3">Các sản phẩm sắp hết hàng/đã hết hàng</h3>
                    <table className="page-table out-of-stock-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Sản phẩm</th>
                                <th>Tồn kho</th>
                                <th>Đã bán</th>
                                <th>Trạng thái</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productOutOfStock.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={item.urlImage[0]} alt={item.name} width={50} height={50} />
                                            <p className="mb-0 product-name">{item.name}</p>
                                        </div>
                                    </td>
                                    <td>{item.stockQuantity}</td>
                                    <td>{item.soldQuantity}</td>
                                    <td>
                                        <p
                                            className={`table__status ${
                                                item.stockQuantity > 0 ? 'warning' : 'error'
                                            } shadow-sm`}
                                        >
                                            {item.stockQuantity > 0 ? 'Sắp hết hàng' : 'Đã hết hàng'}
                                        </p>
                                    </td>
                                    <td>
                                        <div className="h-100 d-flex align-items-center justify-content-center">
                                            <button
                                                className="px-3  py-2 rounded-4 primary-btn shadow-sm"
                                                onClick={() => {
                                                    navigate(`/seller/products/edit/${item.slug}`)
                                                }}
                                            >
                                                Bổ sung
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default MainManager

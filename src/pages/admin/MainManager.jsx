import './MainManager.scss'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function MainManager() {
    const chartData = {
        labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: [150000, 300000, 200000, 400000, 800000, 1200000, 900000, 1500000, 2000000, 1800000, 1600000, 1000000],
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                pointStyle: 'circle',
                pointRadius: 5,
                pointHoverRadius: 10,
            },
        ],
    }

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

    const topProductData = [
        {
            _id: 1,
            name: 'Sản phẩm 1 á á dsa á sa á á sa asd á asd á á sa dsa sa á á dá sa á á á á á á a s á  asd sa sa á á á',
            urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqMvMuYQIvpZGdgD7O8ESBZxgZG9QyKkxnw&s',
            stockQuantity: 100,
            soldQuantity: 100,
            revenue: 1000000,
        },
        {
            _id: 2,
            name: 'Sản phẩm 2',
            urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqMvMuYQIvpZGdgD7O8ESBZxgZG9QyKkxnw&s',
            stockQuantity: 100,
            soldQuantity: 100,
            revenue: 1000000,
        },
        {
            _id: 3,
            name: 'Sản phẩm 3',
            urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqMvMuYQIvpZGdgD7O8ESBZxgZG9QyKkxnw&s',
            stockQuantity: 100,
            soldQuantity: 100,
            revenue: 1000000,
        },
        {
            _id: 4,
            name: 'Sản phẩm 4',
            urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqMvMuYQIvpZGdgD7O8ESBZxgZG9QyKkxnw&s',
            stockQuantity: 100,
            soldQuantity: 100,
            revenue: 1000000,
        },
        {
            _id: 5,
            name: 'Sản phẩm 5',
            urlImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzqMvMuYQIvpZGdgD7O8ESBZxgZG9QyKkxnw&s',
            stockQuantity: 100,
            soldQuantity: 100,
            revenue: 1000000,
        },
    ]

    return (
        <>
            <div className="d-flex flex-column gap-4 align-items-center">
                <div className="p-4 pb-5 main-manager-section bg-white rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-bold mb-3">Danh sách cần làm</h3>
                    <div className="row g-4">
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Đơn chờ xác nhận</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Đơn chờ giao hàng</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Đơn hủy</p>
                        </div>
                        <div className="col-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Sản phẩm hết hàng</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Sản phẩm đã hết hàng</p>
                        </div>
                        <div className="col-3 border-end border-3 ">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Khuyến mãi đang chạy</p>
                        </div>
                        <div className="col-3 border-end border-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Banner đang chạy</p>
                        </div>
                        <div className="col-3">
                            <p className="fs-2 fw-bold text-center value-color">79</p>
                            <p className="fs-4 fw-medium text-center">Đánh giá mới từ khách hàng</p>
                        </div>
                    </div>
                </div>
                <div className="p-4 main-manager-section bg-white rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-bold mb-1">Doanh thu hôm nay</h3>
                    <p className="fs-4 mb-2 text-body-secondary">( Hôm nay {new Date().toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })} )</p>
                    <div style={{ height: '400px', width: '100%' }}>
                        <Line options={options} data={chartData} />
                    </div>
                </div>
                <div className="p-4 main-manager-section bg-white rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-bold mb-3">Top sản phẩm bán chạy</h3>
                    <table className="page-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Sản phẩm</th>
                                <th>Tồn kho</th>
                                <th>Đã bán</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProductData.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={item.urlImage} alt={item.name} width={50} height={50} />
                                            <p className="mb-0 product-name">{item.name}</p>
                                        </div>
                                    </td>
                                    <td>{item.stockQuantity}</td>
                                    <td>{item.soldQuantity}</td>
                                    <td>{item.revenue.toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 main-manager-section bg-white rounded-3 shadow-sm">
                    <h3 className="fs-3 fw-bold mb-3">Các sản phẩm sắp hết hàng/đã hết hàng</h3>
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
                            {topProductData.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={item.urlImage} alt={item.name} width={50} height={50} />
                                            <p className="mb-0 product-name">{item.name}</p>
                                        </div>
                                    </td>
                                    <td>{item.stockQuantity}</td>
                                    <td>{item.soldQuantity}</td>
                                    <td>
                                        <p className="table__status warning shadow-sm">Sắp hết hàng</p>
                                    </td>
                                    <td>
                                        <div className="h-100 d-flex align-items-center justify-content-center">
                                            <button className="px-3 fw-medium py-2 rounded-3 bg-primary text-white shadow-sm">Bổ sung</button>
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

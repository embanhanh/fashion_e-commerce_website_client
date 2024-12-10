import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)
import '../pages/admin/Statistic.scss'

function StatisticProduct({ dateRange, selectedDate }) {
    const categoryData = [
        { name: 'Điện thoại', revenue: 5000000000 },
        { name: 'Laptop', revenue: 3000000000 },
        { name: 'Máy tính bảng', revenue: 2000000000 },
        { name: 'Phụ kiện', revenue: 1500000000 },
        { name: 'Đồng hồ', revenue: 500000000 },
        { name: 'Tai nghe', revenue: 400000000 },
        { name: 'Chuột', revenue: 300000000 },
    ]
    const sortedCategories = [...categoryData].sort((a, b) => b.revenue - a.revenue)
    const top4Categories = sortedCategories.slice(0, 4)
    const otherRevenue = sortedCategories.slice(4).reduce((sum, item) => sum + item.revenue, 0)
    const chartData = {
        labels: [...top4Categories.map((item) => item.name), 'Khác'],
        datasets: [
            {
                data: [...top4Categories.map((item) => item.revenue), otherRevenue],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                borderWidth: 1,
                hoverOffset: 10,
            },
        ],
    }
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 14,
                    },
                    generateLabels: function (chart) {
                        const datasets = chart.data.datasets
                        const labels = chart.data.labels
                        const total = datasets[0].data.reduce((acc, data) => acc + data, 0)

                        return labels.map((label, index) => ({
                            text: `${label} (${Math.round((datasets[0].data[index] * 100) / total)}%)`,
                            fillStyle: datasets[0].backgroundColor[index],
                            strokeStyle: datasets[0].borderColor[index],
                            lineWidth: 1,
                            hidden: false,
                            index: index,
                        }))
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((acc, data) => acc + data, 0)
                        const percentage = Math.round((value * 100) / total)
                        return `${label}: ${percentage}% (${value.toLocaleString('vi-VN')}đ)`
                    },
                },
            },
        },
        cutout: '60%',
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
            <div className="p-3 bg-white rounded-3 shadow-sm">
                <h3 className="fs-3 fw-semibold mb-3">Top sản phẩm bán chạy</h3>
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
            <div className="p-3 bg-white rounded-3 shadow-sm">
                <h3 className="fs-3 fw-semibold mb-3">Doanh số theo danh mục</h3>
                <div className="d-flex gap-3">
                    <div style={{ minWidth: '400px', height: '350px' }} className="p-3">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>

                    <table className="page-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Danh mục</th>
                                <th>Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody>
                            {top4Categories.map((item, index) => (
                                <tr key={item._id}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.revenue.toLocaleString('vi-VN')}</td>
                                </tr>
                            ))}
                            {otherRevenue > 0 && (
                                <tr>
                                    <td>...</td>
                                    <td>Khác</td>
                                    <td>{otherRevenue.toLocaleString('vi-VN')}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default StatisticProduct

import '../pages/admin/Statistic.scss'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

function StatisticOrder({ dateRange, selectedDate }) {
    const orderData = {
        completed: 150,
        cancelled: 30,
    }

    const chartData = {
        labels: ['Đơn hàng hoàn thành', 'Đơn hàng hủy'],
        datasets: [
            {
                data: [orderData.completed, orderData.cancelled],
                backgroundColor: [
                    '#4BC0C0', // màu xanh cho đơn hoàn thành
                    '#FF6384', // màu đỏ cho đơn hủy
                ],
                borderColor: ['#4BC0C0', '#FF6384'],
                borderWidth: 1,
            },
        ],
    }

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
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
                        return `${label}: ${percentage}% (${value} đơn)`
                    },
                },
            },
        },
        cutout: '60%',
    }
    return (
        <>
            <div className="p-3 bg-white rounded-3 shadow-sm d-flex gap-3">
                <div>
                    <h3 className="fs-3 fw-semibold mb-3">Tỉ lệ đơn hàng</h3>
                    <div style={{ maxHeight: '400px' }}>
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                </div>
                <div className="row  row-cols-3 flex-grow-1 p-4 g-4 gx-5">
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Tổng số đơn hàng </p>
                        <p className="fs-1 fw-semibold">30.000</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span className="fs-4 text-success fw-semibold">tăng 10%</span>
                        </p>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Đơn hàng hoàn thành</p>
                        <p className="fs-1 fw-semibold">30.000</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span className="fs-4 text-success fw-semibold">tăng 10%</span>
                        </p>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Đơn hàng hủy</p>
                        <p className="fs-1 fw-semibold">30.000</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span className="fs-4 text-success fw-semibold">tăng 10%</span>
                        </p>
                    </div>
                    <div className="col-12 border-bottom border-3 my-4"></div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Tỉ lệ hủy đơn hàng </p>
                        <p className="fs-1 fw-semibold">30.000</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span className="fs-4 text-success fw-semibold">tăng 10%</span>
                        </p>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Thời gian xử lý đơn hàng trung bình </p>
                        <p className="fs-1 fw-semibold">30.000</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span className="fs-4 text-success fw-semibold">tăng 10%</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatisticOrder

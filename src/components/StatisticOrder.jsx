import { useMemo, useState, useEffect } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useDispatch } from 'react-redux'
import { getAdminOrdersAction } from '../redux/slices/orderSilce'
import { sameDay, calculateDateDate } from '../utils/DateUtils'
import { calculateDaysDifference } from '../utils/DateUtils'
import { validateResult } from '../utils/StringUtil'
import '../pages/admin/Statistic.scss'

ChartJS.register(ArcElement, Tooltip, Legend)

function StatisticOrder({ dateRange, selectedDate }) {
    const dateData = useMemo(() => calculateDateDate(dateRange, selectedDate), [dateRange, selectedDate])
    const dispatch = useDispatch()
    const [orders, setOrders] = useState([])
    const [data, setData] = useState({})
    useEffect(() => {
        const fetchOrders = async () => {
            const response = await dispatch(getAdminOrdersAction({ dateData }))
            setOrders(response.payload)
        }
        fetchOrders()
    }, [dateData])

    useEffect(() => {
        let orderData = {
            now: {
                completed: 0,
                cancelled: 0,
                total: 0,
                processingTime: 0,
            },
            prev: {
                completed: 0,
                cancelled: 0,
                total: 0,
                processingTime: 0,
            },
        }
        orders.forEach((order) => {
            if (
                new Date(order.createdAt).getTime() >= new Date(dateData.now.start).getTime() &&
                new Date(order.createdAt).getTime() <= new Date(dateData.now.end).getTime()
            ) {
                if (order.status === 'delevered') {
                    orderData.now.completed += 1
                    orderData.now.processingTime += calculateDaysDifference(order.createdAt, order.deliveredAt)
                } else if (order.status === 'cancelled') {
                    orderData.now.cancelled += 1
                }
                orderData.now.total += 1
            }
            if (
                new Date(order.createdAt).getTime() >= new Date(dateData.prev.start).getTime() &&
                new Date(order.createdAt).getTime() <= new Date(dateData.prev.end).getTime()
            ) {
                if (order.status === 'delevered') {
                    orderData.prev.completed += 1
                    orderData.prev.processingTime += calculateDaysDifference(order.createdAt, order.deliveredAt)
                } else if (order.status === 'cancelled') {
                    orderData.prev.cancelled += 1
                }
                orderData.prev.total += 1
            }
        })
        setData(orderData)
    }, [orders, dateData])

    const chartData = useMemo(() => {
        return {
            labels: ['Đơn hàng hoàn thành', 'Đơn hàng hủy'],
            datasets: [
                {
                    data: [
                        validateResult((data?.now?.completed / data?.now?.total) * 100),
                        validateResult((data?.now?.cancelled / data?.now?.total) * 100),
                    ],
                    backgroundColor: [
                        '#4BC0C0', // màu xanh cho đơn hoàn thành
                        '#FF6384', // màu đỏ cho đơn hủy
                    ],
                    borderColor: ['#4BC0C0', '#FF6384'],
                    borderWidth: 1,
                },
            ],
        }
    }, [orders, dateData])

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
                        <p className="fs-1 fw-semibold">{data?.now?.total}</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span
                                className={`fs-4 ${
                                    data?.now?.total - data?.prev?.total > 0 ? 'text-success' : 'text-danger'
                                } fw-semibold`}
                            >
                                {validateResult(
                                    ((data?.now?.total - data?.prev?.total) / data?.prev?.total) * 100
                                ).toFixed(2)}
                                %
                            </span>
                        </p>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Đơn hàng hoàn thành</p>
                        <p className="fs-1 fw-semibold">{data?.now?.completed}</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span
                                className={`fs-4 ${
                                    data?.now?.completed - data?.prev?.completed > 0 ? 'text-success' : 'text-danger'
                                } fw-semibold`}
                            >
                                {validateResult(
                                    ((data?.now?.completed - data?.prev?.completed) / data?.prev?.completed) * 100
                                ).toFixed(2)}
                                %
                            </span>
                        </p>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Đơn hàng hủy</p>
                        <p className="fs-1 fw-semibold">{data?.now?.cancelled}</p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span
                                className={`fs-4 ${
                                    data?.now?.cancelled - data?.prev?.cancelled > 0 ? 'text-success' : 'text-danger'
                                } fw-semibold`}
                            >
                                {validateResult(
                                    ((data?.now?.cancelled - data?.prev?.cancelled) / data?.prev?.cancelled) * 100
                                ).toFixed(2)}
                                %
                            </span>
                        </p>
                    </div>
                    <div className="col-12 border-bottom border-3 my-4"></div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Tỉ lệ hủy đơn hàng </p>
                        <p className="fs-1 fw-semibold">
                            {((data?.now?.cancelled / data?.now?.total) * 100).toFixed(2)}%
                        </p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span
                                className={`fs-4 ${
                                    data?.now?.cancelled / data?.now?.total -
                                        data?.prev?.cancelled / data?.prev?.total >
                                    0
                                        ? 'text-success'
                                        : 'text-danger'
                                } fw-semibold`}
                            >
                                {validateResult(
                                    (data?.now?.cancelled / data?.now?.total -
                                        data?.prev?.cancelled / data?.prev?.total) *
                                        100
                                ).toFixed(2)}
                                %
                            </span>
                        </p>
                    </div>
                    <div className="col d-flex flex-column gap-2">
                        <p className="fs-3 fw-medium">Thời gian xử lý đơn hàng trung bình </p>
                        <p className="fs-1 fw-semibold">
                            {validateResult(data?.now?.processingTime / data?.now?.completed)} ngày
                        </p>
                        <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                            So với{' '}
                            {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}
                            <span
                                className={`fs-4 ${
                                    data?.now?.processingTime / data?.now?.completed -
                                        data?.prev?.processingTime / data?.prev?.completed >
                                    0
                                        ? 'text-success'
                                        : 'text-danger'
                                } fw-semibold`}
                            >
                                {validateResult(
                                    data?.now?.processingTime / data?.now?.completed -
                                        data?.prev?.processingTime / data?.prev?.completed
                                )}
                                ngày
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatisticOrder

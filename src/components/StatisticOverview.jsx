import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
    format,
    eachDayOfInterval,
    eachMonthOfInterval,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    getWeek,
    addDays,
    addMonths,
    addYears,
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { Line, Doughnut } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js'
import { useDispatch } from 'react-redux'
import { db } from '../firebase.config'
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { getAdminOrdersAction } from '../redux/slices/orderSilce'
import { sameDay, calculateDateDate } from '../utils/DateUtils'
import { validateResult } from '../utils/StringUtil'
import '../pages/admin/Statistic.scss'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)
function StatisticOverview({ dateRange, selectedDate }) {
    const dateData = useMemo(() => {
        return calculateDateDate(dateRange, selectedDate)
    }, [dateRange, selectedDate])
    const dispatch = useDispatch()
    const [activeDatasets, setActiveDatasets] = useState({
        revenue: true,
        orders: true,
        cancelled: true,
        visits: true,
    })
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
        setData(generateData())
        fetchClicks()
    }, [orders, dateData])

    const fetchClicks = async () => {
        const clicksRef = collection(db, 'bannersClicks')
        const q = query(
            clicksRef,
            where('__name__', '>=', format(new Date(dateData.prev.start), 'yyyy-MM-dd')),
            where('__name__', '<=', format(new Date(dateData.now.end), 'yyyy-MM-dd'))
        )
        try {
            const visits = {
                nowData: [],
                prevData: [],
            }
            const querySnapshot = await getDocs(q)
            const result = {}
            querySnapshot.forEach((doc) => {
                result[doc.id] = doc.data()
            })
            if (dateRange !== 'year') {
                for (let date = dateData.now.start; date <= dateData.now.end; date = addDays(date, 1)) {
                    const key = Object.keys(result).find((key) => sameDay(new Date(key), date))
                    if (key) {
                        visits.nowData.push(result[key].totalClicks)
                    } else {
                        visits.nowData.push(0)
                    }
                }
                for (let date = dateData.prev.start; date <= dateData.prev.end; date = addDays(date, 1)) {
                    const key = Object.keys(result).find((key) => sameDay(new Date(key), date))
                    if (key) {
                        visits.prevData.push(result[key].totalClicks)
                    } else {
                        visits.prevData.push(0)
                    }
                }
            } else {
                for (let month = 1; month <= 12; month++) {
                    const keys = Object.keys(result).filter(
                        (key) =>
                            new Date(key).getMonth() === month &&
                            new Date(key).getFullYear() === selectedDate.getFullYear()
                    )
                    if (keys.length > 0) {
                        visits.nowData.push(keys.reduce((acc, key) => acc + result[key].totalClicks, 0))
                    } else {
                        visits.nowData.push(0)
                    }
                }
                for (let month = 1; month <= 12; month++) {
                    const keys = Object.keys(result).filter(
                        (key) =>
                            new Date(key).getMonth() === month &&
                            new Date(key).getFullYear() === dateData.prev.start.getFullYear()
                    )
                    if (keys.length > 0) {
                        visits.prevData.push(keys.reduce((acc, key) => acc + result[key].totalClicks, 0))
                    } else {
                        visits.prevData.push(0)
                    }
                }
            }

            setData((prev) => ({ ...prev, visits }))
        } catch (error) {
            console.log(error)
        }
    }

    const generateLabels = () => {
        let dates = []
        switch (dateRange) {
            case 'week':
                // Lấy các ngày trong tuần của ngày được chọn
                dates = eachDayOfInterval({
                    start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
                    end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
                })
                return dates.map((date) => format(date, 'dd/MM', { locale: vi }))

            case 'month':
                // Lấy các ngày trong tháng được chọn
                dates = eachDayOfInterval({
                    start: startOfMonth(selectedDate),
                    end: endOfMonth(selectedDate),
                })
                return dates.map((date) => format(date, 'dd/MM', { locale: vi }))

            case 'year':
                // Lấy các tháng trong năm được chọn
                dates = eachMonthOfInterval({
                    start: startOfYear(selectedDate),
                    end: endOfYear(selectedDate),
                })
                return dates.map((date) => format(date, 'MM/yyyy', { locale: vi }))

            default:
                return []
        }
    }

    const generateData = () => {
        let nowRevenueData = []
        let prevRevenueData = []
        let nowOrderData = []
        let prevOrderData = []
        let nowCancelledData = []
        let prevCancelledData = []
        let nowCustomerData = []
        let prevCustomerData = []
        let nowReOrder = []
        let prevReOrder = []
        if (dateRange !== 'year') {
            for (let date = dateData.now.start; date <= dateData.now.end; date = addDays(date, 1)) {
                let totalPrice = 0
                let totalOrder = 0
                let totalCancelled = 0
                const orderCre = orders.filter((order) =>
                    sameDay(
                        new Date(
                            order.createdAt
                            // order.deleveredAt
                        ),
                        date
                    )
                )
                const orderDel = orders.filter((order) => sameDay(new Date(order.deleveredAt), date))
                //orderDel
                orderCre.forEach((order) => {
                    totalPrice += order.totalPrice
                    totalOrder += 1
                    if (order.status === 'cancelled') {
                        totalCancelled += 1
                    }
                    if (!nowCustomerData.find((customer) => customer._id === order.user._id)) {
                        nowCustomerData.push(order.user)
                    } else {
                        if (!nowReOrder.find((customer) => customer._id === order.user._id)) {
                            nowReOrder.push(order.user)
                        }
                    }
                })
                nowRevenueData.push(totalPrice)
                nowOrderData.push(totalOrder)
                nowCancelledData.push(totalCancelled)
            }
            for (let date = dateData.prev.start; date <= dateData.prev.end; date = addDays(date, 1)) {
                let totalPrice = 0
                let totalOrder = 0
                let totalCancelled = 0
                const orderCre = orders.filter((order) =>
                    sameDay(
                        new Date(
                            order.createdAt
                            // order.deleveredAt
                        ),
                        date
                    )
                )
                const orderDel = orders.filter((order) => sameDay(new Date(order.deleveredAt), date))
                //orderDel
                orderCre.forEach((order) => {
                    totalPrice += order.totalPrice
                    if (order.status === 'cancelled') {
                        totalCancelled += 1
                    }
                    totalOrder += 1
                    if (!prevCustomerData.find((customer) => customer._id === order.user._id)) {
                        prevCustomerData.push(order.user)
                    } else {
                        if (!prevReOrder.find((customer) => customer._id === order.user._id)) {
                            prevReOrder.push(order.user)
                        }
                    }
                })
                prevRevenueData.push(totalPrice)
                prevOrderData.push(totalOrder)
                prevCancelledData.push(totalCancelled)
            }
        } else {
            for (let month = 1; month <= 12; month++) {
                let totalPrice = 0
                let totalOrder = 0
                let totalCancelled = 0
                const orderCre = orders.filter(
                    (order) =>
                        new Date(order.createdAt).getMonth() === month &&
                        new Date(order.createdAt).getFullYear() === selectedDate.getFullYear()
                )
                const orderDel = orders.filter(
                    (order) =>
                        new Date(order.deleveredAt).getMonth() === month &&
                        new Date(order.deleveredAt).getFullYear() === selectedDate.getFullYear()
                )
                orderCre.forEach((order) => {
                    totalPrice += order.totalPrice
                    if (order.status === 'cancelled') {
                        totalCancelled += 1
                    }
                    totalOrder += 1
                    if (!nowCustomerData.find((customer) => customer._id === order.user._id)) {
                        nowCustomerData.push(order.user)
                    } else {
                        if (!nowReOrder.find((customer) => customer._id === order.user._id)) {
                            nowReOrder.push(order.user)
                        }
                    }
                })
                nowRevenueData.push(totalPrice)
                nowOrderData.push(totalOrder)
                nowCancelledData.push(totalCancelled)
            }
            for (let month = 1; month <= 12; month++) {
                let totalPrice = 0
                let totalOrder = 0
                let totalCancelled = 0
                const orderCre = orders.filter(
                    (order) =>
                        new Date(order.createdAt).getMonth() === month &&
                        new Date(order.createdAt).getFullYear() === dateData.prev.start.getFullYear()
                )
                const orderDel = orders.filter(
                    (order) =>
                        new Date(order.deleveredAt).getMonth() === month &&
                        new Date(order.deleveredAt).getFullYear() === dateData.prev.start.getFullYear()
                )
                orderCre.forEach((order) => {
                    totalPrice += order.totalPrice
                    if (order.status === 'cancelled') {
                        totalCancelled += 1
                    }
                    totalOrder += 1
                    if (!prevCustomerData.find((customer) => customer._id === order.user._id)) {
                        prevCustomerData.push(order.user)
                    } else {
                        if (!prevReOrder.find((customer) => customer._id === order.user._id)) {
                            prevReOrder.push(order.user)
                        }
                    }
                })
                prevRevenueData.push(totalPrice)
                prevOrderData.push(totalOrder)
                prevCancelledData.push(totalCancelled)
            }
        }
        return {
            revenue: {
                nowData: nowRevenueData,
                prevData: prevRevenueData,
            },
            order: {
                nowData: nowOrderData,
                prevData: prevOrderData,
            },
            cancelled: {
                nowData: nowCancelledData,
                prevData: prevCancelledData,
            },
            customer: {
                nowData: nowCustomerData,
                prevData: prevCustomerData,
                nowReOrder: nowReOrder,
                prevReOrder: prevReOrder,
            },
        }
    }

    const labels = useMemo(() => generateLabels(), [dateRange, selectedDate])

    // Data mẫu - sau này sẽ được thay thế bằng data thật từ API
    const chartData = useMemo(() => {
        return {
            labels,
            datasets: [
                {
                    label: 'Doanh số ',
                    data: activeDatasets.revenue ? data.revenue?.nowData : [],
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y-revenue',
                    hidden: !activeDatasets.revenue,
                },
                {
                    label: 'Đơn hàng',
                    data: activeDatasets.orders ? data.order?.nowData : [],
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y-orders',
                    hidden: !activeDatasets.orders,
                },
                {
                    label: 'Đơn đã hủy',
                    data: activeDatasets.cancelled ? data.cancelled?.nowData : [],
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y-cancelled',
                    hidden: !activeDatasets.cancelled,
                },
                {
                    label: 'Lượt truy cập',
                    data: activeDatasets.visits ? data.visits?.nowData : [],
                    borderColor: 'rgb(153, 102, 255)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    yAxisID: 'y-visits',
                    hidden: !activeDatasets.visits,
                },
            ],
        }
    }, [activeDatasets, dateData, data])

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || ''
                        if (label) {
                            label += ': '
                        }
                        if (context.dataset.yAxisID === 'y-revenue') {
                            label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                context.parsed.y
                            )
                        } else {
                            label += context.parsed.y
                        }
                        return label
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false,
                    drawTicks: true,
                },
            },
            y: {
                // Thêm trục y chung để hiển thị lưới
                display: true, // Hiển thị trục y
                position: 'left',
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false,
                    lineWidth: 1,
                },
                ticks: {
                    display: false, // Ẩn các số trên trục y
                },
            },
            'y-revenue': {
                display: false,
                position: 'left',
                grid: {
                    display: true,
                    color: 'rgba(0, 0, 0, 0.1)',
                    drawBorder: false,
                    drawTicks: false,
                },
            },
            'y-orders': {
                display: false,
                position: 'left',
                grid: {
                    display: false,
                },
            },
            'y-cancelled': {
                display: false,
                position: 'left',
                grid: {
                    display: false,
                },
            },
            'y-visits': {
                display: false,
                position: 'left',
                grid: {
                    display: false,
                },
            },
        },
    }

    const customerData = useMemo(() => {
        return {
            labels: ['Người mua mới', 'Người mua hiện tại'],
            datasets: [
                {
                    data: [
                        (data.customer?.nowData?.filter(
                            (customer) =>
                                new Date(customer.createdAt) <= new Date(dateData.now.end) &&
                                new Date(customer.createdAt) >= new Date(dateData.now.start)
                        ).length /
                            data.customer?.nowData?.length) *
                            100,
                        (data.customer?.nowData?.filter(
                            (customer) => new Date(customer.createdAt) < new Date(dateData.now.start)
                        ).length /
                            data.customer?.nowData?.length) *
                            100,
                    ], // 30% mới, 70% hiện tại
                    backgroundColor: [
                        'rgb(54, 162, 235)', // Màu cho người mua mới
                        'rgb(75, 192, 192)', // Màu cho người mua hiện tại
                    ],
                    borderColor: ['rgba(54, 162, 235, 0.8)', 'rgba(75, 192, 192, 0.8)'],
                    borderWidth: 1,
                    hoverOffset: 10,
                },
            ],
        }
    }, [dateData, data])

    const customerChartOptions = {
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
                        return `${label}: ${percentage}%`
                    },
                },
            },
        },
        cutout: '60%',
    }

    const toggleDataset = (dataset) => {
        setActiveDatasets((prev) => ({
            ...prev,
            [dataset]: !prev[dataset],
        }))
    }

    const genreratePercentNew = (now, prev) => {
        return (
            ((data.customer?.nowData?.filter(
                (customer) =>
                    new Date(customer.createdAt) <= new Date(dateData.now.end) &&
                    new Date(customer.createdAt) >= new Date(dateData.now.start)
            ).length -
                data.customer?.prevData?.filter(
                    (customer) =>
                        new Date(customer.createdAt) <= new Date(dateData.prev.end) &&
                        new Date(customer.createdAt) >= new Date(dateData.prev.start)
                ).length) /
                data.customer?.prevData?.filter(
                    (customer) =>
                        new Date(customer.createdAt) <= new Date(dateData.prev.end) &&
                        new Date(customer.createdAt) >= new Date(dateData.prev.start)
                ).length) *
            100
        )
    }

    const genreratePercentOld = () => {
        return (
            ((data.customer?.nowData?.filter((customer) => new Date(customer.createdAt) < new Date(dateData.now.start))
                .length -
                data.customer?.prevData?.filter(
                    (customer) => new Date(customer.createdAt) < new Date(dateData.prev.start)
                ).length) /
                data.customer?.prevData?.filter(
                    (customer) => new Date(customer.createdAt) < new Date(dateData.prev.start)
                ).length) *
            100
        )
    }
    return (
        <>
            <div className="d-flex flex-column gap-3 p-3 bg-white rounded-3 shadow-sm">
                <div className="row row-cols-4 g-3">
                    <div className="col cursor-pointer" onClick={() => toggleDataset('revenue')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${
                                activeDatasets.revenue ? 'border-revenue' : 'border-secondary'
                            }`}
                        >
                            <div className="fs-4 fw-medium">Doanh số</div>
                            <div className="fs-1 fw-medium">
                                {data.revenue?.nowData.reduce((acc, data) => acc + data, 0).toLocaleString('vi-VN') +
                                    ' '}
                                VND
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">
                                    So với{' '}
                                    {dateRange === 'week'
                                        ? 'tuần trước'
                                        : dateRange === 'month'
                                        ? 'tháng trước'
                                        : 'năm trước'}
                                </p>
                                <p
                                    className={`fs-4 text-success fw-medium ${
                                        data.revenue?.nowData.reduce((acc, data) => acc + data, 0) >=
                                        data.revenue?.prevData.reduce((acc, data) => acc + data, 0)
                                            ? 'text-success'
                                            : 'text-danger'
                                    }`}
                                >
                                    {validateResult(
                                        ((data.revenue?.nowData.reduce((acc, data) => acc + data, 0) -
                                            data.revenue?.prevData.reduce((acc, data) => acc + data, 0)) /
                                            data.revenue?.prevData.reduce((acc, data) => acc + data, 0)) *
                                            100
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col cursor-pointer" onClick={() => toggleDataset('orders')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${
                                activeDatasets.orders ? 'border-orders' : 'border-secondary'
                            }`}
                        >
                            <div className="fs-4 fw-medium">Đơn hàng</div>
                            <div className="fs-1 fw-medium">
                                {data.order?.nowData.reduce((acc, data) => acc + data, 0).toLocaleString('vi-VN')}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">
                                    So với{' '}
                                    {dateRange === 'week'
                                        ? 'tuần trước'
                                        : dateRange === 'month'
                                        ? 'tháng trước'
                                        : 'năm trước'}
                                </p>
                                <p
                                    className={`fs-4 text-success fw-medium ${
                                        data.order?.nowData.reduce((acc, data) => acc + data, 0) >=
                                        data.order?.prevData.reduce((acc, data) => acc + data, 0)
                                            ? 'text-success'
                                            : 'text-danger'
                                    }`}
                                >
                                    {validateResult(
                                        ((data.order?.nowData.reduce((acc, data) => acc + data, 0) -
                                            data.order?.prevData.reduce((acc, data) => acc + data, 0)) /
                                            data.order?.prevData.reduce((acc, data) => acc + data, 0)) *
                                            100
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col cursor-pointer" onClick={() => toggleDataset('cancelled')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${
                                activeDatasets.cancelled ? 'border-cancelled' : 'border-secondary'
                            }`}
                        >
                            <div className="fs-4 fw-medium">Đơn đã hủy</div>
                            <div className="fs-1 fw-medium">
                                {data.cancelled?.nowData.reduce((acc, data) => acc + data, 0).toLocaleString('vi-VN')}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">
                                    So với{' '}
                                    {dateRange === 'week'
                                        ? 'tuần trước'
                                        : dateRange === 'month'
                                        ? 'tháng trước'
                                        : 'năm trước'}
                                </p>
                                <p
                                    className={`fs-4 text-success fw-medium ${
                                        data.cancelled?.nowData.reduce((acc, data) => acc + data, 0) >=
                                        data.cancelled?.prevData.reduce((acc, data) => acc + data, 0)
                                            ? 'text-success'
                                            : 'text-danger'
                                    }`}
                                >
                                    {validateResult(
                                        ((data.cancelled?.nowData.reduce((acc, data) => acc + data, 0) -
                                            data.cancelled?.prevData.reduce((acc, data) => acc + data, 0)) /
                                            data.cancelled?.prevData.reduce((acc, data) => acc + data, 0)) *
                                            100
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col cursor-pointer" onClick={() => toggleDataset('visits')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${
                                activeDatasets.visits ? 'border-visits' : 'border-secondary'
                            }`}
                        >
                            <div className="fs-4 fw-medium">Lượt truy cập vào banner</div>
                            <div className="fs-1 fw-medium">
                                {data.visits?.nowData.reduce((acc, data) => acc + data, 0)}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">
                                    So với{' '}
                                    {dateRange === 'week'
                                        ? 'tuần trước'
                                        : dateRange === 'month'
                                        ? 'tháng trước'
                                        : 'năm trước'}
                                </p>
                                <p
                                    className={`fs-4 text-success fw-medium ${
                                        data.visits?.nowData.reduce((acc, data) => acc + data, 0) >=
                                        data.visits?.prevData.reduce((acc, data) => acc + data, 0)
                                            ? 'text-success'
                                            : 'text-danger'
                                    }`}
                                >
                                    {validateResult(
                                        (data.visits?.nowData.reduce((acc, data) => acc + data, 0) -
                                            data.visits?.prevData.reduce((acc, data) => acc + data, 0)) /
                                            data.visits?.prevData.reduce((acc, data) => acc + data, 0)
                                    ).toFixed(2)}
                                    %
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: '350px', width: '100%' }}>
                    <Line options={options} data={chartData} />
                </div>
            </div>
            <div className="d-flex flex-column gap-3 p-3 bg-white rounded-3 shadow-sm">
                <p className="fs-3 fw-semibold">Người mua</p>
                <div className="d-flex gap-3">
                    <div className="overview-chart__customer d-flex rounded-3 p-4 px-5 bg-white shadow-sm border">
                        <div style={{ height: 200 }}>
                            <Doughnut data={customerData} options={customerChartOptions} />
                        </div>
                    </div>
                    <div className="row row-cols-3 flex-grow-1 p-4 g-4 gx-5">
                        <div className="col d-flex flex-column gap-2">
                            <p className="fs-3 fw-medium">Tổng số người mua </p>
                            <p className="fs-1 fw-semibold">{data.customer?.nowData?.length}</p>
                            <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                                So với{' '}
                                {dateRange === 'week'
                                    ? 'tuần trước'
                                    : dateRange === 'month'
                                    ? 'tháng trước'
                                    : 'năm trước'}
                                <span
                                    className={`fs-4 ${
                                        data.customer?.nowData?.length >= data.customer?.prevData?.length
                                            ? 'text-success'
                                            : 'text-danger'
                                    } fw-semibold`}
                                >
                                    {validateResult(
                                        (data.customer?.nowData?.length - data.customer?.prevData?.length) /
                                            data.customer?.prevData?.length
                                    ) * 100}
                                    %
                                </span>
                            </p>
                        </div>

                        <div className="col d-flex flex-column gap-2">
                            <p className="fs-3 fw-medium">Người mua mới </p>
                            <p className="fs-1 fw-semibold">
                                {
                                    data.customer?.nowData?.filter(
                                        (customer) =>
                                            new Date(customer.createdAt) <= new Date(dateData.now.end) &&
                                            new Date(customer.createdAt) >= new Date(dateData.now.start)
                                    ).length
                                }
                            </p>
                            <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                                So với{' '}
                                {dateRange === 'week'
                                    ? 'tuần trước'
                                    : dateRange === 'month'
                                    ? 'tháng trước'
                                    : 'năm trước'}
                                <span
                                    className={`fs-4 ${
                                        genreratePercentNew() >= 0 ? 'text-success' : 'text-danger'
                                    } fw-semibold`}
                                >
                                    {validateResult(genreratePercentNew())}%
                                </span>
                            </p>
                        </div>
                        <div className="col d-flex flex-column gap-2">
                            <p className="fs-3 fw-medium">Người mua hiện tại </p>
                            <p className="fs-1 fw-semibold">
                                {
                                    data.customer?.nowData?.filter(
                                        (customer) => new Date(customer.createdAt) < new Date(dateData.now.start)
                                    ).length
                                }
                            </p>
                            <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                                So với{' '}
                                {dateRange === 'week'
                                    ? 'tuần trước'
                                    : dateRange === 'month'
                                    ? 'tháng trước'
                                    : 'năm trước'}
                                <span
                                    className={`fs-4 ${
                                        genreratePercentOld() >= 0 ? 'text-success' : 'text-danger'
                                    } fw-semibold`}
                                >
                                    {validateResult(genreratePercentOld())}%
                                </span>
                            </p>
                        </div>
                        <div className="col-12 border-bottom border-3 my-4"></div>
                        <div className="col d-flex flex-column gap-2">
                            <p className="fs-3 fw-medium">Tỉ lệ quay lại của người mua </p>
                            <p className="fs-1 fw-semibold">
                                {validateResult(
                                    (data.customer?.nowReOrder?.length / data.customer?.nowData?.length) * 100
                                ).toFixed(2)}
                                %
                            </p>
                            <p className="fs-4 text-muted fw-medium d-flex align-items-center gap-5">
                                So với{' '}
                                {dateRange === 'week'
                                    ? 'tuần trước'
                                    : dateRange === 'month'
                                    ? 'tháng trước'
                                    : 'năm trước'}
                                <span
                                    className={`fs-4 ${
                                        (data.customer?.nowReOrder?.length / data.customer?.nowData?.length) * 100 >=
                                        (data.customer?.prevReOrder?.length / data.customer?.prevData?.length) * 100
                                            ? 'text-success'
                                            : 'text-danger'
                                    } fw-semibold`}
                                >
                                    {validateResult(
                                        (data.customer?.nowReOrder?.length / data.customer?.nowData?.length) * 100 -
                                            (data.customer?.prevReOrder?.length / data.customer?.prevData?.length) * 100
                                    ).toFixed(2)}
                                    %
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default StatisticOverview

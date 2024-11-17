import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { format, eachDayOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns'
import { vi } from 'date-fns/locale'
import './Statistic.scss'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Statistic = () => {
    const [dateRange, setDateRange] = useState('week') // 'week', 'month', 'year'
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [activeDatasets, setActiveDatasets] = useState({
        revenue: true,
        orders: true,
        cancelled: true,
        visits: true,
    })

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

    const generateSampleData = (labels) => {
        return labels.map(() => Math.floor(Math.random() * 1000000))
    }

    const labels = useMemo(() => generateLabels(), [dateRange, selectedDate])

    // Data mẫu - sau này sẽ được thay thế bằng data thật từ API
    const chartData = {
        labels,
        datasets: [
            {
                label: 'Doanh số ',
                data: activeDatasets.revenue ? generateSampleData(labels) : [],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                yAxisID: 'y-revenue',
                hidden: !activeDatasets.revenue,
            },
            {
                label: 'Đơn hàng',
                data: activeDatasets.orders ? labels.map(() => Math.floor(Math.random() * 50)) : [],
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                yAxisID: 'y-orders',
                hidden: !activeDatasets.orders,
            },
            {
                label: 'Đơn đã hủy',
                data: activeDatasets.cancelled ? labels.map(() => Math.floor(Math.random() * 10)) : [],
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                yAxisID: 'y-cancelled',
                hidden: !activeDatasets.cancelled,
            },
            {
                label: 'Lượt truy cập',
                data: activeDatasets.visits ? labels.map(() => Math.floor(Math.random() * 300)) : [],
                borderColor: 'rgb(153, 102, 255)',
                backgroundColor: 'rgba(153, 102, 255, 0.2)',
                yAxisID: 'y-visits',
                hidden: !activeDatasets.visits,
            },
        ],
    }

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
                            label += new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(context.parsed.y)
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

    const toggleDataset = (dataset) => {
        setActiveDatasets((prev) => ({
            ...prev,
            [dataset]: !prev[dataset],
        }))
    }

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-4 p-3 bg-white rounded-3 shadow-sm">
                <button className="fs-4 fw-bold px-3 py-2 rounded-2 tab-button active shadow-sm">Tổng quan</button>
                <button className="fs-4 fw-bold px-3 py-2 rounded-2 tab-button shadow-sm">Doanh số</button>
                <button className="fs-4 fw-bold px-3 py-2 rounded-2 tab-button shadow-sm">Đơn hàng</button>
                <button className="fs-4 fw-bold px-3 py-2 rounded-2 tab-button shadow-sm">Sản phẩm</button>
            </div>
            <div className="d-flex flex-column gap-3 p-3 bg-white rounded-3 shadow-sm">
                <div className="d-flex gap-3 align-items-center">
                    <select className="form-select w-auto" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                        <option value="week">Theo tuần</option>
                        <option value="month">Theo tháng</option>
                        <option value="year">Theo năm</option>
                    </select>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat={dateRange === 'day' ? 'dd/MM/yyyy' : dateRange === 'month' ? 'MM/yyyy' : 'yyyy'}
                        showMonthYearPicker={dateRange === 'month'}
                        showYearPicker={dateRange === 'year'}
                        locale={vi}
                        className="w-auto"
                    />
                </div>
                <div className="row row-cols-4 g-3">
                    <div className="col cursor-pointer" onClick={() => toggleDataset('revenue')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${
                                activeDatasets.revenue ? 'border-revenue' : 'border-secondary'
                            }`}
                        >
                            <div className="fs-4 fw-medium">Doanh số</div>
                            <div className="fs-1 fw-medium">100.000.000 VNĐ</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">So với {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}</p>
                                <p className="fs-4 text-success fw-medium">10%</p>
                            </div>
                        </div>
                    </div>
                    <div className="col cursor-pointer" onClick={() => toggleDataset('orders')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${activeDatasets.orders ? 'border-orders' : 'border-secondary'}`}
                        >
                            <div className="fs-4 fw-medium">Đơn hàng</div>
                            <div className="fs-1 fw-medium">300</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">So với {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}</p>
                                <p className="fs-4 text-success fw-medium">10%</p>
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
                            <div className="fs-1 fw-medium">10</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">So với {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}</p>
                                <p className="fs-4 text-success fw-medium">10%</p>
                            </div>
                        </div>
                    </div>
                    <div className="col cursor-pointer" onClick={() => toggleDataset('visits')}>
                        <div
                            className={`d-flex flex-column gap-2 rounded-3 px-4 p-3 bg-white shadow border-top border-4 cursor-pointer ${activeDatasets.visits ? 'border-visits' : 'border-secondary'}`}
                        >
                            <div className="fs-4 fw-medium">Lượt truy cập</div>
                            <div className="fs-1 fw-medium">100.000</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <p className="fs-5 text-muted">So với {dateRange === 'week' ? 'tuần trước' : dateRange === 'month' ? 'tháng trước' : 'năm trước'}</p>
                                <p className="fs-4 text-success fw-medium">10%</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{ height: '350px', width: '100%' }}>
                    <Line options={options} data={chartData} />
                </div>
            </div>
        </div>
    )
}

export default Statistic

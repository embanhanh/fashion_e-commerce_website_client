import React, { useState, useEffect, useMemo, useCallback } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { vi } from 'date-fns/locale'
import { format, getWeek } from 'date-fns'

import StatisticOverview from '../../components/StatisticOverview'
import StatisticOrder from '../../components/StatisticOrder'
import StatisticProduct from '../../components/StatisticProduct'

const Statistic = () => {
    const [tab, setTab] = useState('overview')
    const [dateRange, setDateRange] = useState('week')
    const [selectedDate, setSelectedDate] = useState(new Date())

    const formatWeekLabel = (date) => {
        const weekNumber = getWeek(date, { weekStartsOn: 1 })
        const year = format(date, 'yyyy')
        return `Tuần ${weekNumber}, ${year}`
    }

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-4 p-3 bg-white rounded-3 shadow-sm">
                <button
                    className={`fs-4 fw-bold px-3 py-2 rounded-2 tab-button shadow-sm ${
                        tab === 'overview' ? 'active' : ''
                    }`}
                    onClick={() => setTab('overview')}
                >
                    Tổng quan
                </button>
                <button
                    className={`fs-4 fw-bold px-3 py-2 rounded-2 tab-button shadow-sm ${
                        tab === 'order' ? 'active' : ''
                    }`}
                    onClick={() => setTab('order')}
                >
                    Đơn hàng
                </button>
                <button
                    className={`fs-4 fw-bold px-3 py-2 rounded-2 tab-button shadow-sm ${
                        tab === 'product' ? 'active' : ''
                    }`}
                    onClick={() => setTab('product')}
                >
                    Sản phẩm
                </button>
            </div>
            <div className="d-flex gap-3 align-items-center">
                <select
                    className="statistic-select__option w-auto"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                >
                    <option value="week">Theo tuần</option>
                    <option value="month">Theo tháng</option>
                    <option value="year">Theo năm</option>
                </select>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                        if (date && date <= new Date()) setSelectedDate(date)
                    }}
                    dateFormat={
                        dateRange === 'week'
                            ? "'" + formatWeekLabel(selectedDate) + "'"
                            : dateRange === 'month'
                            ? 'MM/yyyy'
                            : 'yyyy'
                    }
                    showWeekPicker={dateRange === 'week'}
                    showMonthYearPicker={dateRange === 'month'}
                    showYearPicker={dateRange === 'year'}
                    locale={vi}
                    className="w-auto"
                />
            </div>
            {tab === 'overview' && <StatisticOverview dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'order' && <StatisticOrder dateRange={dateRange} selectedDate={selectedDate} />}
            {tab === 'product' && <StatisticProduct dateRange={dateRange} selectedDate={selectedDate} />}
        </div>
    )
}

export default Statistic

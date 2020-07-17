import React, { useState, useEffect } from 'react'
import moment from 'moment'
import * as QueryString from 'querystring'

import '../styles/Calendar.scss'

const Calendar = ({ history }) => {
  const [activeDate, setActiveDate] = useState(moment(new Date()))
  const [noOfDays, setNoOfDays] = useState(activeDate.daysInMonth())

  const [selectedMonth, setSelectedMonth] = useState(activeDate.format('MMMM'))
  const [selectedYear, setSelectedYear] = useState(activeDate.format('Y'))

  const [prevMonthDays, setPrevMonthDays] = useState()

  const [months] = useState(moment.months())

  // const months = moment.months()
  const years = [
    2010,
    2011,
    2012,
    2013,
    2014,
    2015,
    2016,
    2017,
    2018,
    2019,
    2020,
    2021,
    2022,
    2023,
    2024,
  ]

  useEffect(() => {
    const params = QueryString.parse(history.location.search)
    const monthParam = params['?month']
    if (monthParam) {
      setSelectedMonth(months[parseInt(monthParam)])
      setActiveDate((date) => moment(date).set('month', monthParam))
    }
  }, [history, months])

  useEffect(() => {
    const monthNumber = parseInt(moment().month(selectedMonth).format('MM'))
    setNoOfDays(
      moment(`${selectedYear}-${monthNumber}`, 'YYYY-MM').daysInMonth()
    )
    let prevMonth
    if (monthNumber === 1) {
      prevMonth = 11
    } else if (monthNumber === 12) {
      prevMonth = 0
    } else {
      prevMonth = monthNumber - 2
    }
    setPrevMonthDays(moment([selectedYear, prevMonth]).daysInMonth())
  }, [activeDate, selectedMonth, selectedYear])

  useEffect(() => {
    const monthNumber = moment().month(selectedMonth).format('MM')
    setActiveDate(date => moment(date).set('month', parseInt(monthNumber) - 1 ))
  }, [selectedMonth])

  useEffect(() => {
    setActiveDate(date => moment(date).set('year', selectedYear))
  }, [selectedYear])

  const onMonthChange = (value) => {
    setSelectedMonth(value)
    const monthNumber = months.indexOf(value)
    history.push({
      search: `?month=${monthNumber}`,
    })
  }

  const onPrev = () => {
    setActiveDate(moment(activeDate).subtract(1, 'month'))
    const monthNumber = months.indexOf(selectedMonth)
    if (monthNumber - 1 >= 0) {
      setSelectedMonth(months[monthNumber - 1])
    } else {
      setSelectedMonth(months[11])
      setSelectedYear(parseInt(selectedYear) - 1)
    }
    history.push({
      search: `?month=${monthNumber === 0 ? 11 : monthNumber - 1}`,
    })
  }

  const onNext = () => {
    setActiveDate(moment(activeDate).add(1, 'month'))
    const monthNumber = months.indexOf(selectedMonth)
    if (monthNumber + 1 <= 11) {
      setSelectedMonth(months[monthNumber + 1])
    } else {
      setSelectedMonth(months[0])
      setSelectedYear(parseInt(selectedYear) + 1)
    }
    history.push({
      search: `?month=${monthNumber === 11 ? 0 : monthNumber + 1}`,
    })
  }

  const firstDayOfMonth = () =>
    moment(moment(activeDate)).startOf('month').format('d')
  let prevMonth = []
  for (let i = 0; i < firstDayOfMonth(); i++) {
    prevMonth.unshift(
      <td className='prev' key={`blank-${i}`}>
        {`${prevMonthDays - i}`}
      </td>
    )
  }

  const lastDayOfMonth = () =>
    moment(moment(activeDate)).endOf('month').format('d')
  const lastDay = lastDayOfMonth()
  let nextMonth = []
  for (let i = 1; i <= 6 - lastDay; i++) {
    nextMonth.push(
      <td className='next' key={`blank-${i}`}>
        {`${i}`}
      </td>
    )
  }

  let daysInMonth = []
  for (let i = 1; i <= noOfDays; i++) {
    daysInMonth.push(
      <td
        key={`date-${i}`}
        className={parseInt(activeDate.format('D')) === i ? 'current' : ''}
      >
        {i}
      </td>
    )
  }

  var totalSlots = [...prevMonth, ...daysInMonth, ...nextMonth]
  let rows = []
  let cells = []

  totalSlots.forEach((row, i) => {
    if (i % 7 !== 0) {
      cells.push(row)
    } else {
      rows.push(cells)
      cells = []
      cells.push(row)
    }
    if (i === totalSlots.length - 1) {
      rows.push(cells)
    }
  })

  return (
    <div className='calendar-container'>
      <div className='month'>
        <button onClick={onPrev}>Prev</button>
        <select
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        >
          {months.map((month) => (
            <option key={month}>{month}</option>
          ))}
        </select>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          {years.map((year) => (
            <option key={year}>{year}</option>
          ))}
        </select>
        <button onClick={onNext}>Next</button>
      </div>
      <table className='calendar-day'>
        <thead>
          <tr>
            {moment.weekdaysShort().map((day) => (
              <th key={day} className='week-day'>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((date, i) => (
            <tr key={i}>{date}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Calendar

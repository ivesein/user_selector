import { Select, Row, Col } from 'antd';
import moment from 'moment';

// 通过id遍历找到日历
export const filterCurrent = (data, id) => {
    return data && data.filter(v => {
        return v.id === id
    })
}

// 将当前日历覆盖到 calendars 中
export const coverCalendars = (calendars, newCalendar) => {
    calendars.forEach((item, i) => {
        if (item.id === newCalendar.id) {
            calendars[i] = newCalendar;
            calendars[i].tag = "2";
        }
    })
    return calendars;
}

// 自定义日历头部
export const headerRender = ({ value, type, onChange, onTypeChange }) => {
    const start = 0;
    const end = 12;
    const monthOptions = [];

    const current = value.clone();
    const localeData = value.localeData();
    const months = [];

    for (let i = 0; i < 12; i++) {
        // current.month(i);
        months.push(localeData.monthsShort(current.month(i)));
    }

    for (let index = start; index < end; index++) {
        monthOptions.push(
            <Select.Option key={index}>
                {months[index]}
            </Select.Option>,
        );
    }
    const month = value.month();

    const year = value.year();
    const options = [];
    for (let i = year - 10; i < year + 10; i += 1) {
        options.push(
            <Select.Option key={i} value={i}>
                {i}
            </Select.Option>,
        );
    }
    return (
        <div style={{ padding: 8 }}>
            <Row gutter={8}>
                <Col>
                    <Select
                        size="middle"
                        dropdownMatchSelectWidth={false}
                        onChange={newYear => {
                            const now = value.clone().year(newYear);
                            onChange(now);
                        }}
                        value={String(year)}
                        style={{ width: 90 }}
                    >
                        {options}
                    </Select>
                </Col>
                <Col>
                    <Select
                        size="middle"
                        dropdownMatchSelectWidth={false}
                        value={String(month)}
                        onChange={selectedMonth => {
                            const newValue = value.clone().month(parseInt(selectedMonth, 10));
                            // newValue.month(parseInt(selectedMonth, 10));
                            onChange(newValue);
                        }}
                        style={{ width: 90 }}
                    >
                        {monthOptions}
                    </Select>
                </Col>
            </Row>
        </div>
    );
}

// 比较时间大小
export const compareTime = (time1, time2) => {
    let beforeTime = new Date(moment(time1, 'hh:mm').$d).getTime();
    let afterTime = new Date(moment(time2, 'hh:mm').$d).getTime();
    if (beforeTime > afterTime) {
        return false;
    } else if (beforeTime === afterTime) {
        return false;
    } else {
        return true;
    }
}

// 计算工作时长
export const getWorkTime = (startDate, endDate) => {
    if (startDate === null || endDate === null) return 0;
    let start = startDate.split(":");
    let end = endDate.split(":");
    let hour = Math.abs(end[0] - start[0]);
    let second = (end[1] - start[1]) / 30 * 0.5;
    return hour + second;
}

export function calcOver(date) {
    if (date === "") {
        return false
    }
    return Math.ceil((new Date(date) - new Date(new Date(date).getFullYear().toString())) / (24 * 60 * 60 * 1000)) + 1
}

export function calcLast(date) {
    if (date === "") {
        return false
    }
    return Math.ceil((new Date((new Date(date).getFullYear() + 1).toString()) - new Date(date)) / (24 * 60 * 60 * 1000)) + 1
}
import React, { Component } from 'react';
import styles from './index.module.scss';
import { ConfigProvider, message, Space, Button, Input, Select, Calendar, Table, Tag, Divider, TimePicker, DatePicker, InputNumber, Col, Row, Result } from 'antd';
import { customAlphabet } from 'nanoid';
import solarLunar from 'solarlunar';
// import { normalPostApi } from "@/api/commonApi";
// import { GET_CALENDAR, SAVE_CALENDAR } from "@/api/urlConfig";
import { getCalendarData, saveCalendarData } from '@/api/calendarApi';
import {
    filterCurrent,
    coverCalendars,
    headerRender,
    compareTime,
    getWorkTime,
    calcOver,
    calcLast,
} from '@/utils/calendar';
import {
    BTNSING,
    COMMONS_ENTERPRISE_CALENDAR_SAVEBTN,
    COMMONS_ENTERPRISE_CALENDAR_INSERTBTN,
    COMMONS_ENTERPRISE_CALENDAR_DELBTN,
    COMMONS_ENTERPRISE_CALENDAR_UPBTN,
    COMMONS_ENTERPRISE_CALENDAR_DOWNBTN
} from '@/utils/btnConfig';
import { getUserCache, checkPermission } from '@/utils/toolfunc';
import locale from 'antd/lib/locale/zh_CN';
import moment from 'moment';

moment.locale('zh - cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split(''),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split(''),
    weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split(''),
    weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
    longDateFormat: {
        LT: 'HH: mm',
        LTS: 'HH: mm: ss',
        L: 'YYYY/ MM / DD',
        LL: 'YYYY年M月D日',
        LLL: 'YYYY年M月D日Ah点mm分',
        LLLL: 'YYYY年M月D日ddddAh点mm分',
        l: 'YYYY/ M / D',
        ll: 'YYYY年M月D日',
        lll: 'YYYY年M月D日 HH: mm',
        llll: 'YYYY年M月D日dddd HH: mm'
    },
    meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
    meridiemHour: function (hour, meridiem) {
        if (hour === 12) {
            hour = 0;
        }
        if (meridiem === '凌晨' || meridiem === '早上' ||
            meridiem === '上午') {
            return hour;
        } else if (meridiem === '下午' || meridiem === '晚上') {
            return hour + 12;
        } else {
            // '中午'
            return hour >= 11 ? hour : hour + 12;
        }
    },
    meridiem: function (hour, minute, isLower) {
        var hm = hour * 100 + minute;
        if (hm < 600) {
            return '凌晨';
        } else if (hm < 900) {
            return '早上';
        } else if (hm < 1130) {
            return '上午';
        } else if (hm < 1230) {
            return '中午';
        } else if (hm < 1800) {
            return '下午';
        } else {
            return '晚上';
        }
    },
    calendar: {
        sameDay: '[今天]LT',
        nextDay: '[明天]LT',
        nextWeek: '[下]ddddLT',
        lastDay: '[昨天]LT',
        lastWeek: '[上]ddddLT',
        sameElse: 'L'
    },
    dayOfMonthOrdinalParse: /\d{1,2}(日|月|周)/,
    ordinal: function (number, period) {
        switch (period) {
            case 'd':
            case 'D':
            case 'DDD':
                return number + '日';
            case 'M':
                return number + '月';
            case 'w':
            case 'W':
                return number + '周';
            default:
                return number;
        }
    },
    relativeTime: {
        future: '% s内',
        past: '% s前',
        s: '几秒',
        ss: '% d 秒',
        m: '1 分钟',
        mm: '% d 分钟',
        h: '1 小时',
        hh: '% d 小时',
        d: '1 天',
        dd: '% d 天',
        M: '1 个月',
        MM: '% d 个月',
        y: '1 年',
        yy: '% d 年'
    },
    week: {
        // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
        dow: 1, // Monday is the first day of the week.
        doy: 4 // The week that contains Jan 4th is the first week of the year.
    }
});

const cacheData = getUserCache(BTNSING) ? getUserCache(BTNSING) : [];

const { Option } = Select;
const PickerWithType = ({ value, type, onChange, onBlur }) => {

    switch (type) {
        case "0": // 按日期
            return (
                <DatePicker
                    allowClear={false}
                    locale={locale}
                    value={moment(value)}
                    size="middle"
                    style={{ width: "100%" }}
                    onChange={onChange}
                />
            )
        case "1": // 周
            return (
                <Select
                    value={value}
                    size="middle"
                    style={{ width: '100%' }}
                    onChange={onChange}
                >
                    <Option value="0">日</Option>
                    <Option value="1">一</Option>
                    <Option value="2">二</Option>
                    <Option value="3">三</Option>
                    <Option value="4">四</Option>
                    <Option value="5">五</Option>
                    <Option value="6">六</Option>
                </Select>
            )
        case "2": // 月
            return (
                <InputNumber
                    key="month"
                    value={value}
                    min={1}
                    max={31}
                    size="middle"
                    style={{ width: "100%" }}
                    onChange={onChange}
                />
            )
        case "3": // 年
            return (
                <Input
                    key="year"
                    // defaultValue={value}
                    value={value}
                    size="middle"
                    maxLength={5}
                    onChange={onChange}
                    onBlur={onBlur}
                />
                // <DatePicker
                // format="MM-DD"
                // key="year"
                // size="middle"
                // allowClear={false}
                // value={moment(value)}
                // onChange={onChange}
                // />
            )
        default:
            break;
    }
}

class EnterpriseCalendar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            calendars: [],       // 所有的日历
            defaultCalendar: {}, // 默认日历
            currentCalendar: {}, // 当前日历
            morningStart: "",    // 工作日上午
            morningEnd: "",      // 工作日上午
            afternoonStart: "",  // 工作日下午
            afternoonEnd: "",    // 工作日下午
            workTime: "",        // 工作时间
            tableData: [],       // 例外表格数据
            selectedRowKeys: [], // 选择行
            columns: [
                {
                    title: '名称',
                    dataIndex: 'name',
                    key: 'name',
                    editable: true,
                    render: (text, record, index) => {
                        return (
                            <Input
                                key={record.id}
                                value={text}
                                size="middle"
                                maxLength={15}
                                onChange={e => this.changeExcName(e, index)}
                                onBlur={e => this.onblurExcName(e, record, index)}
                            />
                        )
                    }
                },
                {
                    title: '类型',
                    dataIndex: 'exceptionType',
                    key: 'exceptionType',
                    render: (text, record, index) => {
                        return (
                            <Select
                                key={record.id}
                                value={text}
                                size="middle"
                                style={{ width: '100%' }}
                                onChange={value => { this.changeExceptionType(value, record) }}
                            >
                                <Option value='0'>按日期</Option>
                                <Option value='1'>按周</Option>
                                <Option value='2'>按月</Option>
                                <Option value='3'>按年</Option>
                            </Select>
                        )
                    }
                },
                {
                    title: '开始',
                    dataIndex: 'startDate',
                    key: 'startDate',
                    render: (text, record, index) => {
                        return <PickerWithType
                            key={record.id}
                            value={text}
                            disabledDate={this.disabledDate}
                            type={record.exceptionType}
                            onChange={(value) => { this.handleDataStartChange(value, record, index) }}
                            onBlur={(e) => { this.handleDataStartBlur(e.target.value, record, index) }}
                        />
                    }
                },
                {
                    title: '结束',
                    dataIndex: 'endDate',
                    key: 'endDate',
                    render: (text, record, index) => {
                        return <PickerWithType
                            key={record.id}
                            value={text}
                            type={record.exceptionType}
                            onChange={(value) => { this.handleDataEndChange(value, record, index) }}
                            onBlur={(e) => { this.handleDataEndBlur(e.target.value, record, index) }}
                        />
                    }
                },
                {
                    title: '持续时间',
                    dataIndex: 'duration',
                    key: 'duration',
                    align: 'center',
                    render: (text, record, index) => {
                        switch (record.exceptionType) {
                            case "0": // 按日期
                                return (
                                    <InputNumber
                                        value={text}
                                        size='middle'
                                        min={1}
                                        style={{ width: "100%" }}
                                        onChange={(value) => this.changeDuration(value, record, index)}
                                    />
                                )
                            case "1": // 按周
                                return (
                                    <InputNumber
                                        value={text}
                                        size='middle'
                                        min='1'
                                        max='7'
                                        style={{ width: "100%" }}
                                        onChange={(value) => this.changeDuration(value, record, index)}
                                    />
                                )
                            case "2": // 按月
                                return (
                                    <InputNumber
                                        value={text}
                                        size='middle'
                                        min='1'
                                        max='31'
                                        style={{ width: "100%" }}
                                        onChange={(value) => this.changeDuration(value, record, index)}
                                    />
                                )
                            case "3": // 按年
                                return (
                                    <InputNumber
                                        value={text}
                                        size='middle'
                                        min='1'
                                        max='365'
                                        style={{ width: "100%" }}
                                        onChange={value => { this.changeDuration(value, record, index) }}
                                    />
                                )
                            default:
                                break;
                        }
                    }
                },
                {
                    title: '休息',
                    dataIndex: 'rest',
                    key: 'rest',
                    render: (text, record) => {
                        return (
                            <Select
                                key={record.id}
                                value={text}
                                size="middle"
                                style={{ width: "100%" }}
                                onChange={
                                    item => {
                                        this.selectRest(item, record)
                                    }
                                }
                            >
                                <Option value='1'>休息</Option>
                                <Option value='0'>工作</Option>
                            </Select>
                        )
                    }
                },
            ], // 表格每列自定义
            deletedCals: [],     // 删除的日历id
            deletedExps: [],     // 删除的例外id
            copyDate: "",        // 克隆的开始结束时间
            holidays: [],        // 节假日
            lunarCalendar: "",   // 农历
            chineseCalendar: "", // 天干地支
            saveLoading: false,
            // -------------- 权限 -------------
            saveBtn: checkPermission(cacheData, COMMONS_ENTERPRISE_CALENDAR_SAVEBTN), // 保存按钮
            insertBtn: checkPermission(cacheData, COMMONS_ENTERPRISE_CALENDAR_INSERTBTN), // 插入按钮
            delBtn: checkPermission(cacheData, COMMONS_ENTERPRISE_CALENDAR_DELBTN), // 删除按钮
            upBtn: checkPermission(cacheData, COMMONS_ENTERPRISE_CALENDAR_UPBTN), // 上移按钮
            downBtn: checkPermission(cacheData, COMMONS_ENTERPRISE_CALENDAR_DOWNBTN), // 下移按钮
        };
    }

    componentDidMount() {
        // 调接口获取数据
        this.getCalendar();
        let date = new Date();
        this.getLunarCalendar(moment(date));
    }

    render() {

        const {
            calendars,
            currentCalendar,
            workTime,
            morningStart,
            morningEnd,
            afternoonStart,
            afternoonEnd,
            tableData,
            selectedRowKeys,
            columns,
            lunarCalendar,
            chineseCalendar,
            saveLoading,
            saveBtn,
            insertBtn,
            delBtn,
            upBtn,
            downBtn
        } = this.state;

        const format = 'HH:mm';
        let calDom = (
            <div className={styles.box}>

                <Space className={styles.header}>
                    <span style={{ fontSize: 24, fontWeight: 700 }}>企业日历</span>
                    {
                        saveBtn ? <Button
                            type="primary"
                            loading={saveLoading}
                            onClick={this.saveCalendar
                            }>保存</Button> : null
                    }
                </Space>

                <div className={styles.container}>

                    <div className={styles.leftcalendar}>

                        <div style={{ width: '100%' }}>
                            <ConfigProvider locale={locale}>
                                <Calendar
                                    locale={locale}
                                    className={styles.card}
                                    dateFullCellRender={this.renderTable}
                                    fullscreen={false}
                                    headerRender={({ value, type, onChange, onTypeChange }) => headerRender({ value, type, onChange, onTypeChange })}
                                    onPanelChange={this.onPanelChange}
                                    onSelect={date => this.getLunarCalendar(date)}
                                />
                            </ConfigProvider>

                            <div className={styles.dayShow}>
                                <p className={styles.lunarCalendar}>{lunarCalendar}</p>
                                <p className={styles.chineseCalendar}>{chineseCalendar}</p>
                            </div>
                        </div>

                        <div className={styles.exc}>

                            <div className={styles.timeStyle}>

                                <Divider orientation="left" plain>
                                    <span>工作时间设置</span>
                                    <span style={{ width: 60, margin: '0 10px' }}>{workTime}</span>
                                    <span>小时</span>
                                </Divider>
                                <div style={{ marginLeft: 5, marginBottom: 5 }}>
                                    <span>工作日上午：</span>
                                    <ConfigProvider locale={locale}>
                                        <TimePicker
                                            locale={locale}
                                            defaultValue={moment(morningStart, format)}
                                            value={morningStart === null ? morningStart : moment(morningStart, format)}
                                            format={format}
                                            size="middle"
                                            style={{ width: '25%' }}
                                            onChange={time => this.setWorkTime(time, '1')}
                                        />
                                    </ConfigProvider>
                                    &nbsp; <span>至</span> &nbsp;
                                    <ConfigProvider locale={locale}>
                                        <TimePicker
                                            locale={locale}
                                            value={morningEnd === null ? morningEnd : moment(morningEnd, format)}
                                            format={format}
                                            size="middle"
                                            style={{ width: '25%' }}
                                            onChange={time => this.setWorkTime(time, '2')}
                                        />
                                    </ConfigProvider>
                                </div>
                                <div style={{ marginLeft: 5, paddingTop: 5 }}>
                                    <span>工作日下午：</span>
                                    <ConfigProvider locale={locale}>
                                        <TimePicker
                                            locale={locale}
                                            value={afternoonStart === null ? afternoonStart : moment(afternoonStart, format)}
                                            format={format}
                                            size="middle"
                                            style={{ width: '25%' }}
                                            onChange={time => this.setWorkTime(time, '3')}
                                        />
                                    </ConfigProvider>
                                    &nbsp; <span>至</span> &nbsp;
                                    <ConfigProvider locale={locale}>
                                        <TimePicker
                                            locale={locale}
                                            value={afternoonEnd === null ? afternoonEnd : moment(afternoonEnd, format)}
                                            format={format}
                                            size="middle"
                                            style={{ width: '25%' }}
                                            onChange={time => this.setWorkTime(time, '4')}
                                        />
                                    </ConfigProvider>
                                </div>

                            </div>

                            <div className={styles.tuliStyle}>

                                <Divider plain>
                                    <span>图例</span>
                                </Divider>

                                <Space
                                    direction='vertical'
                                    size={15}
                                    style={{ marginLeft: 20, marginTop: 5 }}
                                >
                                    <Tag>工作</Tag>
                                    <Tag color="red">休息</Tag>
                                </Space>

                            </div>

                        </div>

                        <div className={styles.footer}>
                            <b style={{ fontSize: 16 }}>提示：</b>
                            {/* <br /> */}
                            <p style={{ fontSize: 14 }}>当同一日期设置多个休息/工作时间时，以最后一条设置为准。</p>
                        </div>
                    </div>

                    <div className={styles.righttable}>

                        <Divider orientation="left">设置例外</Divider>
                        <Space style={{ marginLeft: 20, marginBottom: 20 }}>
                            {insertBtn ? <Button type="primary" onClick={() => this.addExcTable(1)}>插入</Button> : null}
                            {delBtn ? <Button type="primary" onClick={this.delExcTable}>删除</Button> : null}
                            {upBtn ? <Button type="primary" onClick={() => this.move(true)}>上移</Button> : null}
                            {downBtn ? <Button type="primary" onClick={() => this.move(false)}>下移</Button> : null}
                        </Space>
                        <Table
                            rowKey="id"
                            dataSource={tableData}
                            columns={columns}
                            scroll={{ y: 500 }}
                            style={{ maxWidth: 1080 }}
                            bordered
                            size="middle"
                            hideOnSinglePage="true"
                            rowSelection={{
                                selectedRowKeys,
                                onChange: this.onSelectChange
                            }}
                        />

                    </div>

                </div>

            </div >
        )
        let errDom = (
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Result
                    status="404"
                    title="暂无数据！"
                />
            </div>
        )

        let DOM = calendars && calendars.length < 0 ? errDom : calDom;

        return (
            <>
                {/* <div style={{ width: '100%', height: 64 }}>123</div> */}
                {DOM}
            </>
        );
    }

    // --------------------------- 初始化参数 ---------------------------

    // 将例外覆盖到当前日历中
    coverCurrentCalendar = (currentCalendar, excData) => { }
    // --------------------------- 初始化参数 ---------------------------

    // --------------------------- 左边日历 - Start ---------------------------
    // 自定义日历 change
    onPanelChange = (value, mode) => {
        // console.log(value, mode);
    }

    // 修改工作时间
    changeWorkTime = (value, time) => {
        let morningDur = "";
        let afternoonDur = "";
        let workDur = "";
        switch (value) {
            case '1':
                morningDur = getWorkTime(time, this.state.morningEnd);
                afternoonDur = getWorkTime(this.state.afternoonStart, this.state.afternoonEnd);
                workDur = morningDur + afternoonDur;
                break;

            case '2':
                morningDur = getWorkTime(this.state.morningStart, time);
                afternoonDur = getWorkTime(this.state.afternoonStart, this.state.afternoonEnd);
                workDur = morningDur + afternoonDur;
                break;

            case '3':
                morningDur = getWorkTime(this.state.morningStart, this.state.morningEnd);
                afternoonDur = getWorkTime(time, this.state.afternoonEnd);
                workDur = morningDur + afternoonDur;
                break;

            case '4':
                morningDur = getWorkTime(this.state.morningStart, this.state.morningEnd);
                afternoonDur = getWorkTime(this.state.afternoonStart, time);
                workDur = morningDur + afternoonDur;
                break;

            default:
                break;
        }
        return workDur;
    }

    /**
     * value: 判断时段
     * 1 - 工作日上午 - 开始
     * 2 - 工作日上午 - 结束
     * 3 - 工作日下午 - 开始
     * 4 - 工作日下午 - 结束
     */
    setWorkTime = (time, value) => {

        const { morningStart, morningEnd, afternoonStart, afternoonEnd } = this.state;
        // 判断两个时间段是否都为 null 
        // console.log(time);
        if (time === null) {
            let workTimeDur = ''
            switch (value) {
                case '1':
                    if (afternoonStart === null && afternoonEnd === null) {
                        message.error('工作时间不能为空！')
                    } else {
                        if (morningEnd === null) {
                            workTimeDur = getWorkTime(afternoonStart, afternoonEnd);
                            let newCalendar = JSON.parse(JSON.stringify(this.state.currentCalendar));
                            newCalendar.morningStart = null;
                            newCalendar.morningEnd = null;
                            newCalendar.tag = "2";
                            this.setState({
                                workTime: workTimeDur.toFixed(2),
                                currentCalendar: newCalendar,
                                calendars: coverCalendars(this.state.calendars, newCalendar)
                            })
                        }
                        this.setState({
                            morningStart: null
                        })

                    }
                    break;

                case '2':
                    if (afternoonStart === null && afternoonEnd === null) {
                        message.error('工作时间不能为空！')
                    } else {
                        if (morningStart === null) {
                            workTimeDur = getWorkTime(afternoonStart, afternoonEnd)
                            let newCalendar = JSON.parse(JSON.stringify(this.state.currentCalendar));
                            newCalendar.morningStart = null;
                            newCalendar.morningEnd = null;
                            newCalendar.tag = "2";
                            this.setState({
                                workTime: workTimeDur.toFixed(2),
                                currentCalendar: newCalendar,
                                calendars: coverCalendars(this.state.calendars, newCalendar)
                            })
                        }
                        this.setState({
                            morningEnd: null
                        })

                    }
                    break;

                case '3':
                    if (morningStart === null && morningEnd === null) {
                        message.error('工作时间不能为空！')
                    } else {
                        if (afternoonEnd === null) {
                            workTimeDur = getWorkTime(morningStart, morningEnd)
                            let newCalendar = JSON.parse(JSON.stringify(this.state.currentCalendar));
                            newCalendar.afternoonStart = null;
                            newCalendar.afternoonEnd = null;
                            newCalendar.tag = "2";
                            this.setState({
                                workTime: workTimeDur.toFixed(2),
                                currentCalendar: newCalendar,
                                calendars: coverCalendars(this.state.calendars, newCalendar)
                            })
                        }
                        this.setState({
                            afternoonStart: null
                        })

                    }
                    break;

                case '4':
                    if (morningStart === null && morningEnd === null) {
                        message.error('工作时间不能为空！')
                    } else {
                        if (afternoonStart === null) {
                            workTimeDur = getWorkTime(morningStart, morningEnd)
                            let newCalendar = JSON.parse(JSON.stringify(this.state.currentCalendar));
                            newCalendar.afternoonStart = null;
                            newCalendar.afternoonEnd = null;
                            newCalendar.tag = "2";
                            this.setState({
                                workTime: workTimeDur.toFixed(2),
                                currentCalendar: newCalendar,
                                calendars: coverCalendars(this.state.calendars, newCalendar)
                            })
                        }
                        this.setState({
                            afternoonEnd: null
                        })

                    }
                    break;

                default:
                    break;
            }
        } else {
            let morningStartTime = ''; // 修改后的上午开始
            let morningEndTime = '';   // 修改后的上午结束
            let afternoonStartTime = ''; // 修改后的下午开始
            let afternoonEndTime = '';   // 修改后的下午结束

            // 修改当前日历坐在日历的工作时间
            let newCalendars = JSON.parse(JSON.stringify(this.state.calendars));
            newCalendars.map(v => {
                if (v.id === this.state.currentCalendar.id) {
                    let Htime = time.$H, mtime = time.$m;
                    if (time.$H < 10) {
                        Htime = 0 + "" + time.$H
                    }
                    if (time.$m < 10) {
                        mtime = 0 + "" + time.$m
                    }
                    v.tag = "2";

                    switch (value) {
                        case '1':
                            v.morningStart = Htime + ":" + mtime;
                            morningStartTime = Htime + ":" + mtime;
                            break;
                        case '2':
                            v.morningEnd = Htime + ":" + mtime;
                            morningEndTime = Htime + ":" + mtime;
                            break;
                        case '3':
                            v.afternoonStart = Htime + ":" + mtime;
                            afternoonStartTime = Htime + ":" + mtime;
                            break;
                        case '4':
                            v.afternoonEnd = Htime + ":" + mtime;
                            afternoonEndTime = Htime + ":" + mtime;
                            break;
                        default:
                            break;
                    }
                }
            })
            let flag = false;
            // 计算工作时间
            switch (value) {
                case '1':
                    flag = compareTime(morningStartTime, this.state.morningEnd); // 完成时间必须在开始时间之后
                    flag && this.setState({
                        morningStart: morningStartTime,
                        workTime: this.changeWorkTime(value, morningStartTime).toFixed(2),
                        currentCalendar: { ...this.state.currentCalendar, ...{ morningStart: morningStartTime } },
                        calendars: newCalendars
                    })
                    break;
                case '2':
                    flag = compareTime(this.state.morningStart, morningEndTime);
                    flag && this.setState({
                        morningEnd: morningEndTime,
                        workTime: this.changeWorkTime(value, morningEndTime).toFixed(2),
                        currentCalendar: { ...this.state.currentCalendar, ...{ morningEnd: morningEndTime } },
                        calendars: newCalendars
                    })
                    break;
                case '3':
                    flag = compareTime(afternoonStartTime, this.state.afternoonEnd);
                    flag && this.setState({
                        afternoonStart: afternoonStartTime,
                        workTime: this.changeWorkTime(value, afternoonStartTime).toFixed(2),
                        currentCalendar: { ...this.state.currentCalendar, ...{ afternoonStart: afternoonStartTime } },
                        calendars: newCalendars
                    })
                    break;
                case '4':
                    flag = compareTime(this.state.afternoonStart, afternoonEndTime);
                    flag && this.setState({
                        afternoonEnd: afternoonEndTime,
                        workTime: this.changeWorkTime(value, afternoonEndTime).toFixed(2),
                        currentCalendar: { ...this.state.currentCalendar, ...{ afternoonEnd: afternoonEndTime } },
                        calendars: newCalendars
                    })
                    break;
                default:
                    break;
            }
            if (!flag) {
                message.error('完成时间必须在开始时间之后！');
                let dur1 = getWorkTime(this.state.morningStart, this.state.morningEnd)
                let dur2 = getWorkTime(this.state.afternoonStart, this.state.afternoonEnd)
                let dur = Number(dur1 + dur2).toFixed(2)
                this.setState({
                    workTime: dur
                })
                return false;
            }
        }
    }
    // 计算例外渲染
    excRenderColor = (e, data) => {

        let weekStyles = e.$W === 6 || e.$W === 0; // 周末设置
        let renderColor = styles.workStyle; // className样式 - 例外颜色
        renderColor = weekStyles ? styles.restStyle : styles.workStyle; // 周末设置

        data && data.forEach(item => {

            switch (item.exceptionType) { // 例外类型
                case "0": // 按日期
                    let start = new Date(item.startDate).getTime();
                    let end = new Date(item.endDate).getTime();
                    let etime = new Date(e.$y + "-" + (e.$M + 1) + "-" + e.$D).getTime();

                    if (start === end) {
                        if (etime === start || etime === end) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else if (start < end) {
                        if (etime >= start && etime <= end) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    }
                    break;
                case "1": // 按周
                    if (item.startDate < item.endDate) {
                        if (e.$W >= item.startDate && e.$W <= item.endDate) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else if (item.startDate === item.endDate) {
                        if (e.$W === Number(item.startDate) && e.$W === Number(item.endDate)) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else if (item.startDate > item.endDate) {
                        if (e.$W > item.endDate && e.$W < item.startDate) {
                            // 不绘制 不符合条件
                        } else {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    }
                    break;
                case "2": // 按月
                    let starts = Number(item.startDate);
                    let ends = Number(item.endDate);
                    let eDay = e.$D;
                    if (starts < ends) {
                        if (eDay >= starts && eDay <= ends) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else if (starts === ends) {
                        if (eDay === starts || eDay === ends) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else if (starts > ends) {
                        if (eDay >= starts || eDay <= ends) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    }
                    break;
                case "3": // 按年
                    let yearStart = new Date(e.$y + "-" + item.startDate + " " + "08:00:00").getTime(); // 开始
                    let yearEnd = new Date(e.$y + "-" + item.endDate + " " + "08:00:00").getTime(); // 结束
                    let eTimes = new Date(e.$y + "-" + (e.$M + 1) + "-" + e.$D + " " + "08:00:00").getTime(); // 日历每天
                    if (yearStart < yearEnd) {
                        if (eTimes >= yearStart && eTimes <= yearEnd) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else if (yearStart === yearEnd) {
                        if (eTimes === yearStart || eTimes === yearEnd) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    } else {
                        if (eTimes >= yearStart || eTimes <= yearEnd) {
                            if (item.rest === "1") {
                                return renderColor = styles.restStyle;
                            } else if (item.rest === "0") {
                                return renderColor = styles.workStyle;
                            }
                        }
                    }
                    break;
                default:
                    break;
            }
        })

        return renderColor;
    }
    // 日历表格渲染
    renderTable = (e) => {

        // 如果 e 在 startTime ~ endTime 中间 type : 0-休 1-班
        let holiday = this.addHolidays(e, this.state.holidays);
        let nowDate = moment(new Date()); // 当天日期
        let nowDateStyles = (e.$y === nowDate.$y && e.$M === nowDate.$M && e.$D === nowDate.$D); // 当日设置
        let nowDateStyle = nowDateStyles ? styles.nowStyle : ""; // 当日设置
        // let excData = this.state.currentCalendar.calendarExceptions; // 例外表格数据
        let excData = this.state.tableData; // 例外表格数据
        let renderColor = this.excRenderColor(e, excData);
        return (
            <div className={styles.calendarStyle + " " + nowDateStyle + " " + renderColor}>
                <div>
                    <span className={styles.topDay}>{e.$D}</span>
                    <span className={styles.holiday}>{holiday}</span>
                </div>
                <span style={{ fontSize: 12 }}>
                    {
                        solarLunar.solar2lunar(e.$y, e.$M + 1, e.$D).term ? solarLunar.solar2lunar(e.$y, e.$M + 1, e.$D).term : solarLunar.solar2lunar(e.$y, e.$M + 1, e.$D).dayCn
                    }
                </span>
            </div>
        )
    }
    // 添加节假日
    addHolidays = (e, data) => {
        // console.log(data);
        let holiday = (<></>);
        let time = e.$y + '-' + ((e.$M + 1) < 10 ? '0' + (e.$M + 1) : (e.$M + 1)) + '-' + (e.$D < 10 ? "0" + e.$D : e.$D);
        data && data.length > 0 && data.forEach((v) => {
            let currentDay = new Date(time).getTime();
            let startTime = new Date(v.startTime).getTime();
            let endTime = new Date(v.endTime).getTime();
            let flag = (currentDay >= startTime && currentDay <= endTime);
            if (flag && v.type === "0") {
                holiday = (<span style={{ color: 'green' }}>休</span>)
            } else if (flag && v.type === "1") {
                holiday = (<span style={{ color: 'red' }}>班</span>)
            }
        })
        return holiday;
    }
    // 单击某天获取农历天干地支
    getLunarCalendar = date => {
        // console.log(date);
        let dateTime = solarLunar.solar2lunar(date.$y, date.$M + 1, date.$D);
        let lunarCalendar = "农历 " + dateTime.monthCn + dateTime.dayCn;
        let chineseCalendar = dateTime.gzYear + dateTime.animal + "年 " + dateTime.gzMonth + "月 " + dateTime.gzDay + "日";
        this.setState({
            lunarCalendar: lunarCalendar,
            chineseCalendar: chineseCalendar
        })
    }

    // --------------------------- 左边日历 - End ---------------------------

    // --------------------------- 右边例外表格 - Start ---------------------------
    // 例外表格 选中行
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys });
    }
    // 例外名称 编辑
    changeExcName = (e, rowIndex) => {
        const value = e.target.value.trim();
        let newTableData = JSON.parse(JSON.stringify(this.state.tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(this.state.currentCalendar));

        newTableData[rowIndex].name = value;
        newTableData[rowIndex].tag = newTableData[rowIndex].flag ? "2" : "0";
        newCurCalendar.calendarExceptions = newTableData;
        this.setState({
            tableData: newTableData,
            currentCalendar: newCurCalendar
        })

    }
    // 例外名称编辑 失去焦点
    onblurExcName = (e, record, index) => {
        const value = e.target.value.trim();
        const { tableData, currentCalendar, calendars } = this.state;
        let newTableData = JSON.parse(JSON.stringify(tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(currentCalendar));
        let newCalendars = JSON.parse(JSON.stringify(calendars));

        if (value === "") {
            message.info("例外名称不为空！");
            let newCalendar = filterCurrent(calendars, currentCalendar.id);
            newCurCalendar = newCalendar[0];
            newTableData = newCalendar[0].calendarExceptions;
            this.setState({
                tableData: newTableData,
                currentCalendar: newCurCalendar
            })
        } else {
            // 禁止重名
            let newCalendarNames = this.state.tableData.map(v => v.name);
            newCalendarNames.splice(index, 1)
            if (newCalendarNames.indexOf(value) > -1) {
                message.error("此名称已被其他例外使用，请输入其他名称!")
                let newCalendar = filterCurrent(calendars, currentCalendar.id);
                newCurCalendar = newCalendar[0];
                newTableData = newCalendar[0].calendarExceptions;
                this.setState({
                    tableData: newTableData,
                    currentCalendar: newCurCalendar
                })
            } else {
                record.name = value;
                record.tag = record.flag ? "2" : "0";
                newTableData[index] = record;
                newCurCalendar.calendarExceptions = newTableData;
                newCalendars = coverCalendars(newCalendars, newCurCalendar);
                this.setState({
                    tableData: newTableData,
                    currentCalendar: newCurCalendar,
                    calendars: newCalendars
                })
            }
        }
    }
    // 切换例外类型
    changeExceptionType = (value, record) => {
        const date = new Date();
        switch (value) {
            case "0":// 按日期
                const dates1 = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                record.startDate = dates1;
                record.endDate = dates1;
                record.duration = "1";
                break;
            case "1":// 按周
                record.startDate = "0";
                record.endDate = "0";
                record.duration = "1";
                break;
            case "2":// 按月
                record.startDate = "1";
                record.endDate = "1";
                record.duration = "1";
                break;
            case "3":// 按年
                let month = date.getMonth() + 1;
                let day = date.getDate();
                if ((date.getMonth() + 1) < 10) {
                    month = "0" + (date.getMonth() + 1);
                }
                if (day < 10) {
                    day = "0" + date.getDate();
                }
                let dates2 = month + '-' + day;
                record.startDate = dates2;
                record.endDate = dates2;
                record.duration = "1";
                break;
            default:
                break;
        };
        record.exceptionType = value;
        record.tag = record.flag ? "2" : "0";
        let newCalendar = JSON.parse(JSON.stringify(this.state.currentCalendar));
        newCalendar.calendarExceptions.forEach(v => {
            if (v.id === record.id) {
                v = record
            }
        });
        this.setState({
            tableData: newCalendar.calendarExceptions,
            currentCalendar: newCalendar,
            calendars: coverCalendars(this.state.calendars, newCalendar)
        })
    }
    // 禁选时间
    disabledDate = current => {
        if (!current) {
            return false
        } else {
            return current && current < moment().endOf('day');
        }
    }
    // 开始时间改变
    handleDataStartChange = (value, record, index) => {

        let { tableData, currentCalendar, calendars } = this.state;
        let newTableData = JSON.parse(JSON.stringify(tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(currentCalendar));
        let newCalendars = JSON.parse(JSON.stringify(calendars));

        // 原来的开始时间 - berforeStartDate / 现在的开始时间 - nowStartDate / 现在的结束时间 - nowEndDate
        // 现在的开始时间 不能比 现在的结束时间 大
        switch (record.exceptionType) {
            case "0": // 日期
                let nowEndDate = new Date(record.endDate).getTime(); // 原来的结束时间
                let nowStartDate = new Date(value.$y + "-" + (value.$M + 1) + "-" + value.$D).getTime(); // 改变后的开始时间
                // 若改变后的开始时间>结束时间，则改变结束时间与开始时间一样
                if (nowStartDate > nowEndDate) {
                    // message.error("例外开始时间不能大于结束时间！");
                    record.endDate = value.$y + "-" + (value.$M + 1) + "-" + value.$D;
                    record.duration = '1';
                } else {
                    record.duration = Math.abs((nowStartDate - nowEndDate) / 1000 / 3600 / 24) + 1;
                }
                record.startDate = value.$y + "-" + (value.$M + 1) + "-" + value.$D;
                break;
            case "1": // 周
                let beforeWeek = record.endDate; // 结束时间
                let afterWeek = value; // 改变后的开始时间
                if (afterWeek > beforeWeek) {
                    record.duration = (Math.abs(7 - Number(afterWeek) + Number(beforeWeek) + 1)).toString();
                } else {
                    record.duration = (Math.abs(afterWeek - beforeWeek) + 1).toString();
                }
                record.startDate = value;
                break;
            case "2": // 月
                if (value === "" || value === null) return;
                let beforeMonth = Number(record.endDate); // 结束时间
                let afterMonth = Number(value); // 改变后的开始时间
                if (afterMonth > beforeMonth) {
                    record.duration = (31 - Number(afterMonth) + Number(beforeMonth) + 1).toString();
                } else {
                    record.duration = (Math.abs(afterMonth - beforeMonth) + 1).toString();
                }
                record.startDate = value.toString();
                break;
            case "3": // 年
                newTableData[index].startDate = value.target.value;
                break;
            default:
                break;
        }
        if (record.exceptionType === "3") {
            this.setState({
                tableData: newTableData
            })
        } else {
            record.tag = record.flag ? "2" : "0";
            newTableData[index] = record;
            newCurCalendar.calendarExceptions = newTableData;
            newCalendars = coverCalendars(newCalendars, newCurCalendar);
            this.setState({
                tableData: newTableData,
                currentCalendar: newCurCalendar,
                calendars: newCalendars
            })
        }
    }
    // 结束时间改变
    handleDataEndChange = (value, record, index) => {

        let { tableData, currentCalendar, calendars } = this.state;
        let newTableData = JSON.parse(JSON.stringify(tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(currentCalendar));
        let newCalendars = JSON.parse(JSON.stringify(calendars));

        switch (record.exceptionType) {
            case "0": // 按日期
                let beforeDate = new Date(record.startDate).getTime(); // 开始时间
                let afterDate = new Date(value.$y + "-" + (value.$M + 1) + "-" + value.$D).getTime(); // 改变后的结束时间
                if (beforeDate > afterDate) {
                    message.error("例外结束时间不能比开始时间小！");
                    record.duration = '1';
                    record.endDate = record.startDate;
                } else {
                    record.duration = ((Math.abs((afterDate - beforeDate) / 1000 / 3600 / 24) + 1)).toString();
                    record.endDate = value.$y + "-" + (value.$M + 1) + "-" + value.$D;
                }
                break;
            case "1": // 按周
                let beforeWeek = record.startDate; // 开始时间
                let afterWeek = value; // 改变后的结束时间
                if (afterWeek < beforeWeek) {
                    record.duration = (Math.abs(7 - Number(beforeWeek) + Number(afterWeek) + 1)).toString();
                } else {
                    record.duration = (Math.abs(afterWeek - beforeWeek) + 1).toString();
                }
                record.endDate = value;
                break;
            case "2": // 按月
                if (value === "" || value === null) return;
                let beforeMonth = record.startDate; // 开始时间
                let afterMonth = value; // 改变后的结束时间
                if (afterMonth < beforeMonth) {
                    record.duration = (31 - Number(beforeMonth) + Number(afterMonth) + 1).toString();
                } else {
                    record.duration = (Math.abs(afterMonth - beforeMonth) + 1).toString();
                }
                record.endDate = value.toString();
                break;
            case "3": // 按年
                newTableData[index].endDate = value.target.value;
                break;
            default:
                break;
        }
        if (record.exceptionType === "3") {
            this.setState({
                tableData: newTableData
            })
        } else {
            record.tag = record.flag ? "2" : "0";
            newTableData[index] = record;
            newCurCalendar.calendarExceptions = newTableData;
            newCalendars = coverCalendars(newCalendars, newCurCalendar);
            this.setState({
                tableData: newTableData,
                currentCalendar: newCurCalendar,
                calendars: newCalendars
            })
        }
    }
    // 限制月份所在的天数
    setDays = (editDate) => {
        let month = ['04', '06', '09', '11'];

        if (editDate[0] < 10 && editDate[0].charAt(0) !== "0") {
            editDate[0] = "0" + editDate[0]
        }
        if (editDate[1] < 10 && editDate[1].charAt(0) !== "0") {
            editDate[1] = "0" + editDate[1]
        }
        if ((month.indexOf(editDate[0]) > -1) && (editDate[1] === '31')) {
            editDate[1] = '30'
        } else if (editDate[0] === "02" && editDate[1] > 28) {
            editDate[1] = '28'
        }

        return editDate = editDate[0] + "-" + editDate[1]; // 修改格式
    }
    // 按年 校验开始结束是否符合
    handleDataStartBlur = (value, record, index) => {

        const { tableData, currentCalendar, calendars } = this.state;
        let newTableData = JSON.parse(JSON.stringify(tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(currentCalendar));
        let newCalendars = JSON.parse(JSON.stringify(calendars));

        if (record.exceptionType === "3") {
            // let reg = /^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
            let reg = /^(0?[1-9]|1[0-2])-((0?[1-9])|((1|2)[0-9])|30|31)$/;
            if (!reg.test(value)) {
                message.error("输入格式错误！");
                this.setState({
                    tableData: currentCalendar.calendarExceptions
                })
            } else {

                let editDate = this.setDays(value.split("-"));
                let year = new Date().getFullYear();
                let beforeYear = new Date(year + "-" + record.endDate).getTime(); // 结束时间
                let afterYear = new Date(year + "-" + editDate).getTime(); // 改变后的开始时间

                if (afterYear > beforeYear) {
                    record.duration = (calcLast(new Date((year + 1) + "-" + editDate)) + calcOver(new Date(year + "-" + record.endDate))).toString();
                } else {
                    record.duration = (Math.abs((afterYear - beforeYear) / 1000 / 3600 / 24) + 1).toString();
                }
                record.startDate = editDate;
                record.tag = record.flag ? "2" : "0";
                newTableData[index] = record;
                newCurCalendar.calendarExceptions = newTableData;
                newCalendars = coverCalendars(newCalendars, newCurCalendar);
                this.setState({
                    tableData: newTableData,
                    currentCalendar: newCurCalendar,
                    calendars: newCalendars
                })
            }
        }
    }
    handleDataEndBlur = (value, record, index) => {

        const { tableData, currentCalendar, calendars } = this.state;
        let newTableData = JSON.parse(JSON.stringify(tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(currentCalendar));
        let newCalendars = JSON.parse(JSON.stringify(calendars));

        if (record.exceptionType === "3") {
            // let reg = /^(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/;
            let reg = /^(0?[1-9]|1[0-2])-((0?[1-9])|((1|2)[0-9])|30|31)$/;
            if (!reg.test(value)) {
                message.error("输入格式错误！");
                this.setState({
                    tableData: currentCalendar.calendarExceptions
                })
            } else {

                let editDate = this.setDays(value.split("-"));
                let year = new Date().getFullYear();
                let beforeYear = new Date(year + "-" + record.startDate).getTime(); // 开始时间
                let afterYear = new Date(year + "-" + editDate).getTime(); // 改变后的结束时间
                if (afterYear < beforeYear) {
                    record.duration = (calcOver(new Date((year + 1) + "-" + editDate)) + calcLast(new Date(year + "-" + record.startDate))).toString();
                } else {
                    record.duration = (Math.abs((afterYear - beforeYear) / 1000 / 3600 / 24) + 1).toString();
                }
                record.endDate = editDate;
                record.tag = record.flag ? "2" : "0";
                newTableData[index] = record;
                newCurCalendar.calendarExceptions = newTableData;
                newCalendars = coverCalendars(newCalendars, newCurCalendar);
                this.setState({
                    tableData: newTableData,
                    currentCalendar: newCurCalendar,
                    calendars: newCalendars
                })
            }
        }
    }
    // 持续时间改变
    changeDuration = (value, record, index) => {

        const { tableData, currentCalendar, calendars } = this.state;
        let newTableData = JSON.parse(JSON.stringify(tableData));
        let newCurCalendar = JSON.parse(JSON.stringify(currentCalendar));
        let newCalendars = JSON.parse(JSON.stringify(calendars));

        switch (record.exceptionType) {
            case "0": // 按日期
                if (value === null || value < 0) {
                    record.duration = '1';
                    record.endDate = record.startDate;
                } else {
                    // 修改结束时间
                    let date = new Date(record.endDate);
                    let date1 = new Date(date.setDate(date.getDate() + (value - record.duration)));
                    let endDate = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate();
                    record.duration = value.toString(); // 修改duration
                    record.endDate = endDate;
                }
                break;

            case "1": // 按周
                if (value === null || value < 0) {
                    record.duration = '1';
                    record.endDate = record.startDate;
                } else {
                    // 修改结束时间
                    record.duration = value.toString(); // 修改duration
                    if (record.startDate === '0') {
                        record.endDate = (value - 1).toString();
                    } else {
                        let num = Number(record.startDate) + Number(value) - 1;
                        if (num < 7) {
                            record.endDate = num.toString();
                        } else {
                            record.endDate = (num - 7).toString();
                        }
                    }
                }
                break;

            case "2": // 按月
                if (value === null || value < 0) {
                    record.duration = '1';
                    record.endDate = record.startDate;
                } else {
                    // 修改结束时间
                    record.duration = value.toString(); // 修改duration
                    let num = Number(record.startDate) + Number(value) - 1;
                    if (num > 31) {
                        record.endDate = (num - 31).toString();
                    } else {
                        record.endDate = num.toString();
                    }

                }
                break;

            case "3": // 按年
                if (value === null || value < 0) {
                    record.duration = '1';
                    record.endDate = record.startDate;
                } else {
                    let year = new Date().getFullYear();
                    let startTime = new Date(year + '-' + record.startDate).getTime();
                    let endTime = new Date(startTime + (Number(value) - 1) * 3600 * 24 * 1000);
                    let month = endTime.getMonth() + 1;
                    let day = endTime.getDate();
                    if (month < 10) {
                        month = '0' + (endTime.getMonth() + 1)
                    }
                    if (day < 10) {
                        day = '0' + endTime.getDate()
                    }
                    record.duration = value.toString(); // 修改duration
                    record.endDate = month + '-' + day;
                }
                break;

            default:
                break;
        }

        record.tag = record.flag ? '2' : '0';
        newTableData[index] = record;
        newCurCalendar.calendarExceptions = newTableData;
        newCalendars = coverCalendars(newCalendars, newCurCalendar);
        this.setState({
            tableData: newTableData,
            currentCalendar: newCurCalendar,
            calendars: newCalendars
        })

    }
    // 切换休息/工作类型
    selectRest = (item, record) => {
        this.state.tableData.forEach(v => {
            if (v.id === record.id) {
                v.rest = item;
                v.tag = v.flag ? "2" : "0";
            }
        })

        this.setState({
            currentCalendar: { ...this.state.currentCalendar, calendarExceptions: this.state.tableData },
            tableData: [...this.state.tableData],
            calendars: coverCalendars(this.state.calendars, this.state.currentCalendar)
        })
    }
    // 插入表格例外
    addExcTable = (i) => {
        const { tableData, currentCalendar, calendars, selectedRowKeys, insertBtn } = this.state;
        // if (!insertBtn) {
        //     message, error("暂无权限!");
        //     return false;
        // }
        let today = new Date();
        let tyear = today.getFullYear();
        let tmonth = today.getMonth() + 1;
        let tday = today.getDate();
        let nowDate = tyear + '-' + tmonth + '-' + tday;
        let nanoid = customAlphabet('1234567890', 10);

        let newTableData = JSON.parse(JSON.stringify(tableData));
        let tableNames = newTableData.map(v => v.name);
        let newName = "例外" + i;
        if (tableNames.indexOf(newName) > -1) {
            ++i;
            this.addExcTable(i);
        } else {
            let newData = {
                "id": nanoid(),
                "name": newName,
                "rest": "1", // 休息
                "exceptionType": "0", // 按日期
                "startDate": nowDate,
                "endDate": nowDate,
                "duration": "1",
                "calendarId": currentCalendar?.id, //"1468270621581512714"
                "seq": currentCalendar?.calendarExceptions?.length + 1,
                "tag": "0",
                "flag": false,
                "gmtCreated": null,
                "gmtModified": null,
                "belongType": "2",
                "calendar": null
            }

            let arr = JSON.parse(JSON.stringify(currentCalendar));
            if (selectedRowKeys.length > 1) {
                message.error("请选择单行插入例外！");
                return;
            } else if (selectedRowKeys.length === 0) {
                arr.calendarExceptions = [...currentCalendar?.calendarExceptions, newData];
            } else {
                let k = 0;
                arr.calendarExceptions.forEach((v, i) => {
                    if (v.id === selectedRowKeys[0]) {
                        k = i
                    }
                })
                arr.calendarExceptions.splice(k + 1, 0, newData)
            }
            // arr.calendarExceptions = [...this.state.currentCalendar.calendarExceptions, newData];

            let alldata = JSON.parse(JSON.stringify(calendars));
            alldata.forEach(v => {
                if (v.id === arr.id) {
                    v.calendarExceptions = arr.calendarExceptions
                }
            })

            this.setState({
                currentCalendar: arr,
                tableData: [...arr.calendarExceptions],
                calendars: [...alldata]
            })

        }
    }
    // 删除表格例外
    delExcTable = () => {
        const { calendarExceptions } = this.state.currentCalendar
        const { selectedRowKeys, delBtn } = this.state
        // if (!delBtn) {
        //     message, error("暂无权限!");
        //     return false;
        // }

        if (selectedRowKeys.length === 0) return;

        let arr = calendarExceptions.filter(ce => {
            return !selectedRowKeys.includes(ce.id)
        })

        // 将新建日历 插入的例外 删除的id去除
        selectedRowKeys.forEach((v, i) => {
            if (v < 1000000) {
                selectedRowKeys.splice(i, 1)
            }
        })

        // 将选中删除的 例外id 和 项目id 传给后台
        let delExps = calendarExceptions.filter(item => {
            return selectedRowKeys.includes(item.id)
        })
        let exp = []
        delExps.forEach(item => {
            exp.push({ id: item.id, calendarId: item.calendarId })
        })

        let newCurCalendar = Object.assign({}, this.state.currentCalendar, { calendarExceptions: arr }); // 修改例外后的当前日历

        // 更新 calendars
        let alldata = JSON.parse(JSON.stringify(this.state.calendars));

        alldata.forEach(v => {
            if (v.id < 1000000 || v.id === newCurCalendar.id) {
                v.calendarExceptions = newCurCalendar.calendarExceptions
            }
        })

        this.setState({
            calendars: alldata,
            currentCalendar: newCurCalendar,
            tableData: [...arr],
            deletedExps: [...exp],
            selectedRowKeys: []
        })
    }
    // 上下移动 true-上 false-下
    move = (bool) => {
        const { selectedRowKeys, upBtn, downBtn, tableData } = this.state;

        // if (!upBtn || !downBtn) {
        //     message, error("暂无权限!");
        //     return false;
        // }

        if (selectedRowKeys.length > 1) {
            message.warning("不能多选移动")
            return false
        }

        for (let i = 0; i < tableData.length; i++) {
            const item = tableData[i];

            if (item.id === selectedRowKeys[0]) {
                // tableData.splice(i, 1)
                if (bool) {
                    if (i === 0) return
                    tableData.splice(i, 1)
                    tableData.splice(i - 1, 0, item)
                } else {
                    tableData.splice(i, 1)
                    tableData.splice(i + 1, 0, item)
                    if (i >= tableData.length) return
                }
                break;
            }
        }
        tableData.forEach((v, k) => {
            v.seq = k + 1
            v.tag = v.tag === "0" ? "0" : "2"
        })
        // 修改例外后的当前日历
        let newCurCalendar = Object.assign({}, this.state.currentCalendar, { calendarExceptions: tableData });
        this.setState({
            currentCalendar: newCurCalendar,
            tableData: [...tableData]
        })
    }
    // --------------------------- 右边例外表格 - End ---------------------------

    // 调接口获取数据
    getCalendar = () => {

        let data = { type: "1" }
        getCalendarData(data).then(res => {
            // console.log(res);
            let resCalendar = res.result.calendar;
            let dur1 = getWorkTime(resCalendar[0].morningStart, resCalendar[0].morningEnd);
            let dur2 = getWorkTime(resCalendar[0].afternoonStart, resCalendar[0].afternoonEnd);
            let dur = Number(dur1 + dur2).toFixed(2);
            this.setState({
                calendars: resCalendar,
                currentCalendar: resCalendar[0],
                morningStart: resCalendar[0].morningStart,    // 工作日上午
                morningEnd: resCalendar[0].morningEnd,      // 工作日上午
                afternoonStart: resCalendar[0].afternoonStart,  // 工作日下午
                afternoonEnd: resCalendar[0].afternoonEnd,    // 工作日下午
                workTime: dur,
                tableData: resCalendar[0].calendarExceptions,
                holidays: res.result.nationalHoliday
            })
        }).catch((err) => {
            console.log(err);
        })
    }
    // 保存数据
    saveCalendar = () => {
        // if (!this.state.saveBtn) {
        //     message, error("暂无权限!");
        //     return false;
        // }
        this.setState({
            saveLoading: true
        })
        let data = {
            calendars: [...this.state.calendars],
            deletedExps: [...this.state.deletedExps]
        }
        saveCalendarData(data).then(res => {
            message.success("保存成功！")
            this.setState({
                selectedRowKeys: []
            })
            this.getCalendar()
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            this.setState({
                saveLoading: false
            })
        })
    }
    // 取消
    handleCancel = () => {
        this.sendGanttData({ visible: false, data: {} })
    }
    // 向 gantt 传参
    sendGanttData = data => {
        this.props.parentMethods(data)
    }
    // 设置工作时间限制
    range = (start, end) => {
        const result = [];
        for (let i = start; i <= end; i++) {
            result.push(i);
        }
        return result;
    }

}

export default EnterpriseCalendar;
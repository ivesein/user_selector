import service from "@/utils/service";
import { GET_CALENDAR, SAVE_CALENDAR } from "@/api/urlConfig";

// 获取日历数据
export const getCalendarData = (data) => {
    return service.post(GET_CALENDAR, data);
}

// 保存日历数据
export const saveCalendarData = (data) => {
    return service.post(SAVE_CALENDAR, data);
}
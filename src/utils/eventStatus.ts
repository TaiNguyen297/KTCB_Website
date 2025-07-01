import { EventStatus } from "@prisma/client";

/**
 * Tự động xác định trạng thái sự kiện dựa trên thời gian hiện tại
 * @param startDate - Ngày bắt đầu sự kiện
 * @param endDate - Ngày kết thúc sự kiện
 * @returns EventStatus
 */
export const getEventStatusByDate = (startDate: Date | string, endDate: Date | string): EventStatus => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Reset time để so sánh chỉ theo ngày
  now.setHours(0, 0, 0, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  if (now < start) {
    return EventStatus.UPCOMING; // Sắp diễn ra
  } else if (now >= start && now <= end) {
    return EventStatus.ONGOING; // Đang diễn ra
  } else {
    return EventStatus.FINISHED; // Đã kết thúc
  }
};

/**
 * Cập nhật trạng thái cho một event object
 * @param event - Event object
 * @returns Event object với trạng thái đã cập nhật
 */
export const updateEventStatus = (event: any) => {
  return {
    ...event,
    status: getEventStatusByDate(event.startDate, event.endDate)
  };
};

/**
 * Cập nhật trạng thái cho danh sách events
 * @param events - Danh sách events
 * @returns Danh sách events với trạng thái đã cập nhật
 */
export const updateEventsStatus = (events: any[]) => {
  return events.map(event => updateEventStatus(event));
};

/**
 * Lấy màu sắc hiển thị cho trạng thái
 * @param status - EventStatus
 * @returns Màu sắc tương ứng
 */
export const getEventStatusColor = (status: EventStatus) => {
  switch (status) {
    case EventStatus.UPCOMING:
      return "primary"; // Xanh dương
    case EventStatus.ONGOING:
      return "success"; // Xanh lá
    case EventStatus.FINISHED:
      return "default"; // Xám
    default:
      return "default";
  }
};

/**
 * Lấy nhãn hiển thị cho trạng thái
 * @param status - EventStatus
 * @returns Nhãn tiếng Việt
 */
export const getEventStatusLabel = (status: EventStatus) => {
  switch (status) {
    case EventStatus.UPCOMING:
      return "Sắp diễn ra";
    case EventStatus.ONGOING:
      return "Đang diễn ra";
    case EventStatus.FINISHED:
      return "Đã kết thúc";
    default:
      return "Không xác định";
  }
};

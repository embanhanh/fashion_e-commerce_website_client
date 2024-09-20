export const convertMoney = (number) => {
    if (number) {
        return number.toLocaleString('vi-VN') + 'đ'
    } else {
        return
    }
}

export const Translate = {
    Policy: "chính sách",
    Role: "vai trò",
    User: "người dùng",
    Product: "sản phẩm",
    Email: "email",
    Bill: "hóa đơn",
    Store: "cửa hàng",
    PaymentMethod: "phương thức thanh toán",
    Action: "hành động",
    Feedback: "feedback",
    Evaluation: "đánh giá",
    Notification: "thông báo",
}

export const UpperCaseFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
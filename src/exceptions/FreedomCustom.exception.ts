import { HttpException, HttpStatus } from "@nestjs/common";

class FreedomCustom extends HttpException {
    FriendAlreadyExist() {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Bạn đã là bạn bè với người này rồi!",
            data: null
        }
    }

    FriendNotExist() {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Bạn không phải là bạn bè với người này!",
            data: null
        }
    }

    FollowedStore() {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Bạn đã theo dõi cửa hàng này rồi!",
            data: null
        }
    }

    NotFollowStore() {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Bạn chưa theo dõi cửa hàng này!",
            data: null
        }
    }

    NotMatchOTP() {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Bạn chưa nhập đúng OTP!",
            data: null
        }
    }

    InvalidLogin() {
        return {
            statusCode: HttpStatus.BAD_REQUEST,
            message: "Email hoặc mật khẩu không đúng!",
            data: null
        }
    }
}

export default FreedomCustom;


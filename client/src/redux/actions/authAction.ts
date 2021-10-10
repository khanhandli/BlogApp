import { IUserLogin, IUserRegister } from "../../utils/TypeScript"
import { postAPI, getAPI } from "../../utils/FetchData"
import { AUTH, IAuthType } from "../types/authType"
import { ALERT, IAlertType } from "../types/alertType"
import { Dispatch } from "redux"
import { notification } from 'antd';
import { checkTokenExp } from '../../utils/checkTokenExp';


export const login = (userLogin: IUserLogin) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const url = `login`
        const res = await postAPI(url, userLogin)
        if (res.status === 200) {
            notification['success']({
                message: "Blog Nguyễn Như Ý",
                description: res.data.msg,
            });
        }

        dispatch({ type: ALERT, payload: { loading: false } })

        dispatch({ type: AUTH, payload: res.data })
        localStorage.setItem('logged', 'nguyennhuy')

    } catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
    }
}

export const registerUser = (userRegister: IUserRegister) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const url = `register`
        const res = await postAPI(url, userRegister)
        if (res.status === 200) {
            notification['success']({
                message: "Blog Nguyễn Như Ý",
                description: res.data.msg,
            });
        }

        dispatch({ type: ALERT, payload: { loading: false } })

    } catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg
                ? typeof err?.response?.data?.msg !== 'string' ? err?.response?.data?.msg[0] : err?.response?.data?.msg : '',
        });
    }
}

export const refreshToken = () => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const logged = localStorage.getItem('logged')
    if (logged !== 'nguyennhuy') return;

    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const url = `refresh_token`
        const res = await getAPI(url)

        dispatch({ type: ALERT, payload: { loading: false } })
        dispatch({ type: AUTH, payload: res.data })

    } catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
    }
}

export const logout = (token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const result = await checkTokenExp(token, dispatch)
    const access_token = result ? result : token
    try {
        localStorage.removeItem('logged')
        dispatch({
            type: AUTH,
            payload: {}
        })
        await getAPI('logout', access_token)
    } catch (err: any) {
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
    }
}

export const gooogleLogin = (id_token: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const url = `google_login`
        const res = await postAPI(url, { id_token })
        if (res.status === 200) {
            notification['success']({
                message: "Blog Nguyễn Như Ý",
                description: res.data.msg,
            });
        }

        dispatch({ type: ALERT, payload: { loading: false } })

        dispatch({ type: AUTH, payload: res.data })
        localStorage.setItem('logged', 'nguyennhuy')
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
    }
}

export const facebookLogin = (accessToken: string, userID: string) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const url = `facebook_login`
        const res = await postAPI(url, { accessToken, userID })
        if (res.status === 200) {
            notification['success']({
                message: "Blog Nguyễn Như Ý",
                description: res.data.msg,
            });
        }

        dispatch({ type: ALERT, payload: { loading: false } })

        dispatch({ type: AUTH, payload: res.data })
        localStorage.setItem('logged', 'nguyennhuy')
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
    }
}

export const loginSMS = (accountRes: IUserLogin) => async (dispatch: Dispatch<IAuthType | IAlertType>) => {
    const { account } = accountRes
    const phone = `+84${account.slice(1)}`

    try {
        dispatch({ type: ALERT, payload: { loading: true } })

        const url = `login_sms`
        const res = await postAPI(url, { phone })
        if (!res.data.valid)
            verifySMS(phone, dispatch)
    } catch (err: any) {
        dispatch({ type: ALERT, payload: { loading: false } })
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
    }
}

export const verifySMS = async (phone: string, dispatch: Dispatch<IAuthType | IAlertType>) => {
    const code = prompt('Nhập mã OTP')
    if (!code) return dispatch({ type: ALERT, payload: { loading: false } });
    try {
        const url = `verify_sms`
        const res = await postAPI(url, { phone, code })
        if (res.status === 200) {
            notification['success']({
                message: "Blog Nguyễn Như Ý",
                description: res.data.msg,
            });
        }
        dispatch({ type: AUTH, payload: res.data })
        dispatch({ type: ALERT, payload: { loading: false } })
        localStorage.setItem('logged', 'nguyennhuy')
    } catch (err: any) {
        notification['error']({
            message: "Blog Nguyễn Như Ý",
            description: err?.response?.data?.msg,
        });
        setTimeout(() => {
            verifySMS(phone, dispatch)
        }, 300)

    }
}

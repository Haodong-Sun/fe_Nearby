import { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, CoverImage, Text, Button } from '@tarojs/components'

import './index.scss'
import logoImg from '../../static/images/logo.png'
import wechatImg from '../../static/images/weixin.png'
import apiLogin from "../../API/apiLogin";

const LOADING = -1;
const PASS = 0;
const UNREGISTERED = 1;
const ERROR = 2;

const statusMap =  {
    20018: ERROR,
    20019: UNREGISTERED,
}

export default class Index extends Component {
    private wxCode: any;
    private domEvents: { onLogin: (e) => void, onTest: (e) => void } ;
    private methods: { register: () => void, getUserInfo: (phoneNum: string) => void, setUserInfo: (params: any) => void };

    constructor(props) {
        super(props);
        this.state = {
            status: LOADING,
        };
        this.wxCode = 0;
        this.domEvents = this.getDomEvents();
        this.methods = this.getMethods();
    }

    getDomEvents() {
        return {
            onLogin: () => {
                // @ts-ignore
                const { status } = this.state;
                if (status === LOADING) {
                    Taro.showToast({title: '请稍后...', icon: 'none'});
                    return;
                }
                if (status  === ERROR) {
                    Taro.showToast({title: '请刷新后重试!', icon: 'none'});
                    return;
                }
                if (status === UNREGISTERED) {
                    this.methods.register();
                    return;
                }
                Taro.navigateTo({
                    url: '/pages/index/index',
                })
            },
            onTest: (e) => {
                console.log(e);
            }
        }
    }

    getMethods() {
        return {
            register: () => {
                // 获取用户手机号
                let phoneNum = `86-1780120${Math.floor(Math.random() * 10000)}`;
                this.methods.getUserInfo(phoneNum);
            },
            getUserInfo:  (phoneNum: string) => {
                wx.getUserProfile({
                    desc: '获取用户头像、昵称信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                    success: (res) => {
                        const { userInfo } = res || {};
                        const { avatarUrl = '', nickName = '' } = userInfo || {};
                        const params = {
                            nickname: nickName,
                            head_url: avatarUrl,
                            phone_number: phoneNum,
                            wx_code: this.wxCode,
                        };
                        this.methods.setUserInfo(params);
                    },
                    fail: () => {
                        const params = {
                            phone_number: phoneNum,
                            wx_code: this.wxCode,
                        };
                        this.methods.setUserInfo(params);
                    }
                })
            },
            setUserInfo: (params) => {
                apiLogin.goRegister(params).then(data => {
                    console.log(data);
                });
            }
        }
    }

    componentWillMount () { }

    componentDidMount () {
        wx.login({
            success: (res) => {
                if (res.code) {
                    this.wxCode = res.code;
                    apiLogin.goLogin({ wx_code: res.code }).then(res => {
                        const status = typeof res === 'number'? (statusMap[res] || ERROR) : PASS; // 若res为数字类型，则返回的是错误码，否则是PASS
                        if (status === PASS) {
                            // 获取token逻辑
                        }
                        this.setState({ status });
                    });
                } else {
                    this.setState({ status: ERROR })
                }
            }
        });
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    render () {
        const { domEvents } = this;
        // const { status } = this.state;
        return (
            <View className='login-container'>
                <CoverImage className="logo" src={logoImg} />
                <View className="login-tag">登录、注册Nearby</View>
                <View className="login-tab">
                    <CoverImage src={wechatImg} className="wechat-logo" />
                    {/*{*/}
                    {/*    status === UNREGISTERED ? (*/}
                    {/*        <Button className="login-btn" onClick={domEvents.onRegister}>微信快速登录</Button>*/}
                    {/*    ) : (*/}
                    {/*        <Text className="login-text" onClick={domEvents.onLogin}>微信快速登录</Text>*/}
                    {/*    )*/}
                    {/*}*/}
                    <Text className="login-text" onClick={domEvents.onLogin}>微信快速登录</Text>
                </View>
                {/*<Button openType="getPhoneNumber" onGetPhoneNumber={domEvents.onTest}>微信快速登录</Button>*/}
            </View>
        )
    }
}

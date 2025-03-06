import { DeviceInfo } from "./../../utils/types/device";
import os from 'systeminformation'
import { app } from 'electron'

const systemInfo: DeviceInfo = {
    // 系统版本
    systemVersion: '',
    // SDK版本，这里指的是我们的app的版本
    sdkVersion: '',
    // 机型
    model: '',
    // 设备厂商
    brand: ''
}

os.system().then((data) => {
    systemInfo.systemVersion = data.version
    systemInfo.sdkVersion = app.getVersion()
    systemInfo.model = data.model
    systemInfo.brand = data.manufacturer
})

export default systemInfo

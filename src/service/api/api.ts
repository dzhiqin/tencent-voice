import { Get, fullUrl } from "../http";
export const hello = () => {
  return Get('http://baidu.com')
}
interface VoiceRegisterParams {
  'req_text': string
}
export const voiceRegister = (data: VoiceRegisterParams) => {
  return Get(fullUrl('voice_appointment/'), data)
}
import { Get } from "../http";
export const hello = () => {
  return Get('http://baidu.com')
}
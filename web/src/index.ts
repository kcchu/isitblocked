import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

import './style/index.css'
import App from './components/app'

dayjs.extend(relativeTime)

export default App

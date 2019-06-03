import { optimistic } from 'redux-optimistic-ui';
import reducer from './reducer';
export default(optimistic(reducer));

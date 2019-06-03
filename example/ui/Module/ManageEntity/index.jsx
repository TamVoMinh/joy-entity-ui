import { ManageEntity } from 'components';
import connector from 'store/entity/connector';
import * as api from './api';

export default ManageEntity(connector(api))

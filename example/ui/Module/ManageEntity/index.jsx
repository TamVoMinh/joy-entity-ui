import { Switch, Route, withRouter, Link } from 'react-router-dom';
import  {ManageEntity}  from 'components';
import connector from 'store/entity/connector';
import * as api from './api';

export default ManageEntity(Switch, Route, withRouter, Link, connector(api));

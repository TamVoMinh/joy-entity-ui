import { Switch, Route, withRouter, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { ManageEntity }  from 'components';
import { mapStateToPropsDefault, entityActions } from 'store';
import * as api from './api';

const actions = entityActions(api);

const mapDispatchToProps = dispatch => bindActionCreators(actions,dispatch);

export default connect(mapStateToPropsDefault, mapDispatchToProps)(ManageEntity(Switch, Route, withRouter, Link));

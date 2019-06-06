import React from 'react';
class Details extends React.Component {

    shouldComponentUpdate(nextProps) {
        return nextProps.entity !== this.props.entity;
    }
    render() {
        const { meta, form, title, icon, entity, match: { params }, entityUrl, Link } = this.props;
        const entityData = entity.get('list').find(i => i.id === params.id) || meta.default;
        const outOfUpateId = entity.get('outOfUpateId');
        const refresh_btn = outOfUpateId === params.id
            ? (
                <button className="float-right btn btn-sm btn-rose" onClick={e => this._loadEntity()}>
                    <i className="material-icons">refresh</i> Refresh
                </button>)
            : null;

        return (
            <div id={`${title}-action-table`} className="card h-100">
                <div className="card-header card-header-rose card-header-icon">
                    <Link to={entityUrl}>
                        <div className="card-icon text-white">
                            {icon ? icon : <i className="material-icons">filter_none</i>}
                        </div>
                    </Link>
                    <div className="d-flex">
                        <div className="col-9">
                            <nav aria-label="breadcrumb" role="navigation">
                                <ol className="breadcrumb text-primary bg-white">
                                    <li className="breadcrumb-item"><Link to="/" >Joy</Link></li>
                                    <li className="breadcrumb-item"><Link to={entityUrl}>{title}</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Details</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="col-3 my-auto float-right">
                            {refresh_btn}
                        </div>
                    </div>

                </div>
                <div className="card-body">
                    {React.createElement(form, { data: entityData, onSave: this.saveEntity })}
                </div>
                <div className="card-footer"></div>
            </div>
        );
    }

    saveEntity = async data => {
        const { saveEntity, meta } = this.props;
        return saveEntity(meta.entry, data);
    };

    componentDidMount() {
        const { meta, entity } = this.props;
        const list = entity.get('list');
        if (!list.size || meta.entry !== entity.get('entry')) {
            this._loadEntity();
        }
    }
    _loadEntity = () => {
        const { getEntity, meta, match: { params } } = this.props;
        getEntity(meta.entry, params.id);
    }
}

export default Details;

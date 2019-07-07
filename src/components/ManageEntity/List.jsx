import React from 'react';
import { WithModal } from '../Modal';
import DataTable from '../DataTable';
import { hashObject } from '../util';


class List extends React.Component {
    render() {
       return <DataTable {...this.props} onRowClick={this.handleRowClick} onRowDoubleClick={this.handleUpdateEntity} onNewEntityClick={this.handleNewEntity} />
    }

    handleNewEntity = e => {
        const { title, meta } = this.props;
        this.openEditor(`Add New ${title}`, meta.default || {});
    };

    handleUpdateEntity = ({ rowData }) => {
        const { title } = this.props;
        this.openEditor(`Update ${title}`, rowData);
    };

    handleRowClick = ({ index, rowData }) => {
        this.props.selectEntity(index, rowData.id);
    };

    openEditor = async (title, data) => {
        const { openModal, form, useModal, history, match: { url } } = this.props;
        if (useModal) {
            openModal(form, title, {
                data,
                hashing: await hashObject(data),
                onSave: this.saveEntity
            });
        } else {
            history.push(`${url === '/' ? '' : url}/${data.id ? data.id : 'new'}/details`);
        }
    };

    saveEntity = async data => {
        const { saveEntity, meta, closeModal } = this.props;
        const saveRes = await saveEntity(meta.entry, data);
        if(saveRes.status==="success"){
            closeModal();
        }
    };
}

export default WithModal(List);

import React from 'react';
import {
    objectOf,
    arrayOf,
    shape,
    string,
    number,
    bool,
    element,
    func,
    oneOfType,
    node,
    instanceOf
} from 'prop-types';
import debounce from 'lodash.debounce';
import { Map } from 'immutable'
import {
    AutoSizer,
    InfiniteLoader,
    Table,
    Column,
    SortIndicator,
    SortDirection
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import Draggable from "react-draggable";
import JoyQueryBox from 'joy-query-box';
import { date, text } from './renderer';
import NoRow from './NoRow';

const BATCH_SIZE = 3;
const DEFUALT_PAGE_SIZE = 50;

const ColType = {
    TEXT: 'text',
    DATE_ONLY: 'date'
};
const renderMap = {
    [ColType.TEXT]: text,
    [ColType.DATE_ONLY]: date
};

const VisibleColumns = (keys, fields) => {
    return Array.isArray(keys) && fields
        ? keys.reduce((res, key) => {
            const column = fields[key];
            if (column) {
                res.usedWidth += column.width;
                res.columns.push({ ...column, key });
            }
            return res;
        }, { columns: [], usedWidth: 0 })
        : { columns: [], usedWidth: 0 };
};

const Columns = ({ keys, fields }, headerRenderer, tableWidth) => {
    const { columns, usedWidth } = VisibleColumns(keys, fields);
    if (!columns.length) return null;

    const lastColIndex = columns.length - 1;
    const extantWidth = tableWidth - usedWidth;

    return columns.map((field, index) => {
        const isLastColumn = index === lastColIndex;
        if (isLastColumn && extantWidth > 0) { field.width = extantWidth + field.width }
        return (
            <Column
                columnData={field}
                key={field.key}
                dataKey={field.key}
                disableSort={!field.sortable}
                label={field.label}
                width={field.width}
                headerRenderer={isLastColumn ? undefined : headerRenderer}
                cellRenderer={
                    field.type ? renderMap[field.type] || text : text
                }
            />
        );
    });
};

export default class DataTable extends React.Component {
    static propTypes = {
        title: string.isRequired,
        icon: oneOfType([func, element, node]),
        meta: shape({
            entry: string.isRequired,
            keys: arrayOf(string).isRequired,
            fields: objectOf(
                shape({
                    width: number.isRequired,
                    label: string.isRequired,
                    sortable: bool
                })
            )
        }),
        setting: shape({
            headerHeight: number.isRequired,
            rowHeight: number.isRequired,
            disableHeader: bool.isRequired,
            overscanRowCount: number.isRequired
        }),
        entity: instanceOf(Map),
        findAll: func.isRequired,
        loadMore: func.isRequired,
        sortBy: func.isRequired,
        onRowClick: func,
        onRowDoubleClick: func,
        onNewEntityClick: func
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            meta: props.meta
        };
        this.__pageSize = this.props.meta ? this.props.meta.size || DEFUALT_PAGE_SIZE : DEFUALT_PAGE_SIZE;
        this.__stack = [];
        this.__batch = [];
        this.__fetching=[];
        this.executeRequest = debounce(this.executeRequest, 200);
        this.words = Object.entries(props.meta.fields).filter(([_, field]) => field.filterable) .map(([keyField, field]) => ({ word: keyField, desc: `column: ${field.label}` }));
    }

    static getDerivedStateFromProps(props, state) {
        const { entity } = props;
        if (state.entity !== entity) return { entity };
        return null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.entity !== nextState.entity || this.state.meta !== nextState.meta;
    }

    isRowLoaded = ({ index }) => {
        if(this.__stack.some(([start, stop])=> index >= start && index < stop)) return true;
        if(this.__batch.some(([start, stop])=> index >= start && index < stop)) return true;
        if(this.__fetching.some(([start, stop])=> index >= start && index < stop)) return true;
        return !!this.state.entity.get('list').get(index);
    };

    loadMoreRows = ({ startIndex }) => {
        this.__stack.push([startIndex, startIndex + this.props.meta.size]);
        this.executeRequest();    
    };


    executeRequest = () => {
        this.__batch = this.__stack;
        this.__stack = [];
        if (this.__batch.length) {
            this.__fetching = this.length > BATCH_SIZE ? this.__batch.slice(1).slice(-BATCH_SIZE): this.__batch;
            this.__batch = [];
            Promise.all(this.__fetching.reverse().map(([begin, _])=> this.props.loadMore(begin, this.__pageSize))).then(() => this.__fetching = []);
        }
    };

    render() {
        const {
            title,
            subheader,
            setting: {
                headerHeight,
                rowHeight,
                disableHeader,
                overscanRowCount
            }
        } = this.props;
        const { entity, meta } = this.state;
        const sortByField = entity.getIn(['sortBy', 'field']);
        const sortByDirection = entity.getIn(['sortBy', 'direction']);
        const scrollToIndex = entity.getIn(['highlightIx']);
        const queryText = entity.getIn(['queryTexts', meta.entry]);
        const total = entity.get('total');

        return (
            <div id={`${title}-action-table`} className="card h-100">
                <div className="card-header card-header-icon">
                    {subheader ? subheader: null}
                    <div className="row my-2">
                        <div className="col-lg-3">
                            <div className="d-flex w-100 h-100 align-items-center justify-content-end text-primary">
                                Query
                            </div>
                        </div>
                        <div className="col-lg-7">
                            <JoyQueryBox
                                className="flex-fill bg-white border py-2 my-1"
                                id={`${title}-aql-box`}
                                words={this.words}
                                onSearch={this.handleSearch}
                                queryText={queryText}
                            />
                        </div>
                        <div className="col-lg-2">
                            <div className="d-flex w-100 h-100 align-items-center justify-content-end text-primary">
                                <button
                                    className="btn btn-sm btn-primary"
                                    onClick={this.props.onNewEntityClick}
                                >
                                    Add {title}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="card-body">
                    <AutoSizer >
                        {({ width, height }) => (
                            <InfiniteLoader
                                isRowLoaded={this.isRowLoaded}
                                loadMoreRows={this.loadMoreRows}
                                rowCount={total}
                            >
                                {({ onRowsRendered, registerChild }) => (
                                    <Table
                                        ref={registerChild}
                                        className="data-table "
                                        disableHeader={disableHeader}
                                        headerClassName="headerColumn"
                                        headerHeight={headerHeight}
                                        height={height}
                                        noRowsRenderer={this._noRowsRenderer}
                                        overscanRowCount={overscanRowCount}
                                        rowClassName={this._rowClassName}
                                        rowHeight={rowHeight}
                                        rowGetter={this.rowGetter}
                                        rowCount={total}
                                        sortBy={sortByField}
                                        sort={this._sort}
                                        sortDirection={sortByDirection}
                                        scrollToIndex={scrollToIndex}
                                        width={width}
                                        onRowDoubleClick={this.props.onRowDoubleClick}
                                        onRowClick={this.props.onRowClick}
                                        onRowsRendered={onRowsRendered}
                                    >
                                        {Columns(meta, this._headerRenderer, width)}
                                    </Table>
                                )}
                            </InfiniteLoader>
                        )}
                    </AutoSizer>
                </div>
                <div className="card-footer text-muted">
                    <div className="font-weight-light text-dark">
                        Found {total} items
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        const { findAll, meta } = this.props;
        const list = this.state.entity.get('list');
        if (!list.size || meta.entry !== this.state.entity.get('entry')) {
            findAll(meta.entry, { p: { offset: 0, limit: meta.size} });
        }
    }

    rowGetter = ({ index }) => this.state.entity.getIn(['list', index]) || {};

    _headerRenderer = ({
        columnData,
        dataKey,
        disableSort,
        label,
        sortBy,
        sortDirection
    }) => {
        return (
            <React.Fragment key={dataKey}>
                <div className="ReactVirtualized__Table__headerTruncatedText">
                    {label}
                    {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
                </div>
                <Draggable
                    axis="x"
                    defaultClassName="DragHandle"
                    defaultClassNameDragging="DragHandleActive"
                    onDrag={(event, { deltaX }) =>
                        this.resizeRow({
                            dataKey,
                            deltaX
                        })
                    }
                    position={{ x: 0 }}
                    zIndex={999}
                >
                    <span className="DragHandleIcon">⋮</span>
                </Draggable>
            </React.Fragment>
        );
    };

    resizeRow = ({ dataKey, deltaX }) =>
        this.setState(prevState => {
            const { keys, fields, entry } = prevState.meta;
            const nextDataKey = keys[keys.indexOf(dataKey) + 1];
            const field = fields[dataKey];
            const nextField = fields[nextDataKey];

            const width = field.width + deltaX;
            const nextWidth = nextField.width - deltaX;

            const meta = {
                entry,
                keys,
                fields: {
                    ...fields,
                    [dataKey]: { ...field, width },
                    [nextDataKey]: { ...nextField, width: nextWidth }
                }
            }
            return { meta };
        });

    _noRowsRenderer = () => <NoRow isLoading={this.state.entity.get('isLoading')} />

    _rowClassName = ({ index }) => {
        if (index < 0) {
            return 'headerRow shadow-sm  text-primary';
        } else {
            const classNames = [index % 2 === 0 ? 'evenRow' : 'oddRow'];
            const rowData = this.props.entity.get('list').get(index);
            if (
                rowData &&
                rowData.id === this.props.entity.get('highlightId')
            ) {
                classNames.push('highlight');
            }

            return classNames.join(' ');
        }
    };

    _sort = ({ sortBy, sortDirection }) => {
        if (this.state.entity.get("isLoading")) return;
        const sortByField = this.state.entity.getIn(['sortBy', 'field']);
        const sortByDirection = this.state.entity.getIn(['sortBy', 'direction']);
        if (sortBy === sortByField && sortDirection === SortDirection.ASC && sortByDirection === SortDirection.DESC) {
            this.props.sortBy(null, null);
        } else {
            this.props.sortBy(sortBy, sortDirection);
        }
    };

    handleSearch = (syntaxErr, conditions, queryText) => {
        if (!syntaxErr) {
            this.setState({ conditions, syntaxErr });
            const { findAll, meta } = this.props;

            findAll(meta.entry, { ...conditions, p: {offset: 0, limit: meta.size} }, queryText);
        } else {
            this.setState({ syntaxErr });
        }
    };
}

export const ColumnType = ColType;

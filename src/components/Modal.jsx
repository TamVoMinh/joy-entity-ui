import React from 'react';
import { connect } from 'react-redux';
import { Spinner } from './Spinner';

export const ModalContext = React.createContext({
    inShow: false,
    openModal: () => {},
    closeModal: () => {}
});

class Provider extends React.Component {
    constructor(props) {
        super(props);

        this.closeModal = () => {
            this.setState({ modalBody: null, modalProps: null });
        };

        this.openModal = (modalBody, title, modalProps) => {
            this.setState({ modalBody, title, modalProps });
        };

        this.state = {
            modalBody: null,
            modalProps: {},
            title: 'modal dialog title',
            childContext: {
                inShow: false,
                closeModal: this.closeModal,
                openModal: this.openModal
            }
        };
    }

    state = {};

    render() {
        const { modalBody, modalProps, title } = this.state;
        const inshow = !!modalBody && !!modalProps;
        const dialogBody = inshow
            ? React.createElement(modalBody, modalProps)
            : null;
        const { ui } = this.props;

        return (
            <ModalContext.Provider value={this.state.childContext}>
                <React.Fragment>
                    {this.props.children}
                    <div
                        id="dialog-container"
                        className={`modal fade ${inshow ? 'show' : ''}`}
                        tabIndex="-1"
                        role="dialog"
                        aria-labelledby="dialog-container"
                        aria-hidden="true"
                    >
                        <div
                            className="modal-dialog modal-dialog-centered"
                            role="document"
                        >
                            <div className="modal-content border-0 shadow-lg">
                                <div className="modal-header">
                                    <h5
                                        className="modal-title"
                                        id="dialog-container-title"
                                    >
                                        {title}
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                        onClick={this.closeModal}
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">{dialogBody}</div>
                                <div className="modal-footer" />
                            </div>
                        </div>
                    </div>
                    {ui && ui.isLockApp && <Spinner />}
                </React.Fragment>
            </ModalContext.Provider>
        );
    }
}

export const WithModal = component => {
    const wrapModal = props => {
        return (
            <ModalContext.Consumer>
                {ctx =>
                    React.createElement(
                        component,
                        Object.assign({}, props, ctx)
                    )
                }
            </ModalContext.Consumer>
        );
    };
    return wrapModal;
};

const mapStateToProps = (state, ownProps) => {
    return { ui: state.get('ui').toJS() };
};

export const ModalProvider = withRouter => withRouter(
    connect(
        mapStateToProps,
        null
    )(Provider)
);

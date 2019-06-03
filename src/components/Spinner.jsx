import React from 'react';
export const Spinner = () => {
    return (
        <React.Fragment>
            <div className="modal fade show" tabIndex="-1" role="dialog">
                <div
                    className="modal-dialog modal-dialog-centered justify-content-center"
                    role="document"
                >
                    <span className="fa fa-spinner fa-spin fa-3x text-primary" />
                </div>
            </div>
        </React.Fragment>
    );
};

export const Loader = () => {
    return (
        <div
            className="inline-block spinner-border spinner-border-sm text-secondary"
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

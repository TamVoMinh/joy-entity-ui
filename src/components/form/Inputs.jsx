import React from 'react';

export const TextBox = ({
    label,
    name,
    className,
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur
}) => {
    const isError = errors[name] && touched[name];
    return (
        <div className={className}>
            <div className={`form-group label-floating ${isError ? 'has-danger' : ''}`}>
                <label className="bmd-label-floating" htmlFor={`form-input-${name}`}>{label}</label>
                <input
                    id={`form-input-${name}`}
                    name={name}
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={values[name]}
                    disabled={isSubmitting}
                />
                {isError && (
                    <div id={`form-feedback-${name}`} className="invalid-feedback">
                        {errors[name]}
                    </div>
                )}
            </div>
        </div>
    );
};

export const TextMutil = ({
    label,
    name,
    className,
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur
}) => {
    const isError = errors[name] && touched[name];
    return (
        <div className={className}>
            <div className={`form-group label-floating ${isError ? 'has-danger' : ''}`}>            <label htmlFor={`form-input-${name}`}>{label}</label>
                <textarea
                    id={`form-input-${name}`}
                    name={name}
                    type="text"
                    className="form-control"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values[name] || ''}
                    disabled={isSubmitting}
                />
                {isError && (
                    <div id={`form-feedback-${name}`} className="invalid-feedback">
                        {errors[name]}
                    </div>
                )}
            </div>
        </div>

    );
};

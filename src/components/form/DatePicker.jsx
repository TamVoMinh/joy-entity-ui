import React from 'react';
import { string, object, bool, func } from 'prop-types';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

class DatePicker extends React.Component {
    static propsType = {
        label: string,
        name: string,
        className: string,
        values: object,
        errors: object,
        touched: object,
        isSubmitting: bool,
        setFieldValue: func.isRequired,
        handleBlur: func.isRequired
    };

    render() {
        const {
            label,
            name,
            className,
            values,
            errors,
            touched,
            isSubmitting,
            handleBlur
        } = this.props;
        const isError = errors[name] && touched[name];
        const selectedDate = values[name] ? new Date(values[name]) : undefined;
        return (
            <div className={className}>
                <div className={`form-group ${isError ? 'has-danger' : ''}`}>
                    <label className="bmd-label-floating" htmlFor={`form-date-picker-${name}`}>{label}</label>
                    <ReactDatePicker
                        id={`form-date-picker-${name}`}
                        type="text"
                        name={name}
                        className="form-control"
                        selected={selectedDate}
                        onChange={this.handleChangeDateValue}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                    />
                    {isError && (
                        <div
                            id={`form-feedback-${name}`}
                            className="invalid-feedback"
                            style={{ display: 'block' }}
                        >
                            {errors[name]}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    handleChangeDateValue = dateValue => {
        const { name, setFieldValue } = this.props;
        setFieldValue(name, !!dateValue ? dateValue : undefined);
    };
}

export { DatePicker };
export default DatePicker;

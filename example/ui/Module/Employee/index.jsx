import React from 'react';
import { Link } from 'react-router-dom';
import { withFormik } from 'formik';
import { object, number, date } from 'yup';
import { hashObject } from 'components/util';
import ManageEntity from '../ManageEntity';
import { TextBox, DatePicker } from 'components/form';

const meta = {
    size: 50,
    entry: '/entities/employee',
    keys: ['id', 'name', 'salary', 'joinDate', 'leaveDate', 'payroll'],
    fields: {
        id: {
            label: 'ID',
            width: 180,
            sortable: false,
            editable: false
        },
        name: {
            label: 'name',
            width: 280,
            sortable: false,
            editable: false,
            filterable: true
        },
        salary: {
            label: 'Salary',
            width: 380,
            sortable: true,
            editable: true,
            filterable: true
        },
        joinDate: {
            label: 'Join Date',
            width: 200,
            sortable: true,
            editable: true,
            type: 'date',
            filterable: true
        },
        leaveDate: {
            label: 'Leave Date',
            width: 350,
            sortable: true,
            editable: true,
            type: 'date',
            filterable: true
        },
        payroll: {
            label: 'Payroll',
            width: 80,
            sortable: false,
            editable: true,
            filterable: true
        }
    },
    default: {
        position: '',
        salary: '',
        joinDate: undefined,
        leaveDate: undefined,
        payroll: ''
    }
};

const employeeSchema = object().shape({
    salary: number().required('Salary is required'),
    joinDate: date().required('Join Date date is required'),
    leaveDate: date().nullable(true),
    payroll: number().required()
});

const EmployeeModel = withFormik({
    validationSchema: employeeSchema,
    enableReinitialize:true,
    mapPropsToValues: props => props.data,
    handleSubmit: async (values, { props, setSubmitting, setErrors }) => {
        const hashValue = await hashObject(values);
        if (hashValue !== props.hashing) {
            await props.onSave(values);
        }
        setSubmitting(false);
    },
    displayName: 'edit-employee',
    validateOnChange: true
});

const EmployeeForm = props => {
    const {
        dirty,
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue
    } = props;
    const commonProps = {
        values,
        touched,
        errors,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <TextBox
                    className="col-md-6"
                    label="name"
                    name="name"
                    {...commonProps}
                />
                <TextBox
                    className="col-md-6"
                    name="salary"
                    label="salary"
                    {...commonProps}
                />
            </div>
            <div className="form-row">
                <DatePicker
                    className="col-md-6"
                    name="joinDate"
                    label="Join Date"
                    {...commonProps}
                />
                <DatePicker
                    className="col-md-6"
                    name="leaveDate"
                    label="leave Date"
                    {...commonProps}
                />
            </div>
            <div className="form-row">
                <TextBox
                    className="col-md-12"
                    name="payroll"
                    label="payroll"
                    {...commonProps}
                >
                    >
                </TextBox>
            </div>
            <div className="row">
                <div className="col-md-12 d-flex justify-content-center">
                    <button
                        type="submit"
                        className="btn btn-sm btn-primary"
                        disabled={isSubmitting || !dirty}
                    >
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

const SubHeader = ({ title }) => {
    return (
        <div className="sub-header d-flex flex-row shadow bg-white border rounded">
            <div className="card-icon">
                <i className="material-icons">people</i>
            </div>
            <div className="flex-grow-1">
                <nav aria-label="breadcrumb" role="navigation">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/" >Home</Link></li>
                        <li className="breadcrumb-item active" aria-current={title}>{title}</li>
                    </ol>
                </nav>
            </div>
        </div>
    );
}
export const Employee = () => {
    const title = "Employee";
    return (
        <div className="container-fluid py-5 h-100 w-100">
            {
                ManageEntity({
                    title,
                    meta, 
                    form: EmployeeModel(EmployeeForm),
                    useModal: false,
                    subheader: <SubHeader title={title}></SubHeader>
                })
            }
        </div>
    );
}

/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'

import { useState, useEffect, useMemo } from 'react';

import { MdEdit } from 'react-icons/md'

import { MdOutlineDeleteForever } from 'react-icons/md'

import { MdAddToPhotos } from 'react-icons/md'

import { MdOutlineClose } from 'react-icons/md'

import { MdSearch } from 'react-icons/md'

import FormGroupInfo from './FromGroupInfo'

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import ViewActions from '../../../redux/actions/ViewActions';
import userActions from './../../../redux/actions/userActions';
import { connect } from 'react-redux';

import './ListGroups.scss'
import Pagination from '../pagination/Pagination';

const ListGroups = (props) => {
    const [groupItem, setGroupItem] = useState({})

    const [buttonText, setButtonText] = useState('Create')

    const [selectChanged, setSelectChanged] = useState(false)

    const [type, setType] = useState('Type')

    const [startDate, setStartDate] = useState(null)

    const [endDate, setEndDate] = useState(null)

    const [currentPage, setCurrentPage] = useState(1)

    const PageSize = 5;

    const index = props.listGroups.length

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;

        const lastPageIndex = firstPageIndex + PageSize;

        return props.listGroups.slice(firstPageIndex, lastPageIndex)
    }, [currentPage, props.listGroups])


    const PAGE_NUMBER = 1
    const PAGE_SIZE = 5
    const SORT = 'id,asc'

    const handleClickAddGroup = () => {
        setGroupItem({
            name: '',
            type: '',
            createdAt: '',
            totalMember: ''
        })
        setButtonText('Create')

        props.toggleFormGroup(true)
    }

    const handleClickEdit = (item) => {
        setButtonText('Save')

        props.toggleFormGroup(true)

        let groupIndex = props.listGroups.findIndex(x => x.id === item.id)

        setGroupItem(props.listGroups[groupIndex])
    }

    const handleClickDelete = item => {
        props.deleteGroup(item.id)
    }

    const handleClickIconClose = () => {
        setType('Type')
        setSelectChanged(false)
    }

    const onSelectChange = e => {
        setType(e.target.value)
        setSelectChanged(true)
    }

    const handleStartDateChange = (date) => {
        setStartDate(date)
    }

    const handleEndDateChange = (date) => {
        setEndDate(date)
    }

    useEffect(() => {
        props.getListGroups()
    }, [props.createdGroupSuccessfully, props.updateCompleted])

    const clickSearch = () => {
        let groupFilterForm = {
            type: type === 'Type' ? null : type,
            startDate: startDate,
            endDate: endDate,
            pageNumber: PAGE_NUMBER,
            pageSize: PAGE_SIZE,
            sort: SORT
        }
        props.getListGroups(groupFilterForm)
    }

    useEffect(() => {
        props.showLoading(props.isLoading)
    }, [props.isLoading])

    return (
        <div className='list-groups'>
            <div className='content'>
                {
                    props.formGroupIsOpen && <FormGroupInfo groupItem={groupItem} buttonText={buttonText} />
                }
                <div className='filter-form'>
                    <div className='type-filter'>
                        <select
                            className='form-control-filter'
                            value={type}
                            onChange={onSelectChange}
                        >
                            <option value="Type" hidden>Type</option>
                            <option value="BACKEND">BACKEND</option>
                            <option value="FRONTEND">FRONTEND</option>
                            <option value="FULLSTACK">FULLSTACK</option>
                        </select>
                        {
                            selectChanged && <MdOutlineClose onClick={handleClickIconClose} className='icon-close' />
                        }
                    </div>
                    <DatePicker
                        className='form-control-filter'
                        selected={startDate}
                        onChange={handleStartDateChange}
                        name='startDate'
                        dateFormat='dd/MM/yyyy'
                        placeholderText='Start Date'
                    />
                    <DatePicker
                        className='form-control-filter'
                        selected={endDate}
                        onChange={handleEndDateChange}
                        name='endDate'
                        dateFormat='dd/MM/yyyy'
                        placeholderText='End Date'
                    />
                    <div className='icon-search'>
                        <MdSearch onClick={clickSearch} fontSize="1.2rem" />
                    </div>
                </div>
                <div className='icon-add'>
                    <MdAddToPhotos fontSize="1.2rem" style={{ cursor: 'pointer' }}
                        onClick={handleClickAddGroup}
                    />
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Created Date</th>
                            <th>Total Member</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentTableData && currentTableData.map((item, index) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.type}</td>
                                        <td>{item.createdAt}</td>
                                        <td>{item.totalMember}</td>
                                        <td>
                                            <MdEdit fontSize="1.2rem"
                                                style={{ marginRight: '10px', cursor: 'pointer' }}
                                                onClick={() => handleClickEdit(item)}
                                            />
                                            <MdOutlineDeleteForever fontSize="1.2rem"
                                                style={{ marginLeft: '10px', cursor: 'pointer' }}
                                                onClick={() => handleClickDelete(item)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={props.listGroups.length}
                pageSize={PageSize}
                onPageChange={page => setCurrentPage(page)}
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        formGroupIsOpen: state.view.formGroupIsOpen,
        isLoading: state.userInfo.isLoading,
        listGroups: state.userInfo.listGroups,
        totalPagesListGroups: state.userInfo.totalPagesListGroups,
        updateCompleted: state.userInfo.updateCompleted,
        createdGroupSuccessfully: state.userInfo.createdGroupSuccessfully,
        // groupDeleted: state.userInfo.groupDeleted
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        toggleFormGroup: (isOpen) => {
            dispatch(ViewActions.toggleFormGroup(isOpen))
        },
        getListGroups: (groupFilterForm) => {
            dispatch(userActions.getListGroups(groupFilterForm))
        },
        deleteGroup: (id) => {
            dispatch(userActions.deleteGroup(id))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListGroups)
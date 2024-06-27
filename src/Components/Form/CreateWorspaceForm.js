import { CalendarIcon } from '@heroicons/react/20/solid'
import React, { useState } from 'react'
import DatePicker from 'react-datepicker'
import SmallSpinner from '../Spinner/SmallSpinner'

const CreateWorspaceForm = ({
  handleSubmit,
  loading,
  setWorkSpaceType,
  WorkSpaceType
}) => {

  const handleWorkSpaceTypeChange = (event) => {
    setWorkSpaceType(event.target.value)
  }


  return (
    <>
      <div className='flex justify-center mt-6'>
        <div className='w-full max-w-md p-8 space-y-3 text-gray-800 rounded-xl bg-gray-50'>
          <form
            onSubmit={handleSubmit}
            className='space-y-6 ng-untouched ng-pristine ng-valid'
          >
            <div className='space-y-1 text-sm'>
              <label htmlFor='WorkspaceName' className='block text-gray-600'>
               Workspace Name
              </label>
              <input
                className='w-full px-4 py-3 text-gray-800 border border-green-300 focus:outline-green-500 rounded-md bg-green-50'
                name='WorkspaceName'
                id='WorkspaceName'
                type='text'
                placeholder='WorkspaceName'
                required
              />
            </div>
            <div className='space-y-1 text-sm'>
              <label htmlFor='WorkSpaceType' className='block text-gray-600'>
                WorkSpace Type
              </label>
              <select
                id='WorkSpaceType'
                className='w-full px-4 py-3 text-gray-800 border border-green-300 focus:outline-green-500 rounded-md bg-green-50'
                value={WorkSpaceType}
                onChange={handleWorkSpaceTypeChange}
                required
              >
                <option value='' disabled>Select Workspace</option>
                <option value='EngineeringIT' >Engineering IT</option>
                <option value='SmallBusiness'>Small Business</option>
                <option value='Operations'>Operations</option>
                <option value='SalesCRM'>Sales CRM</option>
                <option value='Marketing'>Marketing</option>
                <option value='Education'>Education</option>
                <option value='Others'>Others</option>

              </select>
            </div>
        
             <div className='space-y-1 text-sm'>
              <label htmlFor='WorkspaceDescription' className='block text-gray-600'>
               Workspace Description
              </label>

              <textarea
                id='WorkspaceDescription'
                className='block rounded-md focus:green-300 w-full h-20 px-4 py-3 text-gray-800 bg-green-50 border border-green-300 focus:outline-green-500 '
                name='WorkspaceDescription'
              ></textarea>
            </div>

            <button
              type='submit'
              className='block w-full p-3 text-center font-medium tracking-wide text-white transition duration-200 rounded shadow-md bg-green-500 hover:bg-green-700'
            >
              {loading ? <SmallSpinner /> : 'Save & Continue'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default CreateWorspaceForm

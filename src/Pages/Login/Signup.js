import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PrimaryButton from '../../Components/Button/PrimaryButton'
import { AuthContext } from '../../contexts/AuthProvider'
import toast from 'react-hot-toast'
import SmallSpinner from '../../Components/Spinner/SmallSpinner'
import { setAuthToken } from '../../api/auth'

const Signup = () => {
  const {
    createUser,
    updateUserProfile,
    verifyEmail,
    loading,
    setLoading,
    signInWithGoogle,
  } = useContext(AuthContext)

  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard/create-workspace'

  const handleSubmit = event => {
    event.preventDefault()
    const name = event.target.name.value

    const email = event.target.email.value
    const password = event.target.password.value

    // Image Upload
    const image = event.target.image.files[0]
    const formData = new FormData()
    formData.append('image', image)
    const url = `https://api.imgbb.com/1/upload?key=3aab628f129005fa6716e3877d1a82c1`

    fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(imageData => {
        // Create User
        createUser(email, password)
          .then(result => {
            setAuthToken(result.user)
            updateUserProfile(name, imageData.data.display_url)
              .then(
                verifyEmail().then(() => {
                  toast.success(
                    'Please check your email for verification link.'
                  )
                  setLoading(false)
                  navigate(from, { replace: true })
                })
              )
              .catch(err => console.log(err))
          })

          .catch(err => {
            console.log(err)
            setLoading(false)
          })
      })
      .catch(err => console.log(err))
  }

  const handleGoogleSignin = () => {
    signInWithGoogle().then(result => {
      console.log(result.user)
      setAuthToken(result.user)
      setLoading(false)
      navigate(from, { replace: true })
    })
  }

  return (
    <div className='flex justify-center items-center pt-8'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Signup</h1>
          <p className='text-sm text-gray-400'>Create a new account</p>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate=''
          action=''
          className='space-y-12 ng-untouched ng-pristine ng-valid'
        >
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Name
              </label>
              <input
                type='text'
                name='name'
                id='name'
                placeholder='Enter Your Name Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-green-500 bg-gray-200 text-gray-900'
                data-temp-mail-org='0'
              />
            </div>
            <div>
              <label htmlFor='image' className='block mb-2 text-sm'>
                Select Image:
              </label>
              <input
                required
                type='file'
                id='image'
                name='image'
                accept='image/*'
              />
            </div>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                required
                type='email'
                name='email'
                id='email'
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-green-500 bg-gray-200 text-gray-900'
                data-temp-mail-org='0'
              />
            </div>
            <div>
              <div className='flex justify-between mb-2'>
                <label htmlFor='password' className='text-sm'>
                  Password
                </label>
              </div>
              <input
                required
                type='password'
                name='password'
                id='password'
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 bg-gray-200 focus:outline-green-500 text-gray-900'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <div>
              <PrimaryButton
                type='submit'
                classes='w-full px-8 py-3 font-semibold rounded-md bg-gray-900 hover:bg-gray-700 hover:text-white text-gray-100'
              >
                {loading ? <SmallSpinner /> : 'Sign Up'}
              </PrimaryButton>
            </div>
          </div>
        </form>
      
        <p className='px-6 text-sm text-center text-gray-400'>
          Already have an account yet?{' '}
          <Link to='/login' className='hover:underline text-gray-600'>
            Sign In
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default Signup

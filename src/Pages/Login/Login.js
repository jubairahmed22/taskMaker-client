import React, { useContext, useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PrimaryButton from '../../Components/Button/PrimaryButton'
import { AuthContext } from '../../contexts/AuthProvider'
import SmallSpinner from '../../Components/Spinner/SmallSpinner'
import { setAuthToken } from '../../api/auth'

const Login = () => {
  const [userEmail, setUserEmail] = useState('')
  const { signin, loading, setLoading, signInWithGoogle, resetPassword } =
    useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard/create-workspace'

  const handleSubmit = event => {
    event.preventDefault()
    const email = event.target.email.value
    const password = event.target.password.value

    signin(email, password)
      .then(result => {
        toast.success('Login Successful.....!')
        // Get Token
        setLoading(false)
        setAuthToken(result.user)
        navigate(from, { replace: true })
      })
      .catch(err => {
        toast.error(err.message)
        console.log(err)
        setLoading(false)
      })
  }

  const handleGoogleSignin = () => {
    signInWithGoogle().then(result => {
      console.log(result.user)
      setAuthToken(result.user)
      setLoading(false)
      navigate(from, { replace: true })
    })
  }

  // Pass reset
  const handleReset = () => {
    resetPassword(userEmail)
      .then(() => {
        toast.success('Please check your email for reset link')
      })
      .catch(err => {
        toast.error(err.message)
        console.log(err)
        setLoading(false)
      })
  }

  return (
    <div className='flex justify-center items-center pt-8'>
      <div className='flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-gray-100 text-gray-900'>
        <div className='mb-8 text-center'>
          <h1 className='my-3 text-4xl font-bold'>Sign in</h1>
          <p className='text-sm text-gray-400'>
            Sign in to access your account
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          noValidate=''
          action=''
          className='space-y-6 ng-untouched ng-pristine ng-valid'
        >
          <div className='space-y-4'>
            <div>
              <label htmlFor='email' className='block mb-2 text-sm'>
                Email address
              </label>
              <input
                onBlur={event => setUserEmail(event.target.value)}
                type='email'
                name='email'
                id='email'
                required
                placeholder='Enter Your Email Here'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-green-500 bg-gray-200 text-gray-900'
                data-temp-mail-org='0'
              />
            </div>
            <div>
              <div className='flex justify-between'>
                <label htmlFor='password' className='text-sm mb-2'>
                  Password
                </label>
              </div>
              <input
                type='password'
                name='password'
                id='password'
                required
                placeholder='*******'
                className='w-full px-3 py-2 border rounded-md border-gray-300 focus:outline-green-500 bg-gray-200 text-gray-900'
              />
            </div>
          </div>

          <div>
            <PrimaryButton
              type='submit'
              classes='w-full px-8 py-3 font-semibold rounded-md bg-gray-900 hover:bg-gray-700 hover:text-white text-gray-100'
            >
              {loading ? <SmallSpinner /> : 'Sign in'}
            </PrimaryButton>
          </div>
        </form>
       
        
        <p className='px-6 text-sm text-center text-gray-400'>
          Don't have an account yet?{' '}
          <Link to='/signup' className='hover:underline text-gray-600'>
            Sign up
          </Link>
          
        </p>
      </div>
    </div>
  )
}

export default Login

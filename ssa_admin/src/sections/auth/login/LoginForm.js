import * as Yup from 'yup';
import { useState,useEffect } from 'react';
import { useNavigate,useLocation} from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from 'src/components/Spinner';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import { UseContextState } from '../../../global/GlobalContext/GlobalContext'
import {config} from "../../../global/globalConfig"
// ----------------------------------------------------------------------

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error , setError ] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/";
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  // const {
  //   handleSubmit,
  //   form},
  // } = methods;

  const {authState,fetchAuthuser} = UseContextState();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/admin/login`,{email,password},{withCredentials:true})
    .then(res=>{
      console.log(res)
      if(res?.data?.status === true){
        console.log("CALLED")
        setLoading(false)
        fetchAuthuser()
        navigate(from,{replace:true});
        setError("")
      }else{
        setError("Invalid email or password !!")
        setLoading(false)
      }

    })
    .catch(err=>{
      console.log(err)
    })
  };

 



  return (
    <div>
       <LoadingSpinner loading={loading} />
      {error && (<p className='show-error-login' >{error}</p>)}
       <FormProvider methods={methods} onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <RHFTextField
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        required
         name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          required
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <RHFCheckbox name="remember" label="Remember me" />
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" >
        Login
      </LoadingButton>
    </FormProvider>
    </div>
  );
}

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getSingleB2bAccountDetails } from 'src/api/b2bApproval'
import LoadingSpinner from 'src/components/Spinner'
import classes from './B2bApproval.module.css'
import { FormControlLabel, Stack } from '@mui/material'
import Switch from '@mui/material/Switch';

function B2bApproval() {
    const [isLoading, setIsLoading] = useState(false)
    const params = useParams()

    const getUserAccountInfo = async function() {
        try {
            setIsLoading(true)
            const response = await getSingleB2bAccountDetails()
            setIsLoading(false)
        }catch(err) {
            setIsLoading(false)
        }
    }

    const approveHandler = function() {
        const paramId = params?.id;
        if(paramId) {
            console.log('call the api')
        }
    }

    useEffect(() => {
        if(params) {
            getUserAccountInfo()
        }
    }, [params])

    return (
        <div>
            <LoadingSpinner loading={isLoading} />
            <div>
                <h1 className={classes['heading']}>Account approval</h1>
                <p className={classes['para']}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut in ipsam asperiores, est iusto deserunt amet voluptatibus ipsum incidunt explicabo?</p>
                <div>
                    <Stack margin={1} width={100}>
                        <FormControlLabel onChange={approveHandler} control={<Switch defaultChecked />} label="Approval" />
                    </Stack>
                </div>
            </div>
        </div>
    )
}

export default B2bApproval